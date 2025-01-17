import { Sparkles } from "lucide-react";
import { MemoizedMarkdown } from "@/app/(root)/(challenge)/_components/memoized-markdown";
import { Message as MessageT } from "ai";
import { AnimatePresence, motion } from "motion/react";

type MessagesProps = {
  messages: MessageT[];
};

const Messages = ({ messages }: MessagesProps) => {
  return messages.map((message) => (
    <Message key={message.id} message={message} />
  ));
};

type MessageProps = {
  message: MessageT;
};

const Message = ({ message }: MessageProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className={"flex w-full flex-col"}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        {message.role === "user" ? (
          <div
            className={
              "self-end rounded-xl bg-zinc-200 px-3 py-2 dark:bg-[#1e1e1e]"
            }
          >
            {message.content}
          </div>
        ) : (
          <div className={"flex gap-4"}>
            <div
              className={
                "flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-zinc-700 dark:bg-[#1e1e1e]"
              }
            >
              <Sparkles className={"h-4 w-4"} />
            </div>
            <div>
              <MemoizedMarkdown id={message.id} content={message.content} />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Messages;
