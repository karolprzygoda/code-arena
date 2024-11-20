import Link from "next/link";
import { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

const HeaderLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link
      className={"text-foreground/80 transition-colors hover:text-foreground"}
      href={href}
    >
      {children}
    </Link>
  );
};

export default HeaderLink;
