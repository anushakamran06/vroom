import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a helpful car loan advisor for a Singapore car configurator called VROOM.
Your job is to help customers understand their financing options for the car they have configured.

Rules:
- Always use Singapore dollars (S$) with comma formatting
- Be concise and friendly — avoid jargon
- When the user provides a deposit and tenure, always show:
    Principal: S$X
    Interest rate: X% p.a. flat
    Total interest: S$X
    Monthly instalment: S$X
    (Principal component: S$X/month · Interest component: S$X/month)
    Total paid over loan: S$X
- Warn clearly if the loan amount exceeds MAS 70% LTV for OMV > S$20k
- Explain what 2.78% p.a. flat rate means: it means the interest is calculated on the original principal every year, not the reducing balance — so it's equivalent to roughly 5–6% effective interest rate
- If asked about LTV: explain MAS rule simply
- Never make up car specs or prices — use only the context provided
- Keep responses under 200 words unless a detailed breakdown is requested`;

export async function POST(req: NextRequest) {
  let body: { messages: Array<{ role: string; content: string }>; carContext: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messages, carContext } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  // Validate message roles
  const anthropicMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  if (anthropicMessages.length === 0) {
    return NextResponse.json({ error: "No valid messages" }, { status: 400 });
  }

  const systemWithContext = `${SYSTEM_PROMPT}\n\n---\nCAR CONTEXT:\n${carContext}`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 512,
          system: systemWithContext,
          messages: anthropicMessages,
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ delta: { text: event.delta.text } });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
