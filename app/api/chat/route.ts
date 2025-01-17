import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `
    You are a coding assistant. Help users understand concepts and debug issues without providing direct solutions to problems. 
    Focus on guiding users toward solving the problems themselves.
  `,
    messages,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
