import { TodoService } from "../src/todo/todo.service";

export async function seedTodos() {
  console.log("🌱 Seeding todos");

  const todosData = [
    { title: "Fix the login bug", description: "Works on my machine", status: false },
    { title: "Write documentation", description: "Future me will thank past me, probably", status: false },
    { title: "Refactor auth module", description: "3rd rewrite, this one's final final", status: false },
    { title: "Update dependencies", description: "Pray nothing breaks", status: true },
    { title: "Remove console.logs", description: "Found 47 of them, hope no one saw those", status: false },
    { title: "Code review for teammate", description: "Approved with 'LGTM' and zero actual reading", status: true },
  ];

  let count = 0;
  for (const todo of todosData) {
    await TodoService.createTodo(todo);
    count++;
  }

  console.log(`✅ Seeded ${count} todos`);
}
