import { fetchTasks } from "@/lib/dataHelpers";

export async function GET(request) {
  // const { searchParams } = new URL(request.url)
  // const id = searchParams.get('id')
  // const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': process.env.DATA_API_KEY!,
  //   },
  // })
  // const product = await res.json()

  // return Response.json({ product })

  console.log("GET /api/tasks");
  const tasks = await fetchTasks();
  return Response.json({ tasks });
}
