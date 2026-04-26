import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { validateEmail, createMessage, type Message } from "../chat";

describe("Email Validation Property Tests", () => {
  it("should accept all valid email formats", () => {
    fc.assert(
      fc.property(
        fc.record({
          localPart: fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[^\s@]+$/.test(s)),
          domain: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[^\s@.][^\s@]*\.[^\s@.]+$/.test(s)),
        }),
        ({ localPart, domain }) => {
          const email = `${localPart}@${domain}`;
          return validateEmail(email) === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should reject strings without @ symbol", () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes("@")),
        (invalidEmail) => {
          return validateEmail(invalidEmail) === false;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Message Serialization Property Tests", () => {
  const serializeMessage = (message: Message): string => {
    return JSON.stringify(message);
  };

  const deserializeMessage = (serialized: string): Message => {
    const parsed = JSON.parse(serialized);
    return {
      ...parsed,
      timestamp: new Date(parsed.timestamp),
    };
  };

  it("should maintain round-trip consistency for message serialization", () => {
    fc.assert(
      fc.property(
        fc.record({
          role: fc.constantFrom("user", "assistant"),
          content: fc.string({ minLength: 1, maxLength: 500 }),
        }),
        ({ role, content }) => {
          const originalMessage = createMessage(role, content);
          const serialized = serializeMessage(originalMessage);
          const deserialized = deserializeMessage(serialized);

          return (
            deserialized.id === originalMessage.id &&
            deserialized.role === originalMessage.role &&
            deserialized.content === originalMessage.content &&
            deserialized.timestamp.getTime() === originalMessage.timestamp.getTime()
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should produce equivalent objects after serialize/deserialize round-trip", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 5, maxLength: 15 }),
          role: fc.constantFrom("user", "assistant"),
          content: fc.string({ minLength: 0, maxLength: 1000 }),
          timestamp: fc.date(),
        }),
        ({ id, role, content, timestamp }) => {
          const original: Message = { id, role, content, timestamp };
          const serialized = serializeMessage(original);
          const deserialized = deserializeMessage(serialized);

          // Check structural equality
          const isEquivalent =
            deserialized.id === original.id &&
            deserialized.role === original.role &&
            deserialized.content === original.content &&
            deserialized.timestamp.getTime() === original.timestamp.getTime();

          return isEquivalent;
        }
      ),
      { numRuns: 100 }
    );
  });
});
