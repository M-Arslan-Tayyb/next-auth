import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          Welcome to ChatSync
        </h1>
        <p className="text-muted-foreground mb-6 text-lg">
          A modern real-time chat app powered by <strong>NextAuth</strong> for
          authentication and <strong>Socket.IO</strong> for blazing-fast
          messaging.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Already have an account?
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
