"use client";

import { createContext, ReactNode, useContext } from "react";
import { User } from "@supabase/supabase-js";
import useUser from "@/hooks/use-user";
import useUserRole from "@/hooks/use-user-role";

type UserContextProps = {
  children: ReactNode;
};

export const UserContext = createContext<{
  user: User | null;
  userRole: string | null;
}>({ user: null, userRole: null });

const UserContextProvider = ({ children }: UserContextProps) => {
  const user = useUser();
  const userRole = useUserRole();

  return (
    <UserContext.Provider value={{ user, userRole }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
export const useUserContext = () => useContext(UserContext);
