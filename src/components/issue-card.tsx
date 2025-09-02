"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, MapPin, CheckCircle2 } from "lucide-react";
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

const statuses: IssueStatus[] = ["Pending", "Confirmation", "Acknowledgment", "Resolution"];
const statusIndex = (status: IssueStatus) => statuses.indexOf(status);


export function IssueCard({ issue }: IssueCardProps) {
  const [voteCount, setVoteCount] = useState(0);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

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
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Status
          </span>
          <span className="text-xs font-bold text-foreground">
            {issue.status}
          </span>
        </div>
        <div className="relative flex items-center w-full">
            <div className="absolute h-1 w-full bg-secondary rounded-full">
                <motion.div
                    className="h-1 rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(statusIndex(issue.status) / (statuses.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </div>
            <div className="relative w-full flex justify-between items-center">
                {statuses.map((status, index) => (
                    <div key={status} className="flex flex-col items-center">
                       <motion.div
                            className={cn(
                                "h-3 w-3 rounded-full bg-secondary border-2 border-secondary transition-colors duration-500",
                                statusIndex(issue.status) >= index && "bg-gradient-to-br from-teal-400 to-blue-500 border-teal-200"
                            )}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            {statusIndex(issue.status) >= index && (
                                <motion.div initial={{scale:0}} animate={{scale:1}} className="text-white flex items-center justify-center h-full w-full">
                                    <CheckCircle2 size={10} className="text-primary-foreground opacity-75"/>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
        <div className="w-full flex justify-between items-center mt-2 text-xs text-muted-foreground">
            {statuses.map((status) => (
                 <span key={status} className={cn("w-1/4 text-center", issue.status === status && "font-bold text-foreground")}>
                    {status}
                </span>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
