import {
  checkAIMessageLimit,
  getAIMessagesRemaining,
  createRateLimitMessage,
} from "../chat";

describe("Rate Limiting", () => {
  describe("checkAIMessageLimit", () => {
    it("should allow messages under limit", () => {
      const messages = Array.from({ length: 10 }, (_, i) => ({
        role: "user" as const,
      }));

      const result = checkAIMessageLimit(messages);

      expect(result).toBe(true);
    });

    it("should block at 20 messages", () => {
      const messages = Array.from({ length: 20 }, (_, i) => ({
        role: "user" as const,
      }));

      const result = checkAIMessageLimit(messages);

      expect(result).toBe(false);
    });

    it("should block when over 20 messages", () => {
      const messages = Array.from({ length: 25 }, (_, i) => ({
        role: "user" as const,
      }));

      const result = checkAIMessageLimit(messages);

      expect(result).toBe(false);
    });

    it("should only count user messages", () => {
      const messages = [
        ...Array.from({ length: 15 }, () => ({ role: "user" as const })),
        ...Array.from({ length: 10 }, () => ({ role: "assistant" as const })),
      ];

      const result = checkAIMessageLimit(messages);

      expect(result).toBe(true);
    });

    it("should allow messages when empty array", () => {
      const result = checkAIMessageLimit([]);

      expect(result).toBe(true);
    });
  });

  describe("getAIMessagesRemaining", () => {
    it("should return correct count for no messages", () => {
      const result = getAIMessagesRemaining([]);

      expect(result).toBe(20);
    });

    it("should return correct count for 5 user messages", () => {
      const messages = Array.from({ length: 5 }, () => ({
        role: "user" as const,
      }));

      const result = getAIMessagesRemaining(messages);

      expect(result).toBe(15);
    });

    it("should return correct count for 19 user messages", () => {
      const messages = Array.from({ length: 19 }, () => ({
        role: "user" as const,
      }));

      const result = getAIMessagesRemaining(messages);

      expect(result).toBe(1);
    });

    it("should return 0 when at limit", () => {
      const messages = Array.from({ length: 20 }, () => ({
        role: "user" as const,
      }));

      const result = getAIMessagesRemaining(messages);

      expect(result).toBe(0);
    });

    it("should return 0 when over limit", () => {
      const messages = Array.from({ length: 25 }, () => ({
        role: "user" as const,
      }));

      const result = getAIMessagesRemaining(messages);

      expect(result).toBe(0);
    });

    it("should only count user messages", () => {
      const messages = [
        ...Array.from({ length: 10 }, () => ({ role: "user" as const })),
        ...Array.from({ length: 15 }, () => ({ role: "assistant" as const })),
      ];

      const result = getAIMessagesRemaining(messages);

      expect(result).toBe(10);
    });
  });

  describe("createRateLimitMessage", () => {
    it("should return AI rate limit message", () => {
      const result = createRateLimitMessage("ai");

      expect(result).toBe(
        "You've reached the message limit for this session. Please email us directly at info@tomnerb.com"
      );
    });

    it("should return lead rate limit message", () => {
      const result = createRateLimitMessage("lead");

      expect(result).toBe(
        "You've reached the submission limit for this session. Please email us directly at info@tomnerb.com"
      );
    });
  });
});
