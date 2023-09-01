import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isBase64Image = (imageData: string) => {
  const re = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return re.test(imageData);
}