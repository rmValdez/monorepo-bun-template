import { createServerFn } from "@tanstack/react-start";
import { TodoService } from "@workspace/core/todo/todo.service";
import { actionError, actionSuccess } from "@workspace/core/utils/server-response";
import { z } from "zod";
import type { TCreateTodoSchemaInput, TUpdateTodoSchemaInput } from "./todo.schema";
import { createTodoSchema, paginationSchema, updateTodoSchema } from "./todo.schema";

export const listTodosFn = createServerFn({ method: "GET" })
  .validator(paginationSchema)
  .handler(async ({ data }) => {
    // delay for 3 seconds
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    return TodoService.listTodos(data);
  });
export type TListTodosResponse = Awaited<ReturnType<typeof listTodosFn>>;

export const createTodoFn = createServerFn({ method: "POST" })
  .validator(createTodoSchema)
  .handler(async ({ data }) => {
    const isTitleTaken = await TodoService.isTitleTaken(data.title);

    if (isTitleTaken) {
      return actionError<TCreateTodoSchemaInput>({
        title: ["A todo with this title already exists.", "Please choose a different, unique title."],
        description: "test error you can pass arrays or single string here",
      });
    }

    const newTodo = await TodoService.createTodo(data);

    return actionSuccess(newTodo, "Todo created successfully");
  });

export const getTodoFn = createServerFn({ method: "GET" })
  .validator(z.number())
  .handler(async ({ data: id }) => {
    // delay for 3 seconds
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    return TodoService.getTodo(id);
  });

export const updateTodoFn = createServerFn({ method: "POST" })
  .validator(updateTodoSchema)
  .handler(async ({ data }) => {
    const isTitleTaken = await TodoService.isTitleTaken(data.title, data.id);

    if (isTitleTaken) {
      return actionError<TUpdateTodoSchemaInput>({
        title: ["Please choose a different, unique title.", "A todo with this title already exists."],
      });
    }

    const { id, ...updateData } = data;
    const updatedTodo = await TodoService.updateTodo(id, updateData);

    return actionSuccess(updatedTodo, "Todo updated successfully");
  });

export const updateTodoStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number(), status: z.boolean() }))
  .handler(async ({ data }) => {
    const updatedTodo = await TodoService.updateTodoStatus(data.id, data.status);
    return actionSuccess(updatedTodo, "Todo status updated successfully");
  });
