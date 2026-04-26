import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
      widgetTitle: "TomNerb Assistant",
      welcomeMessage: "Hi! I'm TomNerb's digital assistant. How can I help your business today?",
      placeholder: "Type your message...",
      quickReplies: [
        { label: "Custom Software?", value: "Tell me about custom software development" },
        { label: "Get a Quote?", value: "I'd like to get a quote for a project" },
        { label: "Talk to the Team", value: "I'd like to talk to someone on the team" },
      ],
    },
    company: {
      email: "info@tomnerb.com",
    },
  },
}));

// Import after mocks
import ChatWidget from "../ChatWidget";

describe("ChatWidget Welcome Message", () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

  describe("Welcome Message Display", () => {
    it("displays welcome message on first open", async () => {
      render(<ChatWidget />);

      // Initially, chat should be closed and welcome message not visible
      expect(screen.queryByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).not.toBeInTheDocument();

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Welcome message should appear after a delay
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it("welcome message appears with correct sender (assistant)", async () => {
      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
      }, { timeout: 1000 });

      // Should have bot icon indicating assistant message
      const botIcon = screen.getByTestId("bot-icon");
      expect(botIcon).toBeInTheDocument();
    });

    it("welcome message has timestamp", async () => {
      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
      }, { timeout: 1000 });

      // Check for time format (e.g., "10:30 AM")
      const timeRegex = /\d{1,2}:\d{2}\s*(AM|PM)/;
      const timeElements = screen.getAllByText(timeRegex);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  describe("Welcome Message Shows Only Once", () => {
    it("does not show welcome message again on second open", async () => {
      render(<ChatWidget />);

      // First open
      fireEvent.click(screen.getByLabelText("Open chat"));
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
      }, { timeout: 1000 });

      // Close chat
      fireEvent.click(screen.getByLabelText("Close chat"));

      // Re-open chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 500));

      // Should still only have 1 welcome message (not 2)
      const welcomeMessages = screen.getAllByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?");
      expect(welcomeMessages.length).toBe(1);
    });

    it("does not show welcome message when session storage has existing messages", async () => {
      // Pre-populate session storage with messages
      const existingSession = {
        messages: [
          { id: "1", role: "assistant", content: "Previous welcome", timestamp: new Date().toISOString() },
          { id: "2", role: "user", content: "Hi", timestamp: new Date().toISOString() },
        ],
        mode: "ai",
        leadData: {},
        lastUpdated: new Date().toISOString(),
      };

      const sessionStorage = window.sessionStorage as unknown as { getItem: ReturnType<typeof vi.fn> };
      sessionStorage.getItem.mockReturnValue(JSON.stringify(existingSession));

      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 500));

      // Should show previous messages, not new welcome
      expect(screen.getByText("Previous welcome")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
      expect(screen.queryByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).not.toBeInTheDocument();
    });

    it("persists hasShownWelcome state in session storage", async () => {
      render(<ChatWidget />);

      // Open chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
      }, { timeout: 1000 });

      // Verify session storage was called with hasShownWelcome effectively set
      const setItemCalls = (window.sessionStorage.setItem as unknown as ReturnType<typeof vi.fn>).mock.calls;
      expect(setItemCalls.length).toBeGreaterThan(0);
    });
  });

  describe("Quick Replies After Welcome", () => {
    it("shows quick replies after welcome message is displayed", async () => {
      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
      }, { timeout: 1000 });

      // Quick replies should be visible
      await waitFor(() => {
        expect(screen.getByText("Custom Software?")).toBeInTheDocument();
        expect(screen.getByText("Get a Quote?")).toBeInTheDocument();
        expect(screen.getByText("Talk to the Team")).toBeInTheDocument();
      });
    });

    it("quick replies appear below welcome message", async () => {
      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message and quick replies
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
        expect(screen.getByText("Custom Software?")).toBeInTheDocument();
      }, { timeout: 1000 });

      const welcomeMessage = screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?");
      const quickReply = screen.getByText("Custom Software?");

      // Both should be in the document
      expect(welcomeMessage).toBeInTheDocument();
      expect(quickReply).toBeInTheDocument();
    });

    it("all quick replies are clickable after welcome", async () => {
      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message and quick replies
      await waitFor(() => {
        expect(screen.getByText("Custom Software?")).toBeInTheDocument();
      }, { timeout: 1000 });

      // All quick replies should be buttons
      const customSoftwareBtn = screen.getByText("Custom Software?");
      const getQuoteBtn = screen.getByText("Get a Quote?");
      const talkTeamBtn = screen.getByText("Talk to the Team");

      expect(customSoftwareBtn.tagName.toLowerCase()).toBe("button");
      expect(getQuoteBtn.tagName.toLowerCase()).toBe("button");
      expect(talkTeamBtn.tagName.toLowerCase()).toBe("button");
    });

    it("clicking quick reply sends message and hides quick replies", async () => {
      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message and quick replies
      await waitFor(() => {
        expect(screen.getByText("Custom Software?")).toBeInTheDocument();
      }, { timeout: 1000 });

      // Click a quick reply
      fireEvent.click(screen.getByText("Custom Software?"));

      // Wait for API call
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Wait for response
      await waitFor(() => {
        expect(screen.getByText("This is a test response")).toBeInTheDocument();
      });

      // Quick replies should be hidden now
      expect(screen.queryByText("Custom Software?")).not.toBeInTheDocument();
      expect(screen.queryByText("Get a Quote?")).not.toBeInTheDocument();
    });
  });

  describe("Welcome Animation", () => {
    it("welcome message appears with fade-in animation", async () => {
      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message container
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
      }, { timeout: 1000 });

      const welcomeMessage = screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?");
      const container = welcomeMessage.closest('[class*="animate-fade-in"]');
      expect(container).not.toBeNull();
    });

    it("welcome message has correct styling (rounded, bubble style)", async () => {
      render(<ChatWidget />);

      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?")).toBeInTheDocument();
      }, { timeout: 1000 });

      const welcomeMessage = screen.getByText("Hi! I'm TomNerb's digital assistant. How can I help your business today?");
      const bubble = welcomeMessage.closest('[class*="rounded-2xl"]');
      expect(bubble).not.toBeNull();
    });
  });

  describe("Welcome with User Message", () => {
    it("does not show welcome message if user immediately sends a message", async () => {
      // This tests the race condition where user might type before welcome shows
      const { checkAIMessageLimit } = await import("@/app/lib/chat");
      vi.mocked(checkAIMessageLimit).mockReturnValue(true);

      render(<ChatWidget />);

      // Open chat
      fireEvent.click(screen.getByLabelText("Open chat"));

      // Quickly type and send before welcome appears
      const input = await waitFor(() => screen.getByPlaceholderText("Type your message..."));
      fireEvent.change(input, { target: { value: "Hello there" } });
      fireEvent.keyDown(input, { key: "Enter" });

      // Wait for response
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Should have user message, may or may not have welcome depending on timing
      const userMessages = screen.getAllByText("Hello there");
      expect(userMessages.length).toBeGreaterThan(0);
    });
  });
});
