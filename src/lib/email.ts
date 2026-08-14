export function emailRow(label: string, value?: string | null): string {
  if (!value?.trim()) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${label}</td><td style="padding:4px 0;">${value}</td></tr>`;
}
