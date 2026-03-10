import { describe, it, expect } from "vitest";
import { getTodayKeyLocal, isFrameFromToday } from "../date";

describe("getTodayKeyLocal", () => {
  it("returns YYYY-MM-DD for given date", () => {
    expect(getTodayKeyLocal(new Date("2026-03-10T12:00:00Z"))).toBe("2026-03-10");
    expect(getTodayKeyLocal(new Date("2025-01-01T00:00:00"))).toBe("2025-01-01");
  });
});

describe("isFrameFromToday", () => {
  it("returns true when createdAt is on the same local day as todayKey", () => {
    expect(isFrameFromToday("2026-03-10T08:00:00Z", "2026-03-10")).toBe(true);
  });
  it("returns false when createdAt is on a different day", () => {
    expect(isFrameFromToday("2026-03-09T12:00:00Z", "2026-03-10")).toBe(false);
    expect(isFrameFromToday("2026-03-11T00:00:00Z", "2026-03-10")).toBe(false);
  });
  it("returns false for invalid date string", () => {
    expect(isFrameFromToday("invalid", "2026-03-10")).toBe(false);
  });
});
