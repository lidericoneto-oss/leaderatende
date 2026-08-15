export const AGENCY_NAME = "LeaderAtende";

export const AGENCY_WHATSAPP = "5573999133773";

export const SITE_URL = "https://leaderatende.vercel.app";

export const FB_PIXEL_ID = "1737078024073171";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${AGENCY_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
