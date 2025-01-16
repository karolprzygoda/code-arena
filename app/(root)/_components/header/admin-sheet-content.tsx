"use client";

import HeaderLink from "@/app/(root)/_components/header/header-link";
import useUserRole from "@/hooks/use-user-role";

const AdminSheetContent = () => {
  const userRole = useUserRole();

  if (!userRole) return null;

  return <HeaderLink href={"/create-challenge"}>Create Challenge</HeaderLink>;
};

export default AdminSheetContent;
