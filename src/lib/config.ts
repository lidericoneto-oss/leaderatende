export const AGENCY_NAME = "LeaderAtende";

// TODO: substituir pelo número real de WhatsApp da agência (formato: código do país + DDD + número, apenas dígitos).
export const AGENCY_WHATSAPP = "5500000000000";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${AGENCY_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
