import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { trpcRQ } from "@/lib/trpc";
import logo from "@/assets/images/logo.png";
import emptyLogo from "@/assets/images/empty-logo.png";

/** Combine tailwind classed and add conditional classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useOrgLogo(): string {
  const logoQuery = trpcRQ.settings.getPublic.useQuery({
    keys: ["logoB64"],
  });

  if (logoQuery.isLoading || logoQuery.isError) return emptyLogo;

  return logoQuery.data.settings.get("logoB64")?.value ?? logo;
}
