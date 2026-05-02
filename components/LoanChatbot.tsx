"use client";

import { useEffect, useRef, useState } from "react";
import { formatSGD } from "@/lib/utils";
import type { Car } from "@/data/cars";
import type { PriceBreakdownResult } from "@/lib/pricing";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LoanChatbotProps {
  car: Car;
  priceBreakdown: PriceBreakdownResult;
  onClose: () => void;
}

export function LoanChatbot({ car, priceBreakdown, onClose }: LoanChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const totalPrice = priceBreakdown.total;

  // Opening message from bot
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi! The total on-the-road price for the ${car.brand} ${car.name} as configured is **${formatSGD(totalPrice)}**.\n\nHow much would you like to put down as a deposit?`,
      },
    ]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [car.brand, car.name, totalPrice]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          carContext: buildCarContext(car, priceBreakdown),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const text = parsed.delta?.text ?? parsed.text ?? "";
                if (text) {
                  assistantContent += text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: assistantContent,
                    };
                    return updated;
                  });
                }
              } catch {
                // skip malformed chunk
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I ran into a problem. Please try again or check that ANTHROPIC_API_KEY is set.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col z-50 border-l border-gray-200 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="font-semibold text-gray-900">Loan Calculator</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {car.brand} {car.name} · {formatSGD(totalPrice)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
          aria-label="Close loan calculator"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Quick-reference card */}
      <div className="mx-4 mt-3 mb-1 bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1 border border-gray-100">
        <div className="flex justify-between">
          <span>Purchase price</span>
          <span className="font-medium text-gray-900">{formatSGD(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>MAS max loan (70% of price)</span>
          <span className="font-medium">{formatSGD(totalPrice * 0.7)}</span>
        </div>
        <div className="flex justify-between">
          <span>Min down payment (30%)</span>
          <span className="font-medium">{formatSGD(totalPrice * 0.3)}</span>
        </div>
        <div className="flex justify-between">
          <span>Default interest rate</span>
          <span className="font-medium">2.78% p.a. flat</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-gray-900 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {renderMessageContent(msg.content)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {[
            `Deposit ${formatSGD(Math.round(totalPrice * 0.3))}`,
            "5-year loan",
            "What's the LTV limit?",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-1.5 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. S$60,000 deposit, 5 years"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function buildCarContext(car: Car, breakdown: PriceBreakdownResult): string {
  const linesSummary = breakdown.lines
    .map((l) => `  ${l.label}: ${l.amount < 0 ? "-" : ""}S$${Math.abs(l.amount).toLocaleString("en-SG")}`)
    .join("\n");

  return `
Car: ${car.brand} ${car.name}
Engine: ${car.specs.engine}
0–100 km/h: ${car.specs.zeroToHundred}
OMV: S$${car.sgFees.omv.toLocaleString("en-SG")} (used for MAS LTV rule)
Total on-the-road price: S$${breakdown.total.toLocaleString("en-SG")}

Price breakdown:
${linesSummary}

Singapore MAS loan rules:
- OMV > S$20,000 → max loan = 70% of purchase price, max 7 years
- OMV ≤ S$20,000 → max loan = 90% of purchase price, max 7 years
- Default interest rate used in Singapore: 2.78% p.a. flat rate

Flat-rate loan formula (standard SG car loans):
  Monthly instalment = (Principal + Total Interest) / (Tenure in months)
  Total Interest = Principal × Annual Rate × Tenure in years
  Monthly principal = Principal / (Tenure in months)
  Monthly interest = Total Interest / (Tenure in months)
`.trim();
}

// Minimal markdown bold rendering
function renderMessageContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
