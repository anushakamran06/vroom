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

const BANKS: { name: string; rate: number }[] = [
  { name: "DBS", rate: 2.48 },
  { name: "OCBC", rate: 2.5 },
  { name: "UOB", rate: 2.58 },
  { name: "Maybank", rate: 2.38 },
  { name: "StanChart", rate: 2.68 },
];

function fmt(n: number): string {
  return "S$" + Math.round(n).toLocaleString("en-SG");
}

function parseAmount(text: string): number | null {
  const cleaned = text.trim().replace(/[S$,\s]/g, "");
  if (/^\d+(\.\d+)?[kK]$/.test(cleaned))
    return parseFloat(cleaned) * 1_000;
  if (/^\d+(\.\d+)?[mM]$/.test(cleaned))
    return parseFloat(cleaned) * 1_000_000;
  const n = parseFloat(cleaned);
  return isNaN(n) || n < 0 ? null : n;
}

function formatForDisplay(text: string): string {
  const n = parseAmount(text);
  if (n !== null && /^\d+(\.\d+)?[kKmM]?$/.test(text.trim().replace(/[S$,\s]/g, ""))) {
    return fmt(n);
  }
  return text;
}

function buildSystemPrompt(car: Car, totalPrice: number, selectedRate: number | null): string {
  const rateNote = selectedRate
    ? `The user has selected a flat rate of ${selectedRate}% p.a. — use this for all instalment calculations.`
    : "Default to 2.78% p.a. flat if no rate is specified.";

  return `You are a Singapore car loan advisor. The customer is configuring a ${car.brand} ${car.model}. Total on-the-road price: ${fmt(totalPrice)} (this already includes COE, ARF, and registration fee).

Key Singapore loan rules you must apply:
- MAS tenure limits: max 7 years if OMV ≤ S$20,000; max 5 years if OMV > S$20,000. All cars on this platform are > S$20k OMV, so max tenure is 5 years.
- LTV limits: max 70% LTV if OMV ≤ S$20,000; max 60% LTV if OMV > S$20,000. For this car, max loan = 60% of OTR price = ${fmt(totalPrice * 0.6)}.
- COE is already included in the OTR price shown — never add it again.
- Flat rate vs effective rate: 2.5% flat ≈ 4.7% effective p.a. Always clarify this.
- Monthly instalment = (Principal + Total Interest) / (Tenure × 12), where Total Interest = Principal × flat rate × tenure years.
- Recommended deposit range: 30–40% of OTR price.

2025 SG bank flat rates for reference:
- DBS: 2.48% p.a. | OCBC: 2.50% p.a. | UOB: 2.58% p.a. | Maybank: 2.38% p.a. | Standard Chartered: 2.68% p.a.

${rateNote}

When showing a loan breakdown, always include:
• Deposit amount
• Loan amount (LTV %)
• Monthly instalment
• Total interest paid
• Flat rate used + reminder that effective rate is ~2× the flat rate

Be concise. Use Singapore dollar formatting (S$X,XXX). Never use marketing language. Answer any question about SG car loans, COE, ARF, or financing naturally.`;
}

export default function LoanChatbot({ car, totalPrice, isOpen, onClose }: LoanChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedRate, setSelectedRate] = useState<number | null>(null);
  const [showCustomRate, setShowCustomRate] = useState(false);
  const [customRateInput, setCustomRateInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !initialised) {
      setMessages([
        {
          role: "bot",
          text: `Your ${car.model} comes to ${fmt(totalPrice)} on the road.\n\nI can help you work out monthly instalments, check MAS loan limits, and compare bank rates. What would you like to know?`,
        },
      ]);
      setInitialised(true);
    }
  }, [isOpen, initialised, car.model, totalPrice]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addBot(text: string) {
    setMessages((prev) => [...prev, { role: "bot", text }]);
  }

  function selectBank(bankName: string, rate: number) {
    setSelectedBank(bankName);
    setSelectedRate(rate);
    setShowCustomRate(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `Use ${bankName} rate (${rate}% p.a. flat)` },
    ]);
    setTimeout(() => {
      addBot(
        `${bankName} rate locked in at ${rate}% p.a. flat (effective ~${(rate * 1.9).toFixed(1)}% p.a.).\n\nTell me your deposit amount and tenure and I'll calculate your monthly instalment.`
      );
    }, 100);
  }

  function applyCustomRate() {
    const r = parseFloat(customRateInput.replace(/[^0-9.]/g, ""));
    if (isNaN(r) || r <= 0 || r >= 30) {
      addBot("Please enter a valid rate between 0.1% and 30%.");
      return;
    }
    setSelectedBank("Custom");
    setSelectedRate(r);
    setShowCustomRate(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `Use custom rate: ${r}% p.a. flat` },
    ]);
    setTimeout(() => {
      addBot(`Custom rate ${r}% p.a. flat set (effective ~${(r * 1.9).toFixed(1)}% p.a.).`);
    }, 100);
  }

  async function callClaude(userText: string): Promise<string> {
    const systemPrompt = buildSystemPrompt(car, totalPrice, selectedRate);
    const apiMessages = messages
      .concat({ role: "user", text: userText })
      .map((m) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.text,
      }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, systemPrompt }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.text ?? "No response.";
  }

  async function handleSend() {
    const raw = input.trim();
    if (!raw || loading) return;

    const displayText = formatForDisplay(raw);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: displayText }]);
    setLoading(true);

    const textToSend = parseAmount(raw) !== null ? fmt(parseAmount(raw)!) : raw;

    try {
      const reply = await callClaude(textToSend);
      addBot(reply);
    } catch (err) {
      console.error("Chat error:", err);
      addBot("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const activeRateLabel = selectedBank
    ? `${selectedBank} ${selectedRate}% p.a.`
    : "No rate selected";

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
          padding: "16px 20px",
          borderBottom: "1px solid #2A2A2A",
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ color: "#C8A96E", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Loan Calculator
          </div>
          <div style={{ color: "#888", fontSize: "12px", marginTop: "2px" }}>
            {car.model} · {fmt(totalPrice)}
          </div>
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

      {/* Bank rate selector */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #1E1E1E",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Interest rate
          </span>
          <span
            title="Flat rate — effective rate is approx 2× the flat rate"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #444",
              color: "#666",
              fontSize: "9px",
              cursor: "help",
            }}
          >
            ?
          </span>
          {selectedBank && (
            <span style={{ marginLeft: "auto", fontSize: "11px", color: "#C8A96E" }}>
              {activeRateLabel}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {BANKS.map((b) => (
            <button
              key={b.name}
              onClick={() => selectBank(b.name, b.rate)}
              style={{
                padding: "4px 10px",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: selectedBank === b.name ? "#C8A96E" : "#2A2A2A",
                background: selectedBank === b.name ? "#1A1500" : "transparent",
                color: selectedBank === b.name ? "#C8A96E" : "#888",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {b.name} {b.rate}%
            </button>
          ))}
          <button
            onClick={() => { setShowCustomRate(!showCustomRate); setSelectedBank(null); setSelectedRate(null); }}
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              border: "1px solid #2A2A2A",
              background: "transparent",
              color: "#666",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Enter manually
          </button>
        </div>
        {showCustomRate && (
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <input
              type="text"
              value={customRateInput}
              onChange={(e) => setCustomRateInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCustomRate()}
              placeholder="e.g. 2.5"
              style={{
                flex: 1,
                background: "#1A1A1A",
                border: "1px solid #3A3A3A",
                borderRadius: "6px",
                color: "#E0E0E0",
                padding: "6px 10px",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <span style={{ color: "#666", fontSize: "12px", alignSelf: "center" }}>% p.a.</span>
            <button
              onClick={applyCustomRate}
              style={{
                padding: "6px 12px",
                background: "#C8A96E",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
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
                color: "#555",
                fontSize: "13px",
              }}
            >
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid #2A2A2A",
          display: "flex",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="e.g. 300k deposit, 5 years — or ask anything"
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
            padding: "10px 16px",
            background: "#C8A96E",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.4 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
