import Counter from "@/components/Counter";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">My Music App</h1>
      <Counter />
      <Link href="/search" className="text-green-400 underline">
      Go to Search
      </Link>
    </div>
  );
}
