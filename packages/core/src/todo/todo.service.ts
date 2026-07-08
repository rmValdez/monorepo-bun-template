import prisma from "@workspace/db";
import type { TPaginationSchema } from "../common/pagination.schema";
import type { TCreateTodoSchemaInput, TUpdateTodoSchemaInput } from "./todo.schema";

export const TodoService = {
  async listTodos({ pageIndex, pageSize, search, sorts, filters }: TPaginationSchema) {
    const filterWhere: Record<string, unknown> = {};
    if (filters?.length) {
      for (const filter of filters) {
        if (filter.id === "status" && filter.value.length > 0) {
          const boolValues = filter.value.map((v) => v === "true");
          if (boolValues.length === 1) {
            filterWhere.status = boolValues[0];
          }
        }
      }
    }

    const searchWhere = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const where = { ...searchWhere, ...filterWhere };

    const orderBy = sorts?.length
      ? sorts.map((s) => ({ [s.id]: s.desc ? "desc" : "asc" }))
      : { createdAt: "desc" as const };

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        orderBy,
        skip: pageIndex * pageSize,
        take: pageSize,
      }),
      prisma.todo.count({ where }),
    ]);

    return {
      todos,
      rowCount: total,
      pageIndex,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
    };
  },

  async isTitleTaken(title: string, excludeId?: number) {
    const existingTodo = await prisma.todo.findFirst({
      where: {
        title,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!existingTodo;
  },

  async createTodo(data: TCreateTodoSchemaInput) {
    const todo = await prisma.todo.create({
      data: data,
    });

    return todo;
  },

  async getTodo(id: number) {
    return prisma.todo.findUnique({
      where: { id },
    });
  },

  async updateTodo(id: number, data: Omit<TUpdateTodoSchemaInput, "id">) {
    return prisma.todo.update({
      where: { id },
      data,
    });
  },

  async updateTodoStatus(id: number, status: boolean) {
    return prisma.todo.update({
      where: { id },
      data: { status },
    });
  },
};
