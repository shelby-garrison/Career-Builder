export function isValidHex(color: string): boolean {
  return /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(color);
}

export function isValidUrl(url?: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function nonEmpty(str: string): boolean {
  return !!str && str.trim().length > 0;
}
