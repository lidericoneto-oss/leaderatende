declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLead() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead");
  }
}
