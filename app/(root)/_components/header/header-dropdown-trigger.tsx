"use client";

import UserProfileImage from "@/components/user-profile-image";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useUser from "@/hooks/use-user";
import { getUserProfilePicture } from "@/lib/utils";

const HeaderDropdownTrigger = () => {
  const user = useUser();

  const profileImageSrc = getUserProfilePicture(user);

  return (
    <DropdownMenuTrigger
      className={
        "relative m-2 hidden h-7 w-7 items-center justify-center overflow-hidden rounded-full duration-300 focus:outline-none focus-visible:ring-2 md:flex"
      }
    >
      {user && <UserProfileImage profileImageSrc={profileImageSrc} />}
    </DropdownMenuTrigger>
  );
};

export default HeaderDropdownTrigger;
