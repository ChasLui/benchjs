import { Link } from "react-router";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import type { Route } from "../../src/routes/+types/home";

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    //
    { title: "BenchJS" },
    { name: "description", content: "BenchJS - lean JavaScript benchmarking" },
  ];
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-16 justify-center pt-16 pb-4">
        {/* hero */}
        <div className="flex flex-col flex-1 gap-8 items-center min-h-0">
          <h1 className="text-4xl font-bold">Welcome to BenchJS</h1>

          <div className="flex flex-col gap-1 items-center">
            <p>
              BenchJS is a web app that helps you benchmark JavaScript code.
            </p>
            <p>It supports TypeScript and multiple benchmarking libraries.</p>
            <p>There is no backend and everything runs in the browser.</p>
          </div>

          <Link className="text-zinc-900 hover:text-zinc-700" to="/playground">
            <Button>Create a new benchmark</Button>
          </Link>
        </div>

        {/* features */}
        <div className="flex flex-col gap-8 items-center">
          <h2 className="text-2xl font-bold">Features</h2>
          <ul className="flex flex-col gap-1 list-disc list-inside">
            <li>Easy to use</li>
            <li>Supports TypeScript</li>
            <li>Multiple benchmarking libraries</li>
            <li>No backend</li>
          </ul>
        </div>
      </main>
    </>
  );
}
