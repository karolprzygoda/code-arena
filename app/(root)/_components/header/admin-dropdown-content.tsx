"use client";

import { SquarePen } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import DropdownLink from "@/app/(root)/_components/header/dropdown-link";
import useUserRole from "@/hooks/use-user-role";

const AdminDropDownContent = () => {
  const role = useUserRole();

  if (!role) {
    return null;
  }

  return (
    <>
      <DropdownLink
        href={"/create-challenge"}
        name={"Create Challenge"}
        Icon={SquarePen}
      />
      <DropdownMenuSeparator />
    </>
  );
};

export default AdminDropDownContent;
