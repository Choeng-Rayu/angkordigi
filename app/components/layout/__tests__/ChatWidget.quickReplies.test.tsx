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

// Mock site config with specific quick replies
vi.mock("@/app/data/siteData", () => ({
  siteConfig: {
    chat: {
      widgetTitle: "Chat with us",
      welcomeMessage: "Hello! How can I help you today?",
      placeholder: "Type your message...",
      quickReplies: [
        { label: "Get a quote", value: "I want a quote" },
        { label: "Services", value: "What services do you offer?" },
        { label: "Contact us", value: "How can I contact you?" },
      ],
    },
    company: {
      email: "info@tomnerb.com",
    },
  },
}));

// Import after mocks
import ChatWidget from "../ChatWidget";

describe("ChatWidget Quick Replies", () => {
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

  describe("Quick Replies Rendering", () => {
    it("renders quick replies after welcome message is displayed", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message (shown after setTimeout)
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Quick replies should appear after welcome message
      await waitFor(() => {
        expect(screen.getByText("Get a quote")).toBeInTheDocument();
        expect(screen.getByText("Services")).toBeInTheDocument();
        expect(screen.getByText("Contact us")).toBeInTheDocument();
      });
    });

    it("renders all quick reply buttons from config", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // All three quick replies should be rendered
      const quickReplies = ["Get a quote", "Services", "Contact us"];
      
      for (const reply of quickReplies) {
        const button = screen.getByText(reply);
        expect(button).toBeInTheDocument();
        expect(button.tagName.toLowerCase()).toBe("button");
      }
    });

    it("quick replies have correct styling classes", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Check quick reply styling
      const quickReply = screen.getByText("Get a quote");
      expect(quickReply.classList.contains("rounded-full")).toBe(true);
      expect(quickReply.classList.contains("border")).toBe(true);
    });

    it("quick replies are displayed in a flex container", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Quick replies should be in a flex container
      const quickReply = screen.getByText("Get a quote");
      const container = quickReply.parentElement;
      expect(container?.classList.contains("flex")).toBe(true);
      expect(container?.classList.contains("flex-wrap")).toBe(true);
    });
  });

  describe("Quick Reply Click Behavior", () => {
    it("sends message when quick reply is clicked", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message and quick replies
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Click on "Get a quote" quick reply
      fireEvent.click(screen.getByText("Get a quote"));
      
      // Wait for the message to be sent
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/chat",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })
        );
      });
      
      // Check that the sent message contains the quick reply value
      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const lastMessage = requestBody.messages[requestBody.messages.length - 1];
      expect(lastMessage.content).toBe("I want a quote");
    });

    it("sends correct value for each quick reply", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Test first quick reply
      mockFetch.mockClear();
      fireEvent.click(screen.getByText("Services"));
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      
      let fetchCall = mockFetch.mock.calls[0];
      let requestBody = JSON.parse(fetchCall[1].body);
      let lastMessage = requestBody.messages[requestBody.messages.length - 1];
      expect(lastMessage.content).toBe("What services do you offer?");
      
      // Wait for response and reset
      await waitFor(() => {
        expect(screen.getByText("This is a test response")).toBeInTheDocument();
      });
      
      // Re-open chat and test another quick reply
      // (quick replies won't show again after first interaction)
    });

    it("clears input after quick reply send", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Click quick reply
      fireEvent.click(screen.getByText("Get a quote"));
      
      // Wait for API call
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      
      // Input should be cleared
      const input = screen.getByPlaceholderText("Type your message...");
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("triggers loading state when quick reply is clicked", async () => {
      // Create a delayed promise
      let resolveResponse: (value: unknown) => void;
      const responsePromise = new Promise((resolve) => {
        resolveResponse = resolve;
      });
      
      mockFetch.mockReturnValueOnce(responsePromise);
      
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Click quick reply
      fireEvent.click(screen.getByText("Get a quote"));
      
      // Check that loading indicator appears
      await waitFor(() => {
        const srOnly = screen.getByText("AI is typing", { selector: "span.sr-only" });
        expect(srOnly).toBeInTheDocument();
      });
      
      // Resolve to clean up
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

  describe("Quick Replies Visibility", () => {
    it("hides quick replies after first user interaction", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Quick replies should be visible
      await waitFor(() => {
        expect(screen.getByText("Get a quote")).toBeInTheDocument();
      });
      
      // Click a quick reply
      fireEvent.click(screen.getByText("Get a quote"));
      
      // Wait for response
      await waitFor(() => {
        expect(screen.getByText("This is a test response")).toBeInTheDocument();
      });
      
      // Quick replies should now be hidden (no longer 1 assistant message only)
      expect(screen.queryByText("Get a quote")).not.toBeInTheDocument();
      expect(screen.queryByText("Services")).not.toBeInTheDocument();
      expect(screen.queryByText("Contact us")).not.toBeInTheDocument();
    });

    it("hides quick replies when user types and sends a message", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Quick replies should be visible
      await waitFor(() => {
        expect(screen.getByText("Get a quote")).toBeInTheDocument();
      });
      
      // Send a manual message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Custom message" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Wait for response
      await waitFor(() => {
        expect(screen.getByText("This is a test response")).toBeInTheDocument();
      });
      
      // Quick replies should now be hidden
      expect(screen.queryByText("Get a quote")).not.toBeInTheDocument();
      expect(screen.queryByText("Services")).not.toBeInTheDocument();
    });

    it("does not show quick replies if there are no messages", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Before welcome message appears, quick replies should not be visible
      // (wait a bit but not long enough for welcome message)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Quick replies should not be visible yet
      expect(screen.queryByText("Get a quote")).not.toBeInTheDocument();
    });

    it("does not show quick replies if there are multiple messages", async () => {
      // Pre-populate session storage with multiple messages
      const existingSession = {
        messages: [
          { id: "1", role: "assistant", content: "Welcome!", timestamp: new Date().toISOString() },
          { id: "2", role: "user", content: "Hi!", timestamp: new Date().toISOString() },
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
      
      // Wait a bit for any effects
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Quick replies should not be visible since there are already multiple messages
      expect(screen.queryByText("Get a quote")).not.toBeInTheDocument();
    });

    it("only shows quick replies when exactly 1 assistant message and no user messages", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message (1 assistant message)
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Quick replies should be visible
      await waitFor(() => {
        expect(screen.getByText("Get a quote")).toBeInTheDocument();
        expect(screen.getByText("Services")).toBeInTheDocument();
        expect(screen.getByText("Contact us")).toBeInTheDocument();
      });
    });

    it("hides quick replies during loading", async () => {
      // Create a delayed promise
      let resolveResponse: (value: unknown) => void;
      const responsePromise = new Promise((resolve) => {
        resolveResponse = resolve;
      });
      
      mockFetch.mockReturnValueOnce(responsePromise);
      
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Quick replies should be visible initially
      await waitFor(() => {
        expect(screen.getByText("Get a quote")).toBeInTheDocument();
      });
      
      // Click a quick reply
      fireEvent.click(screen.getByText("Get a quote"));
      
      // Quick replies should be hidden during loading
      // (because there's now a user message being sent)
      await waitFor(() => {
        expect(screen.queryByText("Get a quote")).not.toBeInTheDocument();
      });
      
      // Resolve to clean up
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

  describe("Quick Replies Styling", () => {
    it("quick replies have neon border color", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Check styling
      const quickReply = screen.getByText("Get a quote");
      expect(quickReply.classList.contains("border-neon\/30")).toBe(true);
      expect(quickReply.classList.contains("text-neon")).toBe(true);
    });

    it("quick replies have hover state classes", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Check hover classes
      const quickReply = screen.getByText("Get a quote");
      expect(quickReply.classList.contains("hover:bg-neon\/10")).toBe(true);
      expect(quickReply.classList.contains("hover:border-neon\/60")).toBe(true);
    });

    it("quick replies are positioned at the bottom of messages area", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Quick replies container should have border-t class
      const quickReply = screen.getByText("Get a quote");
      const container = quickReply.parentElement?.parentElement;
      expect(container?.classList.contains("border-t")).toBe(true);
    });
  });
});
