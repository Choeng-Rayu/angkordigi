import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatWidget from "../ChatWidget";
import { siteConfig } from "@/app/data/siteData";

describe("ChatPanel Header", () => {
  beforeEach(() => {
    // Mock sessionStorage
    const mockStorage: Record<string, string> = {};
    vi.spyOn(window.sessionStorage, "getItem").mockImplementation(
      (key: string) => mockStorage[key] || null
    );
    vi.spyOn(window.sessionStorage, "setItem").mockImplementation(
      (key: string, value: string) => {
        mockStorage[key] = value;
      }
    );
    vi.spyOn(window.sessionStorage, "removeItem").mockImplementation(
      (key: string) => {
        delete mockStorage[key];
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders header with TomNerb branding and Sparkles icon", async () => {
    render(<ChatWidget />);

    // Open the chat widget
    const openButton = screen.getByLabelText("Open chat");
    fireEvent.click(openButton);

    // Wait for the panel to be visible
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Check for Sparkles icon in the header
    const sparklesIcon = document.querySelector(".lucide-sparkles");
    expect(sparklesIcon).toBeInTheDocument();

    // Check branding container exists
    const header = screen.getByRole("dialog").querySelector(".border-b");
    expect(header).toBeInTheDocument();
  });

  it("displays widget title from siteConfig", async () => {
    render(<ChatWidget />);

    // Open the chat widget
    const openButton = screen.getByLabelText("Open chat");
    fireEvent.click(openButton);

    // Wait for the panel to be visible
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Check that the widget title from siteConfig is displayed
    const widgetTitle = screen.getByText(siteConfig.chat.widgetTitle);
    expect(widgetTitle).toBeInTheDocument();
    expect(widgetTitle).toHaveAttribute("id", "chat-widget-title");
  });

  it("renders close button with X icon", async () => {
    render(<ChatWidget />);

    // Open the chat widget
    const openButton = screen.getByLabelText("Open chat");
    fireEvent.click(openButton);

    // Wait for the panel to be visible
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Check for close button with aria-label
    const closeButton = screen.getByLabelText("Close chat");
    expect(closeButton).toBeInTheDocument();

    // Check for X icon
    const xIcon = document.querySelector(".lucide-x");
    expect(xIcon).toBeInTheDocument();
  });

  it("closes widget when close button is clicked", async () => {
    render(<ChatWidget />);

    // Open the chat widget
    const openButton = screen.getByLabelText("Open chat");
    fireEvent.click(openButton);

    // Wait for the panel to be visible
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Click the close button
    const closeButton = screen.getByLabelText("Close chat");
    fireEvent.click(closeButton);

    // Wait for the panel to close (dialog should no longer be visible)
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // Open button should be visible again
    expect(screen.getByLabelText("Open chat")).toBeInTheDocument();
  });

  it("closes widget when Escape key is pressed", async () => {
    render(<ChatWidget />);

    // Open the chat widget
    const openButton = screen.getByLabelText("Open chat");
    fireEvent.click(openButton);

    // Wait for the panel to be visible
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Press Escape key
    fireEvent.keyDown(window, { key: "Escape" });

    // Wait for the panel to close
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // Open button should be visible again
    expect(screen.getByLabelText("Open chat")).toBeInTheDocument();
  });

  it("displays branding correctly", async () => {
    render(<ChatWidget />);

    // Open the chat widget
    const openButton = screen.getByLabelText("Open chat");
    fireEvent.click(openButton);

    // Wait for the panel to be visible
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Check header structure and branding elements
    const dialog = screen.getByRole("dialog");
    const header = dialog.querySelector(".border-b");
    expect(header).toBeInTheDocument();

    // Verify TomNerb Assistant text is present (branding)
    const titleElement = screen.getByText(siteConfig.chat.widgetTitle);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("font-medium");

    // Verify Sparkles icon container (branding accent)
    const sparklesContainer = header?.querySelector(".bg-accent\\/20");
    expect(sparklesContainer).toBeInTheDocument();

    // Verify the icon has correct color class
    const sparklesIcon = header?.querySelector(".text-accent");
    expect(sparklesIcon).toBeInTheDocument();
  });
});
