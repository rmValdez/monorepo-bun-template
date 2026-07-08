import { z } from "zod";

export const todoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
});

export const createTodoSchema = todoFormSchema;
export type TCreateTodoSchemaInput = z.input<typeof createTodoSchema>;

export const updateTodoSchema = todoFormSchema.extend({
  id: z.number(),
  status: z.boolean(),
});
export type TUpdateTodoSchemaInput = z.input<typeof updateTodoSchema>;
