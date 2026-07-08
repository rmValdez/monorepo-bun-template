// Re-export from core. Keeps app imports consistent (@/server/...) and provides
// a single place to add app-specific schemas alongside shared ones.
export {
  paginationSchema,
  type TPaginationSchema,
  type TPaginationSchemaInput,
} from "@workspace/core/common/pagination.schema";
export {
  createTodoSchema,
  type TCreateTodoSchemaInput,
  type TUpdateTodoSchemaInput,
  updateTodoSchema,
} from "@workspace/core/todo/todo.schema";
