import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";

// Mock OpenAI
const mockCreate = vi.fn();
vi.mock("openai", () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
}));

// Mock chat utilities
vi.mock("@/app/lib/chat", () => ({
  validateEmail: vi.fn((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  checkAIMessageLimit: vi.fn(() => true),
  createRateLimitMessage: vi.fn((type: string) =>
    type === "ai"
      ? "You've reached the message limit for this session. Please email us directly at info@tomnerb.com"
      : "You've reached the submission limit for this session. Please email us directly at info@tomnerb.com"
  ),
}));

// Mock site config
vi.mock("@/app/data/siteData", () => ({
  siteConfig: {
    chat: {
      systemPrompt: "You are a helpful assistant.",
    },
  },
}));

describe("Chat API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up environment variables
    process.env.NVIDIA_API_KEY = "test-api-key";
    process.env.NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
    process.env.NVIDIA_MODEL = "nvidia/nemotron-3-nano-30b-a3b";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  });

  describe("AI Mode", () => {
    it("returns AI response for regular message", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: "I can help you with custom software development!",
            },
          },
        ],
      };
      mockCreate.mockResolvedValueOnce(mockResponse);

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "Tell me about your services" }],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message.content).toBe("I can help you with custom software development!");
      expect(data.mode).toBe("ai");
      expect(mockCreate).toHaveBeenCalledWith({
        model: "nvidia/nemotron-3-nano-30b-a3b",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Tell me about your services" },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });
    });

    it("handles empty AI response gracefully", async () => {
      mockCreate.mockResolvedValueOnce({ choices: [] });

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "Hello" }],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message.content).toBe("I'm not sure how to respond to that.");
    });

    it("handles AI API errors gracefully", async () => {
      mockCreate.mockRejectedValueOnce(new Error("API Error"));

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "Hello" }],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message.content).toContain("I apologize, but I'm having trouble connecting");
      expect(data.message.content).toContain("info@tomnerb.com");
    });
  });

  describe("Lead Trigger", () => {
    it("switches to lead mode when trigger word 'quote' is detected", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "Can I get a quote?" }],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.mode).toBe("lead");
      expect(data.leadStep).toBe("name");
      expect(data.message.content).toBe("I'd be happy to connect you with our team! What's your name?");
    });

    it("switches to lead mode when trigger word 'price' is detected", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "What's the price?" }],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.mode).toBe("lead");
      expect(data.leadStep).toBe("name");
    });

    it("switches to lead mode when trigger word 'contact' is detected", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "How can I contact you?" }],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.mode).toBe("lead");
      expect(data.leadStep).toBe("name");
    });

    it("switches to lead mode when trigger word 'team' is detected", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "I want to talk to your team" }],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.mode).toBe("lead");
    });

    it("does not trigger lead mode for non-trigger words", async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: "Here's some info" } }],
      });

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "What services do you offer?" }],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.mode).toBe("ai");
      expect(data.leadStep).toBeUndefined();
    });
  });

  describe("Lead Capture Flow", () => {
    it("handles name step - accepts valid name", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "John Smith" }],
          mode: "lead",
          leadStep: "name",
          leadData: {},
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.leadStep).toBe("email");
      expect(data.leadData.name).toBe("John Smith");
      expect(data.message.content).toBe("Thanks John Smith! What's your email address?");
    });

    it("handles name step - rejects too short name", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "J" }],
          mode: "lead",
          leadStep: "name",
          leadData: {},
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.leadStep).toBe("name");
      expect(data.message.content).toBe("Please provide your full name so our team knows who to contact.");
    });

    it("handles email step - accepts valid email", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "john@example.com" }],
          mode: "lead",
          leadStep: "email",
          leadData: { name: "John Smith" },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.leadStep).toBe("message");
      expect(data.leadData.email).toBe("john@example.com");
      expect(data.message.content).toBe("What challenge can we help you solve?");
    });

    it("handles email step - rejects invalid email", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "not-an-email" }],
          mode: "lead",
          leadStep: "email",
          leadData: { name: "John Smith" },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.leadStep).toBe("email");
      expect(data.message.content).toBe("That doesn't look like a valid email address. Could you please double-check it?");
    });

    it("handles message step - submits lead and returns to AI mode", async () => {
      // Mock fetch for lead submission
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "I need help with automation" }],
          mode: "lead",
          leadStep: "message",
          leadData: { name: "John Smith", email: "john@example.com" },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.mode).toBe("ai");
      expect(data.leadStep).toBe("complete");
      expect(data.message.content).toContain("Thank you John Smith");
      expect(data.message.content).toContain("john@example.com");
      expect(data.message.content).toContain("within 24 hours");

      // Verify lead was submitted
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/lead",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("John Smith"),
        })
      );
    });

    it("handles message step - works even if lead submission fails", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        text: vi.fn().mockResolvedValue("Error"),
      });

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "I need help" }],
          mode: "lead",
          leadStep: "message",
          leadData: { name: "Jane Doe", email: "jane@example.com" },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should still return success to user even if backend submission failed
      expect(data.mode).toBe("ai");
      expect(data.message.content).toContain("Thank you Jane Doe");
    });

    it("handles complete step - returns to normal AI mode", async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: "How else can I help you?" } }],
      });

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            { role: "user" as const, content: "Hello" },
            { role: "assistant" as const, content: "Hi there!" },
          ],
          mode: "ai",
          leadStep: "complete",
          leadData: {},
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.mode).toBe("ai");
      expect(data.leadStep).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("returns error for missing user message", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [],
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No user message found");
    });

    it("returns error for invalid JSON", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: "invalid json",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message.content).toContain("I apologize, but I'm having trouble");
    });

    it("handles missing messages array gracefully", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ mode: "ai" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No user message found");
    });
  });

  describe("Rate Limiting", () => {
    it("enforces rate limit when AI message limit is exceeded", async () => {
      const { checkAIMessageLimit, createRateLimitMessage } = await import("@/app/lib/chat");
      vi.mocked(checkAIMessageLimit).mockReturnValueOnce(false);
      vi.mocked(createRateLimitMessage).mockReturnValueOnce("Rate limit exceeded message");

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: Array(25).fill({ role: "user" as const, content: "test" }),
          mode: "ai",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message.content).toBe("Rate limit exceeded message");
      expect(data.rateLimited).toBe(true);
      expect(data.mode).toBe("ai");
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("does not apply rate limiting in lead mode", async () => {
      const { checkAIMessageLimit } = await import("@/app/lib/chat");
      vi.mocked(checkAIMessageLimit).mockReturnValueOnce(false);

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user" as const, content: "John" }],
          mode: "lead",
          leadStep: "name",
          leadData: {},
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should process lead normally, not rate limited
      expect(data.leadStep).toBe("email");
    });
  });
});
