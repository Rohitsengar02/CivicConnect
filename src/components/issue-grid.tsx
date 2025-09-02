import { IssueGridClient } from "./issue-grid-client";

const issues = [
  {
    id: 1,
    reporter: "Ravi Kumar",
    avatarUrl: "https://picsum.photos/id/1005/48/48",
    time: "5 min ago",
    imageUrl: "https://picsum.photos/600/400?random=1",
    title: "Large Pothole on Main St",
    district: "Ranchi",
    category: "Roads",
    aiHint: "pothole road",
  },
  {
    id: 2,
    reporter: "Priya Sharma",
    avatarUrl: "https://picsum.photos/id/1011/48/48",
    time: "30 min ago",
    imageUrl: "https://picsum.photos/600/400?random=2",
    title: "Streetlight not working",
    district: "Dhanbad",
    category: "Electricity",
    aiHint: "dark street",
  },
  {
    id: 3,
    reporter: "Anonymous",
    avatarUrl: null,
    time: "1 hour ago",
    imageUrl: "https://picsum.photos/600/400?random=3",
    title: "Garbage overflow",
    district: "Patna",
    category: "Sanitation",
    aiHint: "garbage pile",
  },
  {
    id: 4,
    reporter: "Anjali Singh",
    avatarUrl: "https://picsum.photos/id/1027/48/48",
    time: "3 hours ago",
    imageUrl: "https://picsum.photos/600/400?random=4",
    title: "Broken Water Pipe",
    district: "Lucknow",
    category: "Water Supply",
    aiHint: "leaking pipe",
  },
    {
    id: 5,
    reporter: "Amit Patel",
    avatarUrl: "https://picsum.photos/id/10/48/48",
    time: "8 hours ago",
    imageUrl: "https://picsum.photos/600/400?random=5",
    title: "Fallen Tree Blocking Road",
    district: "Ranchi",
    category: "Public Safety",
    aiHint: "fallen tree",
  },
  {
    id: 6,
    reporter: "Sunita Devi",
    avatarUrl: "https://picsum.photos/id/12/48/48",
    time: "1 day ago",
    imageUrl: "https://picsum.photos/600/400?random=6",
    title: "Open Manhole Cover",
    district: "Patna",
    category: "Sanitation",
    aiHint: "open manhole",
  },
];

export function IssueGrid() {
  const issuesWithDescriptions = issues.map((issue) => ({
    ...issue,
    description: `A new issue has been reported in the '${issue.category}' category. Please look into it.`,
  }));

  return (
    <section className="bg-secondary/50 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <IssueGridClient issues={issuesWithDescriptions} />
      </div>
    </section>
  );
}
