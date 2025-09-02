"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { MapPin, Lightbulb, Wrench, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DistrictSelect } from "@/components/district-select";

const FloatingIcons = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icons = Array.from(containerRef.current?.children || []);
    icons.forEach((icon) => {
      gsap.to(icon, {
        y: Math.random() * 40 - 20,
        x: Math.random() * 40 - 20,
        scale: 1 + Math.random() * 0.2,
        duration: 5 + Math.random() * 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  const iconClasses =
    "absolute text-primary/10 dark:text-primary/20 pointer-events-none";

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <Wrench className={iconClasses} style={{ top: '10%', left: '15%' }} size={64} />
      <Lightbulb className={iconClasses} style={{ top: '20%', right: '10%' }} size={80} />
      <Trash2 className={iconClasses} style={{ bottom: '15%', left: '25%' }} size={72} />
      <MapPin className={iconClasses} style={{ bottom: '10%', right: '20%' }} size={56} />
    </div>
  );
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden bg-background/50 py-20">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 -z-10 bg-grid-primary/5 [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]"></div>
      <FloatingIcons />
      
      <div className="container z-10 mx-auto flex flex-col items-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-6xl"
        >
          Report Civic Issues.
          <br />
          Improve Your City.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
        >
          Choose your district or use live location to explore reported issues
          near you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="animate-pulse">
            <MapPin className="mr-2 h-5 w-5" />
            Use My Location
          </Button>
          <DistrictSelect />
        </motion.div>
      </div>
    </section>
  );
}
