import {
  createMessage,
  formatTime,
  generateId,
  sanitizeInput,
  validateEmail,
  checkLeadCaptureTrigger,
  generateMockResponse,
  generateLeadCaptureResponse,
  Message,
} from "../chat";

describe("createMessage()", () => {
  it("creates a message with user role and correct structure", () => {
    const content = "Hello, I need help with automation";
    const message = createMessage("user", content);

    expect(message).toHaveProperty("id");
    expect(message).toHaveProperty("role", "user");
    expect(message).toHaveProperty("content", content);
    expect(message).toHaveProperty("timestamp");
    expect(message.timestamp).toBeInstanceOf(Date);
  });

  it("creates a message with assistant role and correct structure", () => {
    const content = "Hello! How can I help you today?";
    const message = createMessage("assistant", content);

    expect(message).toHaveProperty("id");
    expect(message).toHaveProperty("role", "assistant");
    expect(message).toHaveProperty("content", content);
    expect(message).toHaveProperty("timestamp");
    expect(message.timestamp).toBeInstanceOf(Date);
  });

  it("generates unique IDs for different messages", () => {
    const message1 = createMessage("user", "First message");
    const message2 = createMessage("user", "Second message");

    expect(message1.id).not.toBe(message2.id);
  });

  it("sets current timestamp for created messages", () => {
    const beforeCreate = new Date();
    const message = createMessage("user", "Test");
    const afterCreate = new Date();

    expect(message.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(message.timestamp.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
  });
});

describe("formatTime()", () => {
  it("formats morning time correctly (AM)", () => {
    const date = new Date("2024-01-15T09:30:00");
    const formatted = formatTime(date);

    expect(formatted).toMatch(/9:30\s*AM/i);
  });

  it("formats afternoon time correctly (PM)", () => {
    const date = new Date("2024-01-15T14:45:00");
    const formatted = formatTime(date);

    expect(formatted).toMatch(/2:45\s*PM/i);
  });

  it("formats midnight time correctly", () => {
    const date = new Date("2024-01-15T00:00:00");
    const formatted = formatTime(date);

    expect(formatted).toMatch(/12:00\s*AM/i);
  });

  it("formats noon time correctly", () => {
    const date = new Date("2024-01-15T12:00:00");
    const formatted = formatTime(date);

    expect(formatted).toMatch(/12:00\s*PM/i);
  });

  it("always includes minutes with two digits", () => {
    const date = new Date("2024-01-15T10:05:00");
    const formatted = formatTime(date);

    expect(formatted).toMatch(/10:05/i);
  });

  it("uses 12-hour format", () => {
    const date = new Date("2024-01-15T23:30:00");
    const formatted = formatTime(date);

    // Should show 11:30 PM, not 23:30
    expect(formatted).toMatch(/11:30\s*PM/i);
    expect(formatted).not.toMatch(/23:30/);
  });
});

describe("generateId()", () => {
  it("produces a string ID", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
  });

  it("produces IDs with expected length (7 characters)", () => {
    const id = generateId();
    expect(id.length).toBe(7);
  });

  it("produces unique IDs across multiple calls", () => {
    const ids = new Set<string>();
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      ids.add(generateId());
    }

    expect(ids.size).toBe(iterations);
  });

  it("produces IDs with alphanumeric characters only", () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

describe("sanitizeInput()", () => {
  it("escapes less-than character", () => {
    const input = "<script>";
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("&lt;script&gt;");
  });

  it("escapes greater-than character", () => {
    const input = "div>";
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("div&gt;");
  });

  it("escapes double quotes", () => {
    const input = 'onclick="alert(1)"';
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe('onclick=&quot;alert(1)&quot;');
  });

  it("escapes single quotes", () => {
    const input = "onclick='alert(1)'";
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("onclick=&#x27;alert(1)&#x27;");
  });

  it("escapes forward slash", () => {
    const input = "</script>";
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("&lt;&#x2F;script&gt;");
  });

  it("escapes multiple HTML special characters in one string", () => {
    const input = '<img src="x" onerror="alert(1)">';
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe(
      '&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;'
    );
  });

  it("leaves safe text unchanged", () => {
    const input = "Hello World";
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("Hello World");
  });

  it("handles empty string", () => {
    const input = "";
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("");
  });

  it("handles string with no special characters", () => {
    const input = "Just regular text with numbers 123";
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("Just regular text with numbers 123");
  });
});

describe("validateEmail()", () => {
  // Valid email examples
  it.each([
    ["user@example.com"],
    ["first.last@domain.co.uk"],
    ["user+tag@example.com"],
    ["user123@test.io"],
    ["name.surname@company.com"],
  ])("returns true for valid email: %s", (email) => {
    expect(validateEmail(email)).toBe(true);
  });

  // Invalid email examples
  it.each([
    ["plainstring"],
    ["@nodomain.com"],
    ["missing@domain"],
    ["spaces in@email.com"],
    ["double@@at.com"],
    ["trailingdot@domain."],
    [".leadingdot@domain.com"],
    ["@"],
    [""],
    ["user@.com"],
  ])("returns false for invalid email: %s", (email) => {
    expect(validateEmail(email)).toBe(false);
  });
});

describe("checkLeadCaptureTrigger()", () => {
  it("triggers on 'quote' keyword", () => {
    expect(checkLeadCaptureTrigger("I want a quote")).toBe(true);
    expect(checkLeadCaptureTrigger("Can you give me pricing")).toBe(true);
  });

  it("triggers on 'price' keyword", () => {
    expect(checkLeadCaptureTrigger("What is the price")).toBe(true);
  });

  it("triggers on 'pricing' keyword", () => {
    expect(checkLeadCaptureTrigger("Show me your pricing")).toBe(true);
  });

  it("triggers on 'cost' keyword", () => {
    expect(checkLeadCaptureTrigger("How much does it cost")).toBe(true);
  });

  it("triggers on 'contact' keyword", () => {
    expect(checkLeadCaptureTrigger("I want to contact you")).toBe(true);
  });

  it("triggers on 'team' keyword", () => {
    expect(checkLeadCaptureTrigger("Can I talk to your team")).toBe(true);
  });

  it("triggers on 'speak' keyword", () => {
    expect(checkLeadCaptureTrigger("I want to speak with someone")).toBe(true);
  });

  it("triggers on 'talk' keyword", () => {
    expect(checkLeadCaptureTrigger("Can we talk about this")).toBe(true);
  });

  it("triggers on 'reach out' keyword", () => {
    expect(checkLeadCaptureTrigger("Please reach out to me")).toBe(true);
  });

  it("triggers on 'call' keyword", () => {
    expect(checkLeadCaptureTrigger("Can you call me")).toBe(true);
  });

  it("triggers on 'email' keyword", () => {
    expect(checkLeadCaptureTrigger("Send me an email")).toBe(true);
  });

  it("triggers on 'consultation' keyword", () => {
    expect(checkLeadCaptureTrigger("I need a consultation")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(checkLeadCaptureTrigger("I want a QUOTE")).toBe(true);
    expect(checkLeadCaptureTrigger("PRICING information")).toBe(true);
    expect(checkLeadCaptureTrigger("CONTACT us")).toBe(true);
  });

  it("does not trigger on non-lead capture messages", () => {
    expect(checkLeadCaptureTrigger("Hello there")).toBe(false);
    expect(checkLeadCaptureTrigger("What services do you offer")).toBe(false);
    expect(checkLeadCaptureTrigger("Tell me about your company")).toBe(false);
  });

  it("handles empty string", () => {
    expect(checkLeadCaptureTrigger("")).toBe(false);
  });
});

describe("generateMockResponse()", () => {
  it("responds to custom software inquiries", () => {
    const response = generateMockResponse("I need custom software");
    expect(response.toLowerCase()).toContain("custom software");
  });

  it("responds to web app inquiries", () => {
    const response = generateMockResponse("Can you build a web app");
    expect(response.toLowerCase()).toContain("web");
  });

  it("responds to mobile app inquiries", () => {
    const response = generateMockResponse("I need a mobile app");
    expect(response.toLowerCase()).toContain("mobile");
  });

  it("responds to automation inquiries", () => {
    const response = generateMockResponse("business automation");
    expect(response.toLowerCase()).toContain("automation");
  });

  it("responds to workflow inquiries", () => {
    const response = generateMockResponse("workflow optimization");
    expect(response.toLowerCase()).toContain("workflow");
  });

  it("responds to AI/ML inquiries", () => {
    const response = generateMockResponse("AI solutions");
    expect(response.toLowerCase()).toContain("ai");
  });

  it("responds to machine learning inquiries", () => {
    const response = generateMockResponse("machine learning");
    expect(response.toLowerCase()).toContain("machine learning");
  });

  it("responds to pricing inquiries", () => {
    const response = generateMockResponse("how much does it cost");
    expect(response.toLowerCase()).toContain("pricing");
  });

  it("responds to quote inquiries", () => {
    const response = generateMockResponse("I need a quote");
    expect(response.toLowerCase()).toContain("quote");
  });

  it("responds to greetings", () => {
    const response = generateMockResponse("hello");
    expect(response).toContain("👋");
  });

  it("responds to team contact requests", () => {
    const response = generateMockResponse("I want to speak to your team");
    expect(response.toLowerCase()).toContain("team");
  });

  it("responds to Cambodia location inquiries", () => {
    const response = generateMockResponse("Are you based in Cambodia");
    expect(response.toLowerCase()).toContain("cambodia");
  });

  it("responds to Phnom Penh inquiries", () => {
    const response = generateMockResponse("Phnom Penh office");
    expect(response.toLowerCase()).toContain("cambodia");
  });

  it("responds to SME inquiries", () => {
    const response = generateMockResponse("SME solutions");
    expect(response.toLowerCase()).toContain("sme");
  });

  it("responds to startup inquiries", () => {
    const response = generateMockResponse("I have a startup");
    expect(response.toLowerCase()).toContain("startup");
  });

  it("returns fallback response for unknown topics", () => {
    const response = generateMockResponse("random unknown topic");
    expect(response.length).toBeGreaterThan(0);
    expect(response).toContain("?");
  });

  it("handles case-insensitive matching", () => {
    const lowerResponse = generateMockResponse("custom software");
    const upperResponse = generateMockResponse("CUSTOM SOFTWARE");
    expect(lowerResponse).toBe(upperResponse);
  });
});

describe("generateLeadCaptureResponse()", () => {
  it("returns name prompt for 'name' step", () => {
    const response = generateLeadCaptureResponse("name");
    expect(response.toLowerCase()).toContain("name");
    expect(response.toLowerCase()).toContain("what's your name");
  });

  it("returns email prompt for 'email' step with name", () => {
    const response = generateLeadCaptureResponse("email", { name: "John" });
    expect(response).toContain("John");
    expect(response.toLowerCase()).toContain("email");
  });

  it("returns email prompt for 'email' step without name", () => {
    const response = generateLeadCaptureResponse("email");
    expect(response.toLowerCase()).toContain("email");
  });

  it("returns message prompt for 'message' step", () => {
    const response = generateLeadCaptureResponse("message");
    expect(response.toLowerCase()).toContain("project");
    expect(response.toLowerCase()).toContain("challenge");
  });

  it("returns completion message for 'complete' step with data", () => {
    const response = generateLeadCaptureResponse("complete", {
      name: "Alice",
      email: "alice@example.com",
    });
    expect(response).toContain("Alice");
    expect(response).toContain("alice@example.com");
    expect(response).toContain("24 hours");
    expect(response).toContain("🎉");
  });

  it("returns completion message for 'complete' step without data", () => {
    const response = generateLeadCaptureResponse("complete");
    expect(response).toContain("🎉");
    expect(response).toContain("24 hours");
  });

  it("returns default message for unknown step", () => {
    const response = generateLeadCaptureResponse("unknown" as "name");
    expect(response.toLowerCase()).toContain("connect you with our team");
  });

  it("handles partial data (only name)", () => {
    const response = generateLeadCaptureResponse("complete", { name: "Bob" });
    expect(response).toContain("Bob");
    expect(response).toContain("undefined"); // email is undefined
  });

  it("handles partial data (only email)", () => {
    const response = generateLeadCaptureResponse("complete", { email: "bob@example.com" });
    expect(response).toContain("undefined"); // name is undefined
    expect(response).toContain("bob@example.com");
  });
});
