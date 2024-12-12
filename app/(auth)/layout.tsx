import { ReactNode } from "react";

type AuthLayout = {
  children: Readonly<ReactNode>;
};

const AuthLayout = ({ children }: AuthLayout) => {
  return (
    <div className={"flex h-screen w-full items-center justify-center p-4"}>
      {children}
    </div>
  );
};

export default AuthLayout;
