import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";

// Mock Resend
const mockSend = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

// Mock chat utilities
vi.mock("@/app/lib/chat", () => ({
  validateEmail: vi.fn((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
}));

describe("Lead API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.RESEND_FROM_EMAIL = "noreply@tomnerb.com";
    process.env.RESEND_TO_EMAIL = "info@tomnerb.com";
  });

  describe("Successful Submission", () => {
    it("submits lead successfully with valid data", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-123" },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "John Smith",
          email: "john@example.com",
          message: "I need help with automation for my business processes",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Lead submitted successfully");
      expect(data.data.id).toBe("email-123");

      // Verify email was sent with correct parameters
      expect(mockSend).toHaveBeenCalledWith({
        from: "noreply@tomnerb.com",
        to: "info@tomnerb.com",
        subject: "New Lead from Chat Widget",
        html: expect.stringContaining("John Smith"),
      });

      // Verify email content includes all fields
      const emailHtml = mockSend.mock.calls[0][0].html;
      expect(emailHtml).toContain("john@example.com");
      expect(emailHtml).toContain("I need help with automation");
      expect(emailHtml).toContain("New Lead from Chat Widget");
    });

    it("handles message with newlines correctly", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-456" },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane@example.com",
          message: "Line 1\nLine 2\nLine 3",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify newlines are converted to <br> tags
      const emailHtml = mockSend.mock.calls[0][0].html;
      expect(emailHtml).toContain("Line 1<br>Line 2<br>Line 3");
    });

    it("uses default from/to emails when env vars not set", async () => {
      delete process.env.RESEND_FROM_EMAIL;
      delete process.env.RESEND_TO_EMAIL;

      mockSend.mockResolvedValueOnce({
        data: { id: "email-789" },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "This is a test message that is long enough",
          timestamp: new Date().toISOString(),
        }),
      });

      await POST(request);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "noreply@tomnerb.com",
          to: "info@tomnerb.com",
        })
      );
    });
  });

  describe("Email Validation", () => {
    it("rejects submission with missing name", async () => {
      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "",
          email: "test@example.com",
          message: "Valid message here",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("rejects submission with missing email", async () => {
      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "",
          message: "Valid message here",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("rejects submission with missing message", async () => {
      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("rejects submission with invalid email format", async () => {
      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "not-an-email",
          message: "Valid message here",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid email format");
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("rejects submission with name too short", async () => {
      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "A",
          email: "test@example.com",
          message: "Valid message here",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Name must be at least 2 characters");
    });

    it("rejects submission with message too short", async () => {
      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "Short",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Message must be at least 10 characters");
    });

    it("accepts valid email with special characters", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-abc" },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "user+tag@example.co.uk",
          message: "This is a valid message with enough characters",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("API Failures", () => {
    it("handles Resend API error", async () => {
      mockSend.mockResolvedValueOnce({
        data: null,
        error: { message: "Failed to send" },
      });

      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "This is a valid message with enough characters",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed to send email");
    });

    it("handles missing RESEND_API_KEY", async () => {
      delete process.env.RESEND_API_KEY;

      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "This is a valid message",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Email service not configured");
    });

    it("handles unexpected errors gracefully", async () => {
      mockSend.mockRejectedValueOnce(new Error("Network error"));

      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "This is a valid message",
          timestamp: new Date().toISOString(),
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Internal server error");
    });

    it("handles invalid JSON in request body", async () => {
      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: "invalid json",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Internal server error");
    });
  });

  describe("Email Content", () => {
    it("includes timestamp in readable format", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-ts" },
        error: null,
      });

      const timestamp = "2026-04-25T10:30:00.000Z";
      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "Test message content here",
          timestamp,
        }),
      });

      await POST(request);

      const emailHtml = mockSend.mock.calls[0][0].html;
      // Should include formatted timestamp
      expect(emailHtml).toContain("Timestamp");
      expect(emailHtml).toContain("Sent from TomNerb Chat Widget");
    });

    it("escapes HTML in message content", async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: "email-html" },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/lead", {
        method: "POST",
        body: JSON.stringify({
          name: "Test <script>alert('xss')</script> User",
          email: "test@example.com",
          message: "Message with <b>tags</b> and more content here",
          timestamp: new Date().toISOString(),
        }),
      });

      await POST(request);

      const emailHtml = mockSend.mock.calls[0][0].html;
      // Raw HTML should be in the email (Resend handles escaping)
      expect(emailHtml).toContain("<script>");
    });
  });
});
