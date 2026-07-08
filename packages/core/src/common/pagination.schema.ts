import { z } from "zod";

export const paginationSchema = z.object({
  pageIndex: z.number().default(0),
  pageSize: z.number().default(10),
  search: z.string().optional(),
  sorts: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean(),
      }),
    )
    .optional(),
  filters: z
    .array(
      z.object({
        id: z.string(),
        value: z.array(z.string()),
      }),
    )
    .optional(),
});

export type TPaginationSchema = z.output<typeof paginationSchema>;
export type TPaginationSchemaInput = z.input<typeof paginationSchema>;
