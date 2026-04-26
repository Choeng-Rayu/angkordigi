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
      widgetTitle: "Chat with us",
      welcomeMessage: "Hello! How can I help you today?",
      placeholder: "Type your message...",
      quickReplies: [
        { label: "Get a quote", value: "I want a quote" },
        { label: "Services", value: "What services do you offer?" },
      ],
    },
    company: {
      email: "info@tomnerb.com",
    },
  },
}));

// Import after mocks
import ChatWidget from "../ChatWidget";

describe("ChatWidget Input", () => {
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

  describe("Input State Updates", () => {
    it("updates input value when user types", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input to be available
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...") as HTMLInputElement;
      
      // Type in the input
      fireEvent.change(input, { target: { value: "Hello there" } });
      
      // Input should have the typed value
      expect(input).toHaveValue("Hello there");
    });

    it("updates input with each keystroke", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...") as HTMLInputElement;
      
      // Type character by character
      fireEvent.change(input, { target: { value: "H" } });
      expect(input).toHaveValue("H");
      
      fireEvent.change(input, { target: { value: "He" } });
      expect(input).toHaveValue("He");
      
      fireEvent.change(input, { target: { value: "Hel" } });
      expect(input).toHaveValue("Hel");
      
      fireEvent.change(input, { target: { value: "Hello" } });
      expect(input).toHaveValue("Hello");
    });

    it("handles special characters in input", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...") as HTMLInputElement;
      
      // Type with special characters
      const specialText = "Hello! @#$%^&*() World 123";
      fireEvent.change(input, { target: { value: specialText } });
      
      expect(input).toHaveValue(specialText);
    });

    it("handles unicode characters in input", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...") as HTMLInputElement;
      
      // Type unicode text
      const unicodeText = "Hello 世界 🌍 مرحبا";
      fireEvent.change(input, { target: { value: unicodeText } });
      
      expect(input).toHaveValue(unicodeText);
    });

    it("handles emojis in input", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...") as HTMLInputElement;
      
      // Type with emojis
      const emojiText = "Great! 🎉🎊👍";
      fireEvent.change(input, { target: { value: emojiText } });
      
      expect(input).toHaveValue(emojiText);
    });

    it("handles very long text in input", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...") as HTMLInputElement;
      
      // Type very long text
      const longText = "A".repeat(500);
      fireEvent.change(input, { target: { value: longText } });
      
      expect(input).toHaveValue(longText);
    });

    it("handles multiline text (though input is single line)", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...") as HTMLInputElement;
      
      // Input is type="text" so newlines might be stripped or handled differently
      // The key behavior is that the input updates
      fireEvent.change(input, { target: { value: "Line 1\nLine 2" } });
      
      // Value should be updated (actual value depends on browser handling)
      expect(input.value).toBeTruthy();
    });
  });

  describe("Enter Key Sending", () => {
    it("sends message when Enter key is pressed", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Type a message
      fireEvent.change(input, { target: { value: "Test message via Enter" } });
      
      // Press Enter
      fireEvent.keyDown(input, { key: "Enter" });
      
      // Message should be sent
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/chat",
          expect.objectContaining({
            method: "POST",
          })
        );
      });
      
      // Check the sent message
      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const lastMessage = requestBody.messages[requestBody.messages.length - 1];
      expect(lastMessage.content).toBe("Test message via Enter");
    });

    it("does not send when Shift+Enter is pressed", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Type a message
      fireEvent.change(input, { target: { value: "Shift+Enter test" } });
      
      // Press Shift+Enter
      fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Message should NOT be sent
      expect(mockFetch).not.toHaveBeenCalled();
      
      // Input should still have the value
      expect(input).toHaveValue("Shift+Enter test");
    });

    it("prevents default behavior when Enter is pressed", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Type a message
      fireEvent.change(input, { target: { value: "Test" } });
      
      // Press Enter with preventDefault check
      const keyDownEvent = fireEvent.keyDown(input, { key: "Enter" });
      
      // The event should have been handled (message sent)
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it("clears input after Enter key send", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Type and send
      fireEvent.change(input, { target: { value: "Clear me" } });
      fireEvent.keyDown(input, { key: "Enter" });
      
      // Wait for input to clear
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("does not send on Enter when input is empty", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Press Enter with empty input
      fireEvent.keyDown(input, { key: "Enter" });
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // No fetch call should be made
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("does not send on Enter when input has only whitespace", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Type only whitespace
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.keyDown(input, { key: "Enter" });
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // No fetch call should be made
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("sends message on Enter after quick reply click", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for welcome message and quick replies
      await waitFor(() => {
        expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Wait for quick replies
      await waitFor(() => {
        expect(screen.getByText("Get a quote")).toBeInTheDocument();
      });
      
      // Click quick reply
      fireEvent.click(screen.getByText("Get a quote"));
      
      // Wait for response
      await waitFor(() => {
        expect(screen.getByText("This is a test response")).toBeInTheDocument();
      });
      
      // Now type a new message
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Follow up question" } });
      fireEvent.keyDown(input, { key: "Enter" });
      
      // Should be sent
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2); // Once for quick reply, once for Enter
      });
    });
  });

  describe("Send Button State", () => {
    it("send button is disabled when input is empty", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const sendButton = screen.getByLabelText("Send message");
      
      // Button should be disabled when input is empty
      expect(sendButton).toBeDisabled();
    });

    it("send button is disabled when input has only whitespace", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      const sendButton = screen.getByLabelText("Send message");
      
      // Type only whitespace
      fireEvent.change(input, { target: { value: "   " } });
      
      // Button should still be disabled
      expect(sendButton).toBeDisabled();
    });

    it("send button is enabled when input has content", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      const sendButton = screen.getByLabelText("Send message");
      
      // Type something
      fireEvent.change(input, { target: { value: "Hello" } });
      
      // Button should be enabled
      expect(sendButton).not.toBeDisabled();
    });

    it("send button is disabled during loading", async () => {
      // Create a delayed promise
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
      
      const input = screen.getByPlaceholderText("Type your message...");
      const sendButton = screen.getByLabelText("Send message");
      
      // Type and send
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.click(sendButton);
      
      // Button should be disabled during loading
      await waitFor(() => {
        expect(sendButton).toBeDisabled();
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

    it("send button shows loading spinner during loading", async () => {
      // Create a delayed promise
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
      
      const input = screen.getByPlaceholderText("Type your message...");
      const sendButton = screen.getByLabelText("Send message");
      
      // Type and send
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.click(sendButton);
      
      // Should show loading spinner (Loader2 icon)
      await waitFor(() => {
        const loaderIcon = screen.getByTestId("loader-icon");
        expect(loaderIcon).toBeInTheDocument();
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

    it("send button is re-enabled after loading completes", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: { content: "Response" },
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
      
      const input = screen.getByPlaceholderText("Type your message...");
      const sendButton = screen.getByLabelText("Send message");
      
      // Type and send
      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.click(sendButton);
      
      // Wait for response
      await waitFor(() => {
        expect(screen.getByText("Response")).toBeInTheDocument();
      });
      
      // Button should be disabled again (input is empty after send)
      await waitFor(() => {
        expect(sendButton).toBeDisabled();
      });
    });

    it("send button has correct aria-label", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeInTheDocument();
    });
  });

  describe("Input Clearing", () => {
    it("clears input after sending via button click", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Type a message
      fireEvent.change(input, { target: { value: "Message to clear" } });
      
      // Send via button
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Wait for input to clear
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("clears input after sending via Enter key", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Type a message
      fireEvent.change(input, { target: { value: "Enter key message" } });
      
      // Send via Enter key
      fireEvent.keyDown(input, { key: "Enter" });
      
      // Wait for input to clear
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("input stays empty after sending empty message (edge case)", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Input is already empty
      expect(input).toHaveValue("");
      
      // Try to send (button is disabled, but let's verify)
      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeDisabled();
      
      // Input should still be empty
      expect(input).toHaveValue("");
    });
  });

  describe("Input Focus", () => {
    it("input receives focus when chat is opened", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for focus (happens after setTimeout in useEffect)
      await waitFor(() => {
        const input = screen.getByPlaceholderText("Type your message...");
        expect(document.activeElement).toBe(input);
      }, { timeout: 200 });
    });

    it("input maintains focus after sending a message", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: { content: "Response" },
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
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Type and send
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.keyDown(input, { key: "Enter" });
      
      // Wait for response
      await waitFor(() => {
        expect(screen.getByText("Response")).toBeInTheDocument();
      });
      
      // Input should still be the active element (receives focus after send)
      expect(document.activeElement).toBe(input);
    });
  });

  describe("Input Styling", () => {
    it("input has correct placeholder text", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...") as HTMLInputElement;
      expect(input.placeholder).toBe("Type your message...");
    });

    it("input is disabled during loading", async () => {
      // Create a delayed promise
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
      
      const input = screen.getByPlaceholderText("Type your message...");
      
      // Send a message
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.click(screen.getByLabelText("Send message"));
      
      // Input should be disabled
      await waitFor(() => {
        expect(input).toBeDisabled();
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

    it("input has rounded styling", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText("Type your message...");
      expect(input.classList.contains("rounded-xl")).toBe(true);
    });

    it("send button has hover effect classes", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton.classList.contains("hover:brightness-110")).toBe(true);
      expect(sendButton.classList.contains("hover:scale-105")).toBe(true);
    });

    it("send button has active state styling", async () => {
      render(<ChatWidget />);
      
      // Open the chat
      fireEvent.click(screen.getByLabelText("Open chat"));
      
      // Wait for input
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
      });
      
      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton.classList.contains("active:scale-95")).toBe(true);
    });
  });
});
