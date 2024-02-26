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
  const orgQuery = trpcRQ.org.lookup.useQuery({
    domain: window.location.hostname,
  });

  if (orgQuery.isLoading || orgQuery.isError) return emptyLogo;

  return orgQuery.data.logo ?? logo;
}
