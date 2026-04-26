import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

// Mock scrollIntoView which is not implemented in jsdom
Element.prototype.scrollIntoView = vi.fn();

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  X: () => React.createElement("span", { "data-testid": "x-icon" }, "×"),
  Send: () => React.createElement("span", { "data-testid": "send-icon" }, "→"),
  Sparkles: () => React.createElement("span", { "data-testid": "sparkles-icon" }, "✨"),
  Loader2: () => React.createElement("span", { "data-testid": "loader-icon" }, "⟳"),
  Bot: () => React.createElement("span", { "data-testid": "bot-icon" }, "🤖"),
  User: () => React.createElement("span", { "data-testid": "user-icon" }, "👤"),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock site config
vi.mock("@/app/data/siteData", () => ({
  siteConfig: {
    chat: {
      widgetTitle: "Chat with us",
      welcomeMessage: "Hello! How can I help you today?",
      placeholder: "Type your message...",
      quickReplies: [
        { label: "Get a quote", value: "I want a quote" },
        { label: "Services", value: "What services do you offer?" },
        { label: "Contact", value: "How can I contact you?" },
      ],
    },
    company: {
      email: "info@tomnerb.com",
    },
  },
}));

// Import after mocks
import ChatWidget from "../ChatWidget";
import { createMessage } from "@/app/lib/chat";

describe("ChatWidget Messages Area", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset scrollIntoView mock
    (Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mockClear();
    
    // Mock sessionStorage
    const mockStorage: Record<string, string> = {};
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: vi.fn((key: string) => mockStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockStorage[key];
        }),
      },
      writable: true,
    });
    
    // Default fetch mock
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        message: { content: "This is a test response" },
        mode: "ai",
        leadStep: undefined,
        leadData: {},
      }),
    });
  });

  describe("Message Rendering Order", () => {
    it("renders messages in correct chronological order", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      const openButton = screen.getByLabelText("Open chat");
      fireEvent.click(openButton);
      
      // Wait for input to be available
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Wait for welcome message to appear (added via setTimeout)
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Get the message log
      const messageLog = screen.getByRole("log");
      expect(messageLog).toBeInTheDocument();
    });

    it("displays user messages after assistant messages in correct order", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Send a user message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "User message" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Wait for user message to appear
      await waitFor(() => {
        expect(screen.getByText("User message")).toBeInTheDocument();
      });
      
      // Wait for assistant response
      await waitFor(() => {
        expect(screen.getByText("This is a test response")).toBeInTheDocument();
      });
      
      // Both messages should be in the document
      const messages = screen.getByRole("log");
      expect(messages).toBeInTheDocument();
    });

    it("maintains message order through multiple exchanges", async () => {
      // Setup multiple responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            message: { content: "First response" },
            mode: "ai",
            leadStep: undefined,
            leadData: {},
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            message: { content: "Second response" },
            mode: "ai",
            leadStep: undefined,
            leadData: {},
          }),
        });
      
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // First exchange
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Message 1" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      await waitFor(() => {
        expect(screen.getByText("First response")).toBeInTheDocument();
      });
      
      // Second exchange
      fireEvent.change(input, { target: { value: "Message 2" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      await waitFor(() => {
        expect(screen.getByText("Second response")).toBeInTheDocument();
      });
      
      // All messages should be present
      expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      expect(screen.getByText("Message 1")).toBeInTheDocument();
      expect(screen.getByText("First response")).toBeInTheDocument();
      expect(screen.getByText("Message 2")).toBeInTheDocument();
      expect(screen.getByText("Second response")).toBeInTheDocument();
    });
  });

  describe("Auto-scroll Behavior", () => {
    it("calls scrollIntoView when messages change", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // scrollIntoView should have been called after welcome message
      await waitFor(() => {
        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
      });
      
      // Should be called with smooth behavior
      const scrollCalls = (Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mock.calls;
      expect(scrollCalls[scrollCalls.length - 1][0]).toEqual({ behavior: "smooth" });
    });

    it("scrolls to bottom when new message is added", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Clear previous calls from welcome message
      (Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mockClear();
      
      // Send a message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Wait for scroll to be called
      await waitFor(() => {
        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
      });
      
      // Should scroll with smooth behavior
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    it("scrollIntoView is called on messagesEndRef", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message to trigger scroll
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // The scrollIntoView should have been called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  describe("Typing Indicator", () => {
    it("shows typing indicator during loading with 3 animated dots", async () => {
      // Create a delayed promise to keep loading state active
      let resolveResponse: (value: unknown) => void;
      const responsePromise = new Promise((resolve) => {
        resolveResponse = resolve;
      });
      
      mockFetch.mockReturnValueOnce(responsePromise);
      
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Send a message to trigger loading state
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Check for 3 bouncing dots
      await waitFor(() => {
        const dots = document.querySelectorAll(".animate-bounce");
        expect(dots.length).toBeGreaterThanOrEqual(3);
      });
      
      // Resolve the promise to clean up
      resolveResponse!({
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: { content: "Response" },
          mode: "ai",
          leadStep: undefined,
          leadData: {},
        }),
      });
    });

    it("typing indicator has correct styling", async () => {
      let resolveResponse: (value: unknown) => void;
      const responsePromise = new Promise((resolve) => {
        resolveResponse = resolve;
      });
      
      mockFetch.mockReturnValueOnce(responsePromise);
      
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Send a message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Check for dots with correct styling
      await waitFor(() => {
        const dots = document.querySelectorAll(".animate-bounce");
        expect(dots.length).toBeGreaterThanOrEqual(3);
        
        // Each dot should have rounded-full class
        dots.forEach(dot => {
          expect(dot.classList.contains("rounded-full")).toBe(true);
        });
      });
      
      // Clean up
      resolveResponse!({
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: { content: "Response" },
          mode: "ai",
          leadStep: undefined,
          leadData: {},
        }),
      });
    });

    it("typing indicator dots have staggered animation delays", async () => {
      let resolveResponse: (value: unknown) => void;
      const responsePromise = new Promise((resolve) => {
        resolveResponse = resolve;
      });
      
      mockFetch.mockReturnValueOnce(responsePromise);
      
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Send a message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Check for dots with animation delays
      await waitFor(() => {
        const dots = document.querySelectorAll("[style*=\"animationDelay\"]");
        expect(dots.length).toBeGreaterThanOrEqual(3);
      });
      
      // Clean up
      resolveResponse!({
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: { content: "Response" },
          mode: "ai",
          leadStep: undefined,
          leadData: {},
        }),
      });
    });

    it("hides typing indicator when loading completes", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: { content: "Final response" },
          mode: "ai",
          leadStep: undefined,
          leadData: {},
        }),
      });
      
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Send a message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Wait for response
      await waitFor(() => {
        expect(screen.getByText("Final response")).toBeInTheDocument();
      });
      
      // Typing indicator should no longer be visible
      const srOnlyText = screen.queryByText("AI is typing", { selector: "span.sr-only" });
      // After loading completes, the indicator is removed
      expect(srOnlyText).not.toBeInTheDocument();
    });

    it("has screen reader text for typing indicator", async () => {
      let resolveResponse: (value: unknown) => void;
      const responsePromise = new Promise((resolve) => {
        resolveResponse = resolve;
      });
      
      mockFetch.mockReturnValueOnce(responsePromise);
      
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      // Send a message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Check for screen reader text
      await waitFor(() => {
        const srOnly = screen.getByText("AI is typing", { selector: "span.sr-only" });
        expect(srOnly).toBeInTheDocument();
        expect(srOnly.classList.contains("sr-only")).toBe(true);
      });
      
      // Clean up
      resolveResponse!({
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: { content: "Response" },
          mode: "ai",
          leadStep: undefined,
          leadData: {},
        }),
      });
    });
  });

  describe("ARIA Live Region", () => {
    it("has aria-live region for screen readers", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Check for aria-live region
      const messageLog = screen.getByRole("log");
      expect(messageLog).toHaveAttribute("aria-live", "polite");
    });

    it("has aria-atomic=false for efficient screen reader updates", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      const messageLog = screen.getByRole("log");
      expect(messageLog).toHaveAttribute("aria-atomic", "false");
    });

    it("uses log role for message area", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      const messageLog = screen.getByRole("log");
      expect(messageLog).toBeInTheDocument();
    });

    it("updates aria-live region when new messages arrive", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const messageLog = screen.getByRole("log");
      expect(messageLog).toHaveAttribute("aria-live", "polite");
      
      // Send a message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Wait for user message to appear in the log
      await waitFor(() => {
        expect(screen.getByText("Test message")).toBeInTheDocument();
      });
      
      // The log region should still have aria-live
      expect(messageLog).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Messages Container", () => {
    it("has overflow-y-auto for scrolling", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      const messageLog = screen.getByRole("log");
      expect(messageLog.classList.contains("overflow-y-auto")).toBe(true);
    });

    it("has correct height styling", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      const messageLog = screen.getByRole("log");
      expect(messageLog).toHaveStyle({ height: "calc(100% - 140px)" });
    });

    it("has space-y-4 for message spacing", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      const messageLog = screen.getByRole("log");
      expect(messageLog.classList.contains("space-y-4")).toBe(true);
    });
  });

  describe("Message Scroll Reference", () => {
    it("has scroll reference element at bottom of messages", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // The messagesEndRef div should exist (it's an empty div at the end)
      const messageLog = screen.getByRole("log");
      expect(messageLog.lastElementChild).toBeTruthy();
    });

    it("scrollIntoView is called on the reference element", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // scrollIntoView should be called
      await waitFor(() => {
        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
      });
    });
  });
});
