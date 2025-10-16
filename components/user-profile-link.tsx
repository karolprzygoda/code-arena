"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Portal } from "@radix-ui/react-hover-card";
import { Badge } from "@/components/ui/badge";
import { ShieldHalf } from "lucide-react";
import UserProfileImage from "@/components/user-profile-image";
import { UserRoles, Users } from "@prisma/client";

type UserProfileLinkProps = {
  user: Users & { userRoles: Array<Pick<UserRoles, "role">> };
};

const UserProfileLink = ({ user }: UserProfileLinkProps) => {
  const userName = user?.email?.split("@").at(0);

  return (
    <HoverCard>
      <HoverCardTrigger
        href={`/profile/${userName}`}
        className={
          "flex items-center bg-[linear-gradient(to_right,theme(colors.purple.700),theme(colors.purple.500),theme(colors.pink.600),theme(colors.orange.700),theme(colors.pink.600),theme(colors.purple.500),theme(colors.purple.700))] bg-[length:200%_auto] bg-clip-text p-0 text-xs font-semibold text-transparent hover:animate-gradient dark:bg-[linear-gradient(to_right,theme(colors.purple.400),theme(colors.purple.300),theme(colors.pink.300),theme(colors.orange.400),theme(colors.pink.300),theme(colors.purple.300),theme(colors.purple.400))]"
        }
      >
        @{userName}
      </HoverCardTrigger>
      <Portal>
        <HoverCardContent
          className={"w-min min-w-[250px] bg-zinc-100 dark:bg-zinc-900"}
          align={"start"}
          avoidCollisions
          side={"bottom"}
        >
          <div className={"flex space-x-4"}>
            <div
              className={"flex flex-col items-center justify-center space-y-2"}
            >
              <div
                className={
                  "w-min rounded-full bg-gradient-to-r from-rose-400 to-orange-500 p-0.5 dark:from-rose-400 dark:to-orange-300"
                }
              >
                <span
                  className={
                    "relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full"
                  }
                >
                  <UserProfileImage
                    profileImageSrc={user.profile_picture}
                    noProfileImageClassName={"bg-zinc-100 dark:bg-zinc-900 p-2"}
                  />
                </span>
              </div>
            </div>
            <div className={"flex w-max flex-col space-y-2"}>
              <h2
                className={
                  "w-fit bg-[linear-gradient(to_right,theme(colors.purple.700),theme(colors.purple.500),theme(colors.pink.600),theme(colors.orange.700),theme(colors.pink.600),theme(colors.purple.500),theme(colors.purple.700))] bg-[length:200%_auto] bg-clip-text font-semibold text-transparent dark:bg-[linear-gradient(to_right,theme(colors.purple.400),theme(colors.purple.300),theme(colors.pink.300),theme(colors.orange.400),theme(colors.pink.300),theme(colors.purple.300),theme(colors.purple.400))]"
                }
              >
                @{userName}
              </h2>
              {!!user.userRoles.find(
                (userRole) => userRole.role === "ADMIN",
              ) && (
                <div className={"flex flex-wrap gap-2"}>
                  <Badge
                    className={
                      "gap-1 rounded-full bg-sky-600 text-white hover:bg-sky-600"
                    }
                  >
                    <ShieldHalf className={"h-4 w-4"} />
                    Admin
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </HoverCardContent>
      </Portal>
    </HoverCard>
  );
};

export default UserProfileLink;
