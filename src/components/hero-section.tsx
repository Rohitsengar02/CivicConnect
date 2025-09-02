"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative w-full bg-background pt-20">
      <div className="container z-10 mx-auto flex flex-col items-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl"
        >
          Find & Report Civic Issues
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-2 max-w-2xl text-lg text-muted-foreground"
        >
          Help improve your community by reporting local problems.
        </motion.p>
      </div>
    </section>
  );
}
