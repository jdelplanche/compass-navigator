import { describe, expect, it } from "vitest";
import { applyVisibilityRules, liveStateFromPresence, nextScheduleBoundary } from "./profile";
import { ogLocale } from "./social-meta";

describe("schedule boundary", () => {
  const now = Date.parse("2026-11-03T12:00:00Z");
  it("returns the earliest future start or expiry", () => {
    const blocks = [
      { startsAt: "2026-11-03T15:00:00Z", expiresAt: null, hidden: false },
      { startsAt: null, expiresAt: "2026-11-03T13:00:00Z", hidden: false },
    ] as never[];
    expect(nextScheduleBoundary(blocks, now)).toBe(Date.parse("2026-11-03T13:00:00Z"));
  });
  it("ignores past moments, hidden blocks and invalid dates", () => {
    const blocks = [
      { startsAt: "2026-11-02T00:00:00Z", hidden: false },
      { startsAt: "2026-11-04T00:00:00Z", hidden: true },
      { startsAt: "not-a-date", hidden: false },
    ] as never[];
    expect(nextScheduleBoundary(blocks, now)).toBeNull();
  });
});

describe("visibility rules on public profile", () => {
  const blocks = [{ visibilityRule: "show_only_when_live" }, { visibilityRule: "hide_when_focus_mode" }, {}] as never[];
  it("hides live-only blocks when offline", () => {
    expect(applyVisibilityRules(blocks, liveStateFromPresence("none"))).toHaveLength(2);
  });
  it("hides focus-hidden blocks in focus mode", () => {
    expect(applyVisibilityRules(blocks, liveStateFromPresence("focus"))).toHaveLength(1);
  });
});

describe("og:locale", () => {
  it("uses real territories", () => {
    expect(ogLocale("en")).toBe("en_US");
    expect(ogLocale("nl")).toBe("nl_BE");
  });
});
