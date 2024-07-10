import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Challenge | UIZard",
  description: "frontend challenge w Next JS, TypeScript and Tailwind",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function ListItmeLoading() {
  return (
    <div className="h-[64px] grid items-center">
      <div className="w-full animate-pulse" role="status">
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <span className="sr-only">Loading...</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-full animate-pulse" role="status">
          <div className="h-2.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <span className="sr-only">Loading...</span>
        </div>
        <div className="w-full animate-pulse" role="status">
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}

async function ListItem({ id }: { id: number }) {
  await sleep(Math.random() * 3000);

  const post = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
  ).then(
    (res) => res.json() as Promise<{ title: string; url: string; by: string }>
  );
  return (
    <div className=" h-[64px] flex flex-col gap-2">
      {/* porque algunos no tienen title */}
      <p className="truncate">{post.title || post.by}</p>
      <div className="md:flex hidden items-center justify-between opacity-50">
        <p>{post.by}</p>
        <p>Visit website {`>>`}</p>
      </div>
    </div>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* nuestro posts es un number array */
  const posts = await fetch(
    `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty&limitToFirst=10&orderBy="$key"`
  ).then((res) => res.json() as Promise<number[]>);

  return (
    <html lang="en">
      <body className="grid h-screen grid-rows-[60px,1fr]">
        <header className="bg-gray-800 font-semibold text-white grid place-content-center ">
          Uizard Hackernews Reader
        </header>
        <main className="grid md:grid-cols-[320px,1fr] grid-cols-[120px,1fr]">
          <aside className="bg-gray-800">
            <ul className="flex flex-col mt-8">
              {posts.map((id) => (
                <li key={id} className="hover:bg-gray-600 px-4 py-2">
                  <Link href={`/${id}`}>
                    <Suspense fallback={<ListItmeLoading />}>
                      <ListItem id={id} />
                    </Suspense>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <section>{children}</section>
        </main>
      </body>
    </html>
  );
}
