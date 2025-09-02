"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

type Issue = {
  id: number;
  reporter: string;
  avatarUrl: string | null;
  time: string;
  imageUrl: string;
  title: string;
  district: string;
  category: string;
  description: string;
  aiHint: string;
};

type IssueCardProps = {
  issue: Issue;
};

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg"
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    {issue.avatarUrl && <AvatarImage src={issue.avatarUrl} alt={issue.reporter} />}
                    <AvatarFallback>
                    {issue.reporter
                        .split(" ")
                        .map((n) => n[0])
                        .join("") || "A"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{issue.reporter}</p>
                    <p className="text-xs text-muted-foreground">{issue.time}</p>
                </div>
            </div>
            <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <Bookmark size={20} />
            </button>
        </div>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-b-2xl">
        <Image
          src={issue.imageUrl}
          alt={issue.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={issue.aiHint}
        />
      </div>
    </motion.div>
  );
}
