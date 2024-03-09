import { fetchViewSettings } from "@/lib/dataHelpers";

export async function GET(request) {
  console.log("GET /api/viewSettings");
  const viewSettings = await fetchViewSettings();
  return Response.json({ viewSettings });
}
