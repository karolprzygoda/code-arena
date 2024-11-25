"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

const SignOutButton = ({ className }: { className?: string }) => {
  const handleSignOut = async () => {
    console.log("sign out");
  };

  return (
    <Button
      className={cn(
        "h-8 justify-start bg-opacity-50 px-2 text-red-500 hover:bg-red-500/20 hover:text-red-500",
        className,
      )}
      onClick={handleSignOut}
      variant="ghost"
    >
      <span className="flex items-center gap-2 text-red-500">
        <LogOut className={"h-5 w-5"} />
        Log out
      </span>
    </Button>
  );
};

export default SignOutButton;
