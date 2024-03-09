import { fetchTasks } from "@/lib/dataHelpers";

export async function GET(request) {
  console.log("GET /api/tasks");
  const tasks = await fetchTasks();
  return Response.json({ tasks });
}
