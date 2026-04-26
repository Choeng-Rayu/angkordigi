import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  saveSessionToStorage,
  loadSessionFromStorage,
  clearSessionStorage,
  type Message,
  type SessionData,
} from "../chat";

describe("session persistence", () => {
  let sessionStorageMock: Storage;
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let removeItemSpy: ReturnType<typeof vi.spyOn>;

  const createMockMessage = (overrides?: Partial<Message>): Message => ({
    id: "msg-1",
    role: "user",
    content: "Hello",
    timestamp: new Date("2026-04-25T10:00:00Z"),
    ...overrides,
  });

  const createMockSessionData = (overrides?: Partial<SessionData>): SessionData => ({
    messages: [createMockMessage()],
    mode: "ai",
    leadData: { name: "John", email: "john@example.com" },
    lastUpdated: new Date().toISOString(),
    ...overrides,
  });

  beforeEach(() => {
    // Create a mock sessionStorage
    const storage: Record<string, string> = {};
    sessionStorageMock = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach((key) => delete storage[key]);
      },
      length: 0,
      key: () => null,
    };

    // Spy on window.sessionStorage methods
    getItemSpy = vi.spyOn(window.sessionStorage, "getItem").mockImplementation(sessionStorageMock.getItem);
    setItemSpy = vi.spyOn(window.sessionStorage, "setItem").mockImplementation(sessionStorageMock.setItem);
    removeItemSpy = vi.spyOn(window.sessionStorage, "removeItem").mockImplementation(sessionStorageMock.removeItem);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("saveSessionToStorage", () => {
    it("saves data correctly", () => {
      const messages: Message[] = [
        createMockMessage({ id: "1", role: "user", content: "Hello" }),
        createMockMessage({ id: "2", role: "assistant", content: "Hi there!" }),
      ];
      const mode: "ai" | "lead" = "ai";
      const leadData = { name: "John", email: "john@example.com" };

      saveSessionToStorage(messages, mode, leadData);

      expect(setItemSpy).toHaveBeenCalledTimes(1);
      expect(setItemSpy).toHaveBeenCalledWith(
        "tomnerb_chat_session",
        expect.any(String)
      );

      const savedData = JSON.parse(setItemSpy.mock.calls[0][1] as string);
      expect(savedData.messages).toHaveLength(2);
      expect(savedData.messages[0].content).toBe("Hello");
      expect(savedData.messages[1].content).toBe("Hi there!");
      expect(savedData.mode).toBe("ai");
      expect(savedData.leadData).toEqual({ name: "John", email: "john@example.com" });
      expect(savedData.lastUpdated).toBeDefined();
    });

    it("does not throw when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing undefined window scenario
      global.window = undefined;

      expect(() => {
        saveSessionToStorage([], "ai", {});
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe("loadSessionFromStorage", () => {
    it("loads data on mount", () => {
      const mockData = createMockSessionData({
        messages: [
          createMockMessage({ id: "1", content: "Test message" }),
        ],
        mode: "lead",
        leadData: { name: "Alice", email: "alice@example.com" },
      });

      getItemSpy.mockReturnValue(JSON.stringify(mockData));

      const result = loadSessionFromStorage();

      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith("tomnerb_chat_session");
      expect(result).not.toBeNull();
      expect(result?.messages).toHaveLength(1);
      expect(result?.messages[0].content).toBe("Test message");
      expect(result?.mode).toBe("lead");
      expect(result?.leadData.name).toBe("Alice");
    });

    it("ignores expired sessions (>30 minutes)", () => {
      const fortyMinutesAgo = new Date(Date.now() - 40 * 60 * 1000);
      const expiredData = createMockSessionData({
        lastUpdated: fortyMinutesAgo.toISOString(),
      });

      getItemSpy.mockReturnValue(JSON.stringify(expiredData));

      const result = loadSessionFromStorage();

      expect(result).toBeNull();
      expect(removeItemSpy).toHaveBeenCalledTimes(1);
      expect(removeItemSpy).toHaveBeenCalledWith("tomnerb_chat_session");
    });

    it("returns session when exactly at 30 minute boundary (not expired)", () => {
      const exactlyThirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000 + 1000); // 1 second less than 30 min
      const sessionData = createMockSessionData({
        lastUpdated: exactlyThirtyMinutesAgo.toISOString(),
      });

      getItemSpy.mockReturnValue(JSON.stringify(sessionData));

      const result = loadSessionFromStorage();

      expect(result).not.toBeNull();
      expect(removeItemSpy).not.toHaveBeenCalled();
    });

    it("fresh start when no session exists", () => {
      getItemSpy.mockReturnValue(null);

      const result = loadSessionFromStorage();

      expect(result).toBeNull();
      expect(getItemSpy).toHaveBeenCalledWith("tomnerb_chat_session");
    });

    it("returns null for invalid JSON data", () => {
      getItemSpy.mockReturnValue("invalid-json-data");

      const result = loadSessionFromStorage();

      expect(result).toBeNull();
    });

    it("does not throw when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing undefined window scenario
      global.window = undefined;

      expect(() => {
        loadSessionFromStorage();
      }).not.toThrow();

      const result = loadSessionFromStorage();
      expect(result).toBeNull();

      global.window = originalWindow;
    });

    it("loads fresh sessions (<30 minutes)", () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const freshData = createMockSessionData({
        lastUpdated: tenMinutesAgo.toISOString(),
        messages: [createMockMessage({ content: "Recent message" })],
      });

      getItemSpy.mockReturnValue(JSON.stringify(freshData));

      const result = loadSessionFromStorage();

      expect(result).not.toBeNull();
      expect(result?.messages[0].content).toBe("Recent message");
      expect(removeItemSpy).not.toHaveBeenCalled();
    });
  });

  describe("clearSessionStorage", () => {
    it("clears data from sessionStorage", () => {
      // First save some data
      sessionStorageMock.setItem("tomnerb_chat_session", JSON.stringify(createMockSessionData()));

      clearSessionStorage();

      expect(removeItemSpy).toHaveBeenCalledTimes(1);
      expect(removeItemSpy).toHaveBeenCalledWith("tomnerb_chat_session");
      expect(sessionStorageMock.getItem("tomnerb_chat_session")).toBeNull();
    });

    it("does not throw when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing undefined window scenario
      global.window = undefined;

      expect(() => {
        clearSessionStorage();
      }).not.toThrow();

      global.window = originalWindow;
    });

    it("succeeds when no session exists", () => {
      // Ensure no data exists
      getItemSpy.mockReturnValue(null);

      expect(() => {
        clearSessionStorage();
      }).not.toThrow();

      expect(removeItemSpy).toHaveBeenCalledWith("tomnerb_chat_session");
    });
  });
});
