import { z } from "zod";

export const paginationSchema = z.object({
  take: z.number().int().min(1).max(20).default(20),
  page: z.number().int().min(1).default(1),
  search: z.string().trim().optional(),
});
