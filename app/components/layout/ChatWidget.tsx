"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Sparkles,
  Loader2,
  Bot,
  User,
} from "lucide-react";
import {
  Message,
  createMessage,
  saveSessionToStorage,
  loadSessionFromStorage,
} from "@/app/lib/chat";
import { siteConfig } from "@/app/data/siteData";

const { chat, company } = siteConfig;

// URL regex pattern
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function parseMessageContent(content: string): React.ReactNode {
  if (!URL_REGEX.test(content)) {
    return content;
  }
  const parts = content.split(URL_REGEX);
  const matches = content.match(URL_REGEX) || [];
  return parts.reduce((acc: React.ReactNode[], part, i) => {
    acc.push(part);
    if (matches[i]) {
      acc.push(
        <a
          key={i}
          href={matches[i]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
          onClick={(e) => e.stopPropagation()}
        >
          {matches[i]}
        </a>
      );
    }
    return acc;
  }, []);
}

export default function ChatWidget() {
  const initialSession = typeof window !== "undefined" ? loadSessionFromStorage() : null;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialSession?.messages ?? []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"ai" | "lead">(initialSession?.mode ?? "ai");
  const [leadStep, setLeadStep] = useState<"name" | "email" | "message" | "complete">();
  const [leadData, setLeadData] = useState<{ name?: string; email?: string }>(initialSession?.leadData ?? {});
  const [hasShownWelcome, setHasShownWelcome] = useState(!!initialSession);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(false);

  // Save session to storage when messages/mode/leadData change
  useEffect(() => {
    saveSessionToStorage(messages, mode, leadData);
  }, [messages, mode, leadData]);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen) {
      justOpenedRef.current = true;
    }
  }, [isOpen]);

  useEffect(() => {
    if (justOpenedRef.current && messages.length === 0 && !hasShownWelcome) {
      justOpenedRef.current = false;
      setHasShownWelcome(true);
      const timer = setTimeout(() => {
        setMessages([createMessage("assistant", chat.welcomeMessage)]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, hasShownWelcome]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSend = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = createMessage("user", trimmedInput);
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          mode,
          leadStep,
          leadData,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      
      const assistantMessage = createMessage("assistant", data.message.content);
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.mode) setMode(data.mode);
      if (data.leadStep !== undefined) setLeadStep(data.leadStep);
      if (data.leadData) setLeadData(data.leadData);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = createMessage(
        "assistant",
        `Sorry, I'm having trouble connecting right now. Please try again or email us directly at ${company.email}`
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, messages, mode, leadStep, leadData, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (value: string) => {
    setInputValue(value);
    setTimeout(() => handleSend(), 100);
  };

  const handleCollapsedButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Collapsed State - Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        onKeyDown={handleCollapsedButtonKeyDown}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open chat"
        tabIndex={0}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-accent opacity-30 animate-ping" />
        <span className="absolute inset-0 rounded-full border-2 border-accent/50" />
        
        <Sparkles className="w-6 h-6 relative z-10 transition-transform group-hover:rotate-12" />
      </button>

      {/* Expanded State - Chat Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-widget-title"
        className={`fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-48px)] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
        style={{ height: "500px", maxHeight: "calc(100vh - 48px)" }}
      >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span id="chat-widget-title" className="font-medium text-text-primary">{chat.widgetTitle}</span>
            </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors text-text-muted hover:text-text-primary"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

{/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ height: "calc(100% - 140px)" }}
        aria-live="polite"
        aria-atomic="false"
        role="log"
      >
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-accent text-white"
                    : "bg-border text-text-muted"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-border/50 text-text-primary rounded-bl-md"
                }`}
              >
                {parseMessageContent(message.content)}
                <div
                  className={`text-[10px] mt-1 opacity-50 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-border text-text-muted flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="sr-only">AI is typing</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

          {/* Quick Replies - only show after welcome message and no user messages yet */}
          {messages.length === 1 && messages[0].role === "assistant" && !isLoading && (
            <div className="px-4 py-2 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {chat.quickReplies.map((reply) => (
                  <button
                    key={reply.label}
                    onClick={() => handleQuickReply(reply.value)}
                    className="px-3 py-1.5 text-xs rounded-full border border-neon/30 text-neon hover:bg-neon/10 hover:border-neon/60 transition-all duration-200 whitespace-nowrap"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={chat.placeholder}
              className="flex-1 bg-border/50 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full Screen Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
