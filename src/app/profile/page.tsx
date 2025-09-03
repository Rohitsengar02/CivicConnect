import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              My Profile
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              User profiles, issue history, and settings will be managed here. This feature is coming soon!
            </p>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
