"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex h-[50vh] w-full items-center justify-center bg-background pt-20">
       <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-b from-background via-background/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      <div className="container z-10 mx-auto flex flex-col items-center px-4 pt-16 text-center">
        <h1
          className="font-headline text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          Improve Your <span className="text-primary">Community</span>
        </h1>
        <h2 className="mt-2 font-headline text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            We will drive it's <span className="text-primary">Growth</span>
        </h2>
        <p
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          CivicConnect empowers you to report local issues, connect with your community, and build a better neighborhood together.
        </p>
      </div>
    </section>
  );
}
