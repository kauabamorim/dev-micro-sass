import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deleteCookie(name: string) {
  console.log("Tentando remover o cookie:", name);
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
}

export function getCookieValue(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return match[2];
  }
  return null;
}
