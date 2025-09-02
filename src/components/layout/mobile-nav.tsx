"use client";

import { Home, PlusCircle, Map, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: PlusCircle, label: "Report" },
  { icon: Map, label: "Map" },
  { icon: Bell, label: "Notifications" },
  { icon: User, label: "Profile" },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 p-2 backdrop-blur-sm md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`flex h-12 w-16 flex-col items-center justify-center rounded-lg transition-colors ${
                item.active
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <item.icon
                size={24}
                strokeWidth={item.active ? 2.5 : 2}
              />
               <span className="text-xs">{item.label}</span>
            </motion.button>
          </div>
        ))}
      </div>
    </nav>
  );
}
