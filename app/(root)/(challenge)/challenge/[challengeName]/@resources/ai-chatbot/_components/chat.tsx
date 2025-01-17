"use client";

import { useChat } from "@ai-sdk/react";
import AskAiForm from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/ai-chatbot/_components/ask-ai-form";
import ChatPreview from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/ai-chatbot/_components/chat-preview";
import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const initialMessage = "Hello how can i assist you today?";
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: "chat",
    experimental_throttle: 50,
    initialMessages: [
      {
        id: "initial message",
        role: "assistant",
        content: streamedText,
      },
    ],
  });

  useEffect(() => {
    let currentIndex = 0;
    if (isStreaming) {
      const interval = setInterval(() => {
        if (currentIndex <= initialMessage.length) {
          setStreamedText(initialMessage.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsStreaming(false);
          clearInterval(interval);
        }
      }, 25);

      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const chatPreviewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatPreviewRef.current) {
      chatPreviewRef.current.scrollTop = chatPreviewRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={"absolute flex h-full w-full flex-col items-center gap-4 pb-4"}
    >
      <ChatPreview ref={chatPreviewRef} messages={messages} />
      <AskAiForm
        onSubmit={handleSubmit}
        value={input}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Chat;
