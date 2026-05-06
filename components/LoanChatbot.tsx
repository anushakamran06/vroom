"use client";

import { useState, useRef, useEffect } from "react";
import type { Car } from "@/types/car";

interface LoanChatbotProps {
  car: Car;
  totalPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "bot" | "user";
  text: string;
}

type ConversationStage = "deposit" | "tenure" | "rate_confirm" | "done";

function fmt(n: number): string {
  return "S$" + Math.round(n).toLocaleString("en-SG");
}

function calcMonthlyInstalment(
  principal: number,
  ratePA: number,
  tenureYears: number
): { monthly: number; totalInterest: number; principalPart: number; interestPart: number } {
  const totalInterest = principal * (ratePA / 100) * tenureYears;
  const months = tenureYears * 12;
  const monthly = (principal + totalInterest) / months;
  return {
    monthly,
    totalInterest,
    principalPart: principal / months,
    interestPart: totalInterest / months,
  };
}

export default function LoanChatbot({ car, totalPrice, isOpen, onClose }: LoanChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<ConversationStage>("deposit");
  const [deposit, setDeposit] = useState(0);
  const [tenure, setTenure] = useState(0);
  const [rate] = useState(2.78);
  const [loading, setLoading] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !initialised) {
      setMessages([
        {
          role: "bot",
          text: `Your ${car.model} comes to ${fmt(totalPrice)} on the road. How much would you like to put down as a deposit?`,
        },
      ]);
      setInitialised(true);
      setStage("deposit");
    }
  }, [isOpen, initialised, car.model, totalPrice]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addBot(text: string) {
    setMessages((prev) => [...prev, { role: "bot", text }]);
  }

  async function callClaude(userText: string, contextMessages: Message[]): Promise<string> {
    const systemPrompt = `You are a car loan advisor for Singapore. The customer is configuring a ${car.model}. Total on-the-road price: ${fmt(totalPrice)}. Always use Singapore dollar formatting (S$X,XXX). Explain financial terms in plain English. Be concise. Never use marketing language.`;

    const apiMessages = contextMessages.map((m) => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));
    apiMessages.push({ role: "user", content: userText });

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, systemPrompt }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Chat API error:", err);
      return "Sorry, I couldn't reach the AI advisor right now.";
    }

    const data = await res.json();
    return data.text ?? "No response.";
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      if (stage === "deposit") {
        const parsed = parseAmount(text);
        if (parsed == null) {
          addBot("Please enter a valid deposit amount (e.g. 50000 or S$50,000).");
          setLoading(false);
          return;
        }

        const loanAmount = totalPrice - parsed;
        const ltvRatio = loanAmount / totalPrice;
        setDeposit(parsed);

        let response = `Got it — deposit of ${fmt(parsed)}, leaving a loan of ${fmt(loanAmount)}.`;

        if (ltvRatio > 0.7 && totalPrice > 20000) {
          response += ` Note: MAS rules cap car loans at 70% of the purchase price for cars above S$20,000 OMV. Your loan-to-value would be ${Math.round(ltvRatio * 100)}%, which exceeds this limit. You would need to increase your deposit to at least ${fmt(totalPrice * 0.3)}.`;
        }

        response += " How many years would you like to spread the loan over? (1–7 years)";
        addBot(response);
        setStage("tenure");
      } else if (stage === "tenure") {
        const years = parseInt(text.replace(/[^0-9]/g, ""), 10);
        if (!years || years < 1 || years > 7) {
          addBot("Please enter a loan tenure between 1 and 7 years.");
          setLoading(false);
          return;
        }
        setTenure(years);
        addBot(
          `${years}-year tenure noted. I'll use the standard flat rate of 2.78% p.a. — shall I proceed with that, or do you have a rate from your bank? (Reply "yes" to use 2.78%, or enter a rate like "2.5%")`
        );
        setStage("rate_confirm");
      } else if (stage === "rate_confirm") {
        const lowerText = text.toLowerCase();
        let finalRate = rate;
        if (lowerText !== "yes" && lowerText !== "y") {
          const parsed = parseFloat(text.replace(/[^0-9.]/g, ""));
          if (!isNaN(parsed) && parsed > 0 && parsed < 30) {
            finalRate = parsed;
          }
        }

        const loanAmount = totalPrice - deposit;
        const { monthly, totalInterest, principalPart, interestPart } =
          calcMonthlyInstalment(loanAmount, finalRate, tenure);

        const breakdown =
          `Here's your loan breakdown at ${finalRate}% p.a. flat rate:\n\n` +
          `• Principal repayment: ${fmt(principalPart)}/month\n` +
          `• Interest: ${fmt(interestPart)}/month\n` +
          `• Total monthly instalment: ${fmt(monthly)}/month\n` +
          `• Total interest over ${tenure} years: ${fmt(totalInterest)}\n\n` +
          `A flat rate of ${finalRate}% p.a. means interest is calculated on the original loan amount for every year, not on the reducing balance. So you pay the same interest each month regardless of how much you've paid off — which makes the effective interest rate (EIR) higher than the advertised flat rate.`;

        addBot(breakdown);
        setStage("done");
      } else {
        const reply = await callClaude(text, messages);
        addBot(reply);
      }
    } finally {
      setLoading(false);
    }
  }

  function parseAmount(text: string): number | null {
    const cleaned = text.replace(/[S$,\s]/g, "");
    const n = parseFloat(cleaned);
    if (isNaN(n) || n < 0) return null;
    return n;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "420px",
        maxWidth: "100vw",
        height: "100vh",
        background: "#0D0D0D",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        borderLeft: "1px solid #2A2A2A",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 20px 16px",
          borderBottom: "1px solid #2A2A2A",
        }}
      >
        <div>
          <div style={{ color: "#C8A96E", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Loan Calculator
          </div>
          <div style={{ color: "#888", fontSize: "12px", marginTop: "2px" }}>{car.model} · {fmt(totalPrice)}</div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid #3A3A3A",
            color: "#888",
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "#C8A96E" : "#1E1E1E",
                color: msg.role === "user" ? "#fff" : "#D0D0D0",
                fontSize: "13px",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                border: msg.role === "bot" ? "1px solid #2A2A2A" : "none",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "16px 16px 16px 4px",
                background: "#1E1E1E",
                border: "1px solid #2A2A2A",
                color: "#888",
                fontSize: "13px",
              }}
            >
              ...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #2A2A2A",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your answer..."
          style={{
            flex: 1,
            background: "#1A1A1A",
            border: "1px solid #3A3A3A",
            borderRadius: "8px",
            color: "#E0E0E0",
            padding: "10px 14px",
            fontSize: "13px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 18px",
            background: "#C8A96E",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
