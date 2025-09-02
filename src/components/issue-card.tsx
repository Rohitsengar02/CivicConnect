"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Bookmark, ThumbsUp } from "lucide-react";

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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-md transition-shadow hover:shadow-xl"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
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
      </div>

      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={issue.imageUrl}
          alt={issue.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={issue.aiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-3 left-4 font-headline text-lg font-semibold text-white">
          {issue.title}
        </h3>
      </div>
      
      <div className="p-4">
        <p className="mb-4 text-sm text-muted-foreground">{issue.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{issue.district}</Badge>
          <Badge variant="outline">{issue.category}</Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 border-t p-2">
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <ThumbsUp size={18} />
          </button>
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <Bookmark size={18} />
          </button>
      </div>

    </motion.div>
  );
}
