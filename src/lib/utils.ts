import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deleteCookie(name: string) {
  console.log("Tentando remover o cookie:", name);
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
}
