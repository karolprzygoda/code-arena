import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserIcon } from "lucide-react";

type UserProfileImageProps = {
  noProfileImageClassName?: string;
  profileImageSrc: string | null;
};

const UserProfileImage = ({
  noProfileImageClassName,
  profileImageSrc,
}: UserProfileImageProps) => {
  return profileImageSrc ? (
    <Image
      src={profileImageSrc}
      alt={"user profile image"}
      width={100}
      height={100}
    />
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
