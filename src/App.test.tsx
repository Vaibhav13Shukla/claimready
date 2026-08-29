import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("EPFO app", () => {
  beforeEach(() => {
    window.location.hash = "#/";
  });

  it("renders the EPFO masthead and a top-level page heading", () => {
    render(<App />);
    expect(screen.getAllByText(/EPFO/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("offers a sign-in entry point when logged out", () => {
    render(<App />);
    expect(screen.getAllByRole("button", { name: /sign in with uan/i }).length).toBeGreaterThan(0);
  });

  it("signs in with the demo account and shows the member dashboard", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /sign in with uan/i })[0]);

    const fill = await screen.findByRole("button", { name: /fill demo details/i });
    await user.click(fill);

    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(await screen.findByText(/Ramesh Kumar/i)).toBeInTheDocument();
  });

  it("switches the whole interface to Hindi", async () => {
    const user = userEvent.setup();
    render(<App />);
    const banner = screen.getByRole("banner");
    await user.click(within(banner).getByRole("button", { name: "हिन्दी" }));
    expect(await within(banner).findByRole("button", { name: /मेरा खाता/ })).toBeInTheDocument();
  });

  it("claim pre-flight: fixing the blocking issues flips the verdict to ready", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/claim-check";
    render(<App />);
    expect(await screen.findByText(/would get your claim rejected/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /fix the name to match/i }));
    await user.click(screen.getByRole("button", { name: /re-verify my bank account/i }));
    expect(await screen.findByText(/ready to file/i)).toBeInTheDocument();
  });

  it("rejection decoder explains a cryptic reason in plain language", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/claim-check";
    render(<App />);
    const select = await screen.findByRole("combobox", { name: /message you received/i });
    await user.selectOptions(select, "Bank KYC not approved / IFSC invalid");
    expect(await screen.findByText(/bank account is not verified/i)).toBeInTheDocument();
  });
});
