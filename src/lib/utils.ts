import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}

export function generateNameFromUrl(url: string) {
  // Remove protocol (http:// or https://) and www
  const withoutProtocol = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Split the remaining string by dots and filter out empty strings
  const parts = withoutProtocol.split(".").filter((part) => part !== "");

  // Capitalize the first letter of each part
  const capitalizedParts = parts.map(
    (part) => part.charAt(0).toUpperCase() + part.slice(1)
  );

  // Join the parts to form the final name
  const finalName = capitalizedParts.join(" ");

  return finalName;
}
