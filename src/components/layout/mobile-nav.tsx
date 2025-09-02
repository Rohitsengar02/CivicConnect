"use client";

import { Home, MessageSquare, Search, Bookmark, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: Search, label: "Explore" },
  { icon: MessageSquare, label: "Chats", active: true },
  { icon: Home, label: "Home" },
  { icon: Bookmark, label: "Saved" },
  { icon: User, label: "Profile" },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-2 backdrop-blur-sm md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item, index) => (
          <div key={item.label} className="flex flex-col items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`relative flex h-16 w-16 flex-col items-center justify-center rounded-2xl transition-colors ${
                item.active
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {
                index === 2 ? 
                <div className="absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <item.icon
                        size={28}
                        strokeWidth={item.active ? 2.5 : 2}
                    />
                </div> :
                <item.icon
                    size={24}
                    strokeWidth={item.active ? 2.5 : 2}
                />
              }

              { index !== 2 && <span className="text-xs mt-1">{item.label}</span> }
              {item.label === 'Chats' && (
                <span className="absolute top-3 right-4 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </motion.button>
          </div>
        ))}
      </div>
    </nav>
  );
}
