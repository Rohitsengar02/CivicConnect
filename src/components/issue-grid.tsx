
import { getFirestore, collection, getDocs, Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { IssueGridClient } from "./issue-grid-client";

interface Issue {
  id: string;
  reporterName?: string;
  avatarUrl?: string | null;
  createdAt: Timestamp;
  imageUrls: string[];
  title: string;
  district: string;
  category: string;
  status: "Pending" | "Confirmation" | "Acknowledgment" | "Resolution";
  description: string;
  aiHint?: string;
  address: string;
}

async function getIssues() {
  const db = getFirestore(app);
  
  const collectionsToFetch = [
      collection(db, "profiledIssues"),
      collection(db, "anonymousIssues")
  ];

  const allIssues: Issue[] = [];

  for (const coll of collectionsToFetch) {
      const snapshot = await getDocs(coll);
      const issues = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      } as Issue));
      allIssues.push(...issues);
  }
  
  return allIssues;
}

export async function IssueGrid() {
  const issues = await getIssues();
  
  const issuesWithClientProps = issues.map((issue) => ({
    ...issue,
    createdAt: issue.createdAt.toDate().toISOString(),
    id: issue.id,
    reporter: issue.reporterName || "Anonymous",
    avatarUrl: issue.avatarUrl || null,
    imageUrl: issue.imageUrls?.[0] || "https://picsum.photos/800/600",
    time: "Deprecated", // This will be handled on the client from createdAt
    aiHint: issue.aiHint || "issue image",
  }));


  return (
    <section className="py-4">
        <IssueGridClient issues={issuesWithClientProps} />
    </section>
  );
}
