import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str?: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatStringToJSON(content: string) {
  let json;
  // Recherche du premier { et du dernier }
  const firstCurly = content.indexOf("{");
  const lastCurly = content.lastIndexOf("}");
  if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
    const jsonStr = content.substring(firstCurly, lastCurly + 1);
    try {
      json = JSON.parse(jsonStr);
    } catch (e) {
      json = null;
    }
  }
  // Si pas d'objet, on tente pareil pour les crochets [ ]
  if (!json) {
    const firstBracket = content.indexOf("[");
    const lastBracket = content.lastIndexOf("]");
    if (
      firstBracket !== -1 &&
      lastBracket !== -1 &&
      lastBracket > firstBracket
    ) {
      const jsonStr = content.substring(firstBracket, lastBracket + 1);
      try {
        json = JSON.parse(jsonStr);
      } catch (e) {
        json = null;
      }
    }
  }
  return json;
}
