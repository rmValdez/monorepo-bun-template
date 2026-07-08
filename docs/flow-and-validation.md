# Data Flow & Validation

This application enforces a strict, type-safe data flow from the Client UI all the way to the Database.

## The Standard Flow

Every feature in the application follows this architectural pattern:

```
[ Client ] -> [ Route ] -> [ Server Function ] -> [ Service ] -> [ Database ]
```

### 1. Client (TanStack Form + Zod)
When a user submits data, it is validated **immediately** on the client side using **Zod**. This provides instant feedback without hitting the server.
*Example: `apps/web/src/routes/(app)/system/todos/index.tsx`*

### 2. Route (TanStack Router)
The Route handles the data mutation via `useMutation` (TanStack Query). It acts as the bridge between your UI form and your backend API.

### 3. Server Function (`createServerFn`)
Instead of building traditional REST APIs (`/api/todos`), TanStack Start uses Server Functions. These are functions executed securely on the server but imported like normal functions on the client.

**Crucial**: The Server Function is responsible for **Server-Side Validation**. We wrap our server functions with `data(zodSchema)` to ensure that even if a user bypasses client validation, the server rigidly validates the payload.

```typescript
// Example Server Function
export const createTodoFn = createServerFn({ method: "POST" })
  .data(createTodoSchema) // Zod validation happens here automatically!
  .handler(async ({ data }) => {
     // data is strictly typed here
     return TodoService.create(data);
  });
```

### 4. Service Layer (`Service`)
The Server Function delegates the actual business logic to a Service class/object. This keeps our Server Functions clean and allows us to reuse business logic elsewhere (e.g., in a background job or seeder).
*Example: `TodoService.create()`*

### 5. Database (Prisma)
The Service layer interacts with the PostgreSQL database securely using Prisma Client.

---

## Required Validations

To maintain application security and stability, every new feature **MUST** implement the following validations:

1. **Zod Schema Definition**: Create a `.schema.ts` file for your feature containing the Zod schemas for `Create`, `Update`, and `Query`.
2. **Double Validation**: The Zod schema must be used in the UI (`validatorAdapter={zodValidator()}`) **AND** in the server function (`.data(schema)`).
3. **Authentication Validation**: Ensure the server function validates that the user is logged in. In this boilerplate, this is handled via `authContext`.
4. **Authorization (RBAC) Validation**: If a feature is restricted, the server function must check permissions before executing the Service.

```typescript
// RBAC Validation Example inside a Server Function
const authContext = await getAuthContext();
const ability = getAbility(authContext);

if (!ability.can("create:todos")) {
  throw new Error("Unauthorized");
}
```
