import { ReactNode } from "react";

type ChatWrapperProps = {
  children: ReactNode;
};

const ChatWrapper = ({ children }: ChatWrapperProps) => {
  return (
    <div
      className={"absolute flex h-full w-full flex-col items-center gap-4 pb-4"}
    >
      {children}
    </div>
  );
};

export default ChatWrapper;
