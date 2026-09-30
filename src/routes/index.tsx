import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Layers,
  LogIn,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  UserPlus,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";

const FEATURES = [
  {
    icon: Upload,
    title: "Drop in a PDF",
    description:
      "Upload documents and they are queued, parsed and chunked automatically.",
  },
  {
    icon: Search,
    title: "Semantic search",
    description:
      "Every page is embedded, so queries match meaning rather than keywords.",
  },
  {
    icon: Layers,
    title: "Organise into notebooks",
    description:
      "Group related documents together and keep each workspace separate.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Each notebook belongs to its owner. No other account can read or delete it.",
  },
] as const;

export const Route = createFileRoute("/")({
  component: LandingPage,
  // Intentionally public: no beforeLoad guard, so signed-out visitors land here
  // instead of being bounced to the sign-in screen.
});

function LandingPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between gap-4 px-2 py-4">
        <span className="font-heading text-lg font-semibold">LexiFlow</span>

        {user ? (
          <Link to="/notebook">
            <Button>
              Open notebooks
              <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/auth/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/auth/register">
              <Button>
                Get started
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex flex-1 flex-col justify-center gap-14 px-2 py-10">
        <section className="max-w-2xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
            <Sparkles className="size-4" />
            Document processing, end to end
          </p>

          <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Ask your documents questions and get real answers.
          </h1>

          <p className="mt-4 text-lg text-pretty text-muted-foreground">
            LexiFlow parses, chunks and embeds your PDFs, then lets you search
            across everything you have uploaded — without leaving the browser
            tab you are already in.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {user ? (
              <Link to="/notebook">
                <Button size="lg">
                  Go to your notebooks
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/register">
                  <Button size="lg">
                    <UserPlus data-icon="inline-start" />
                    Create an account
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline">
                    <LogIn data-icon="inline-start" />
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>

          {user && (
            <p className="mt-4 text-sm text-muted-foreground">
              Signed in as {user.email}
            </p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="text-muted-foreground size-5" />

                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>

      <footer className="text-muted-foreground flex items-center gap-2 border-t px-2 py-4 text-sm">
        <Zap className="size-4" />
        Parsing and embedding run in the background.
      </footer>
    </div>
  );
}