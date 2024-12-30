import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center gap-5 p-4 text-center text-2xl font-bold"
      }
    >
      <h2>Uh oh! We couldn&#39;t find the challenge you were looking for.</h2>
      <Button asChild className={"font-bold"}>
        <Link href="/">Explore Challenges</Link>
      </Button>
    </div>
  );
}
