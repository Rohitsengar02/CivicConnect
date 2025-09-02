"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { motion, useAnimation } from "framer-motion";
import { ArrowUp, ArrowDown, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type IssueStatus = "Pending" | "Confirmation" | "Acknowledgment" | "Resolution";

type Issue = {
  id: number;
  reporter: string;
  avatarUrl: string | null;
  time: string;
  imageUrl: string;
  title: string;
  district: string;
  category: string;
  status: IssueStatus;
  description: string;
  aiHint: string;
};

type IssueCardProps = {
  issue: Issue;
};

const statusConfig: Record<IssueStatus, { value: number; color: string }> = {
  Pending: { value: 10, color: "bg-yellow-500" },
  Confirmation: { value: 40, color: "bg-blue-500" },
  Acknowledgment: { value: 70, color: "bg-purple-500" },
  Resolution: { value: 100, color: "bg-green-500" },
};

export function IssueCard({ issue }: IssueCardProps) {
  const [voteCount, setVoteCount] = useState(0);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const controls = useAnimation();
  const progressValue = statusConfig[issue.status].value;
  const progressColor = statusConfig[issue.status].color;

  useEffect(() => {
    controls.start({
      width: `${progressValue}%`,
      transition: { duration: 1, ease: "easeInOut" },
    });
  }, [progressValue, controls]);


  const handleUpvote = () => {
    if (voted === "up") {
      setVoteCount(voteCount - 1);
      setVoted(null);
    } else {
      setVoteCount(voteCount + (voted === "down" ? 2 : 1));
      setVoted("up");
    }
  };

  const handleDownvote = () => {
    if (voted === "down") {
      setVoteCount(voteCount + 1);
      setVoted(null);
    } else {
      setVoteCount(voteCount - (voted === "up" ? 2 : 1));
      setVoted("down");
    }
  };


  return (
    <motion.div
      initial={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative overflow-hidden rounded-2xl border border-white/20 bg-card/50 text-card-foreground backdrop-blur-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={issue.imageUrl}
          alt={issue.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={issue.aiHint}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
            <h3 className="font-headline text-lg font-semibold tracking-tight truncate">{issue.title}</h3>
            <Badge variant="secondary" className="bg-background/70 backdrop-blur-sm shrink-0">
                <MapPin className="mr-1.5 h-3 w-3" />
                {issue.district}
            </Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
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
            <div className="flex items-center gap-1">
                <button 
                    onClick={handleUpvote}
                    className={cn(
                        "rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent",
                        voted === "up" ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" : "hover:text-green-500"
                    )}>
                    <ArrowUp size={20} />
                </button>
                <span className="text-sm font-semibold w-6 text-center">{voteCount}</span>
                <button 
                    onClick={handleDownvote}
                    className={cn(
                        "rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent",
                         voted === "down" ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400" : "hover:text-red-500"
                    )}>
                    <ArrowDown size={20} />
                </button>
            </div>
        </div>
      </div>
       <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Status
          </span>
          <span className="text-xs font-bold text-foreground">
            {issue.status}
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className={cn("absolute left-0 top-0 h-full rounded-full", progressColor)}
            initial={{ width: "0%" }}
            animate={controls}
          />
        </div>
      </div>
    </motion.div>
  );
}
