import Messages from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/ai-chatbot/_components/messages";
import { Message } from "ai";
import { ForwardedRef } from "react";

type ChatPreviewProps = {
  messages: Message[];
  ref: ForwardedRef<HTMLDivElement>;
};

const ChatPreview = ({ messages, ref }: ChatPreviewProps) => {
  return (
    <div
      ref={ref}
      className={"flex w-full flex-1 justify-center overflow-auto"}
    >
      <div
        className={
          "flex h-full w-full max-w-[800px] flex-col items-center gap-4 px-4 pt-4"
        }
      >
        <Messages messages={messages} />
      </div>
    </div>
  );
};

export default ChatPreview;
