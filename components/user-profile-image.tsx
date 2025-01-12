"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserIcon } from "lucide-react";

type UserProfileImageProps = {
  profileImageSrc: string | null;

  noProfileImageClassName?: string;
};

const UserProfileImage = ({
  profileImageSrc,

  noProfileImageClassName,
}: UserProfileImageProps) => {
  return profileImageSrc ? (
    <Image src={profileImageSrc} alt={"user profile image"} fill />
  ) : (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        noProfileImageClassName,
      )}
    >
      <UserIcon className={"h-full w-full"} />
    </div>
  );
};

export default UserProfileImage;
