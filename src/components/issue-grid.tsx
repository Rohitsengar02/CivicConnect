
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
}

async function getIssues() {
  const db = getFirestore(app);
  
  const profiledIssuesCol = collection(db, "profiledIssues");
  const anonymousIssuesCol = collection(db, "anonymousIssues");

  const [profiledSnapshot, anonymousSnapshot] = await Promise.all([
    getDocs(profiledIssuesCol),
    getDocs(anonymousIssuesCol)
  ]);

  const profiledList = profiledSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Issue));

  const anonymousList = anonymousSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Issue));
  
  return [...profiledList, ...anonymousList];
}

export async function IssueGrid() {
  const issues = await getIssues();
  
  const issuesWithClientProps = issues.map((issue) => ({
    ...issue,
    createdAt: issue.createdAt.toDate().toISOString(), // Convert Timestamp to ISO string
    id: issue.id.toString(), // Ensure id is a string, just in case
    reporter: issue.reporterName || "Anonymous",
    avatarUrl: issue.avatarUrl || null,
    imageUrl: issue.imageUrls?.[0] || "https://picsum.photos/800/600",
    time: issue.createdAt.toDate().toLocaleDateString(),
    aiHint: issue.aiHint || "issue image",
  }));


  return (
    <section className="py-4">
        <IssueGridClient issues={issuesWithClientProps} />
    </section>
  );
}
