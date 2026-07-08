# Beginner's Guide & Concepts

Welcome! If you are new to this modern stack, there are a lot of buzzwords. Don't panic! This document explains what everything does in simple terms.

## The Big Picture (What is what?)

### 1. Bun 
* **What it is**: It's like Node.js or npm, but incredibly fast.
* **Why we use it**: It runs our JavaScript, installs our packages (`bun install`), and runs our scripts (`bun run dev`). Whenever you used to type `npm`, you now type `bun`.

### 2. Turborepo
* **What it is**: A tool to manage "Monorepos" (a single codebase that holds multiple projects).
* **Why we use it**: Instead of having two separate repositories for your "Admin Dashboard" and your "Client App", we put them both in `apps/`. Turborepo lets you run them both at the exact same time with one command.

### 3. TanStack Start & React
* **What it is**: A React framework similar to Next.js.
* **Why we use it**: It allows us to build UI components with React, but it also gives us "Server Functions" so we can talk to the database securely. It also provides 100% Type-Safe routing, meaning you can't accidentally link to a page that doesn't exist.

### 4. Prisma
* **What it is**: An Object-Relational Mapper (ORM).
* **Why we use it**: Instead of writing raw SQL like `SELECT * FROM users`, we write `prisma.user.findMany()`. It gives us perfect autocomplete in VSCode and generates our database tables automatically based on `schema.prisma`.

---

## How to Build a Simple Feature (Step-by-Step)

Let's say you want to build a feature to track "Books". Here is the exact path you follow:

### Step 1: The Database
1. Open `packages/database/prisma/schema.prisma`
2. Add your model:
   ```prisma
   model Book {
     id     Int    @id @default(autoincrement())
     title  String
     author String
   }
   ```
3. Open your terminal and run: `bun --cwd packages/database prisma migrate dev --name add_books`
   *(This tells the database to create the table!)*

### Step 2: The Validation Schema
1. Create a folder `apps/web/src/server/books/`
2. Create `books.schema.ts` inside it.
3. Define what data is allowed when creating a book:
   ```typescript
   import { z } from "zod";
   export const createBookSchema = z.object({
     title: z.string().min(1, "Title is required"),
     author: z.string()
   });
   ```

### Step 3: The Server Function (The API)
1. Create `books.functions.ts`
2. Create a function that securely saves the book to the database:
   ```typescript
   import { createServerFn } from "@tanstack/start";
   import { createBookSchema } from "./books.schema";
   import prisma from "@workspace/db";

   export const createBookFn = createServerFn({ method: "POST" })
     .data(createBookSchema)
     .handler(async ({ data }) => {
       return await prisma.book.create({ data });
     });
   ```

### Step 4: The UI
1. Create a route file: `apps/web/src/routes/(app)/books/index.tsx`
2. Import your server function and call it when a button is clicked!

---

## Frequently Asked Questions

**Q: Where do I put reusable UI components like Buttons or Inputs?**
A: Put them in `packages/ui/src/components/`. This way, if you create a new app later, it can use the exact same button!

**Q: How do I handle logins?**
A: It's already done! We use `better-auth`. Check out `apps/web/src/routes/(auth)/login.tsx` to see how it works.

**Q: I changed the database, but VSCode is throwing red squiggly lines?**
A: Run `bun x turbo run db:generate` in your terminal. This updates the TypeScript types to match your new database!
