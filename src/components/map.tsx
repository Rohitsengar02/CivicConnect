'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

type Location = {
  lat: number;
  lng: number;
};

type MapProps = {
  location: Location | null;
  path: Location[];
};

type LeafletType = typeof import('leaflet');

const MapComponent = ({ location, path }: MapProps) => {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [leaflet, setLeaflet] = useState<LeafletType | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Create person icon function
  const createPersonIcon = (L: any) => {
    if (!L) return null;
    
    return L.divIcon({
      className: 'custom-person-marker',
      html: `<div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  // Load Leaflet on client-side only
  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      // Set default icon path for Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      
      setLeaflet(L);
      setIsMounted(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Initialize map when Leaflet is loaded and container is ready
  useEffect(() => {
    if (!isMounted || !leaflet || !mapContainerRef.current) return;

    // Create map instance
    mapRef.current = leaflet.map(mapContainerRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });

    // Add tile layer
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Handle initial location
    if (location) {
      mapRef.current.setView([location.lat, location.lng], 16);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted, leaflet]);

  // Update map when location changes
  useEffect(() => {
    if (!isMounted || !mapRef.current || !location || !leaflet) return;

    // Update map view
    mapRef.current.flyTo([location.lat, location.lng], 16, {
      animate: true,
      duration: 1,
    });

    // Update or add marker
    if (markerRef.current) {
      markerRef.current.setLatLng([location.lat, location.lng]);
    } else if (mapRef.current) {
      markerRef.current = leaflet.marker([location.lat, location.lng], {
        icon: createPersonIcon(leaflet),
      }).addTo(mapRef.current);
    }
  }, [location, isMounted, leaflet]);

  // Update path when it changes
  useEffect(() => {
    if (!isMounted || !mapRef.current || !path?.length || !leaflet) return;

    const latLngs = path.map(p => [p.lat, p.lng] as [number, number]);
    
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latLngs);
    } else {
      polylineRef.current = leaflet.polyline(latLngs, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        lineJoin: 'round',
      }).addTo(mapRef.current);
    }
    
    // Fit bounds to show the entire path if there are multiple points
    if (path.length > 1) {
      const bounds = leaflet.latLngBounds(latLngs);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [path, isMounted, leaflet]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg z-0"
      style={{ minHeight: '300px' }}
    />
  );
};

// Export a dynamic version of the Map component that only renders on the client side
export default dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-lg" />,
});