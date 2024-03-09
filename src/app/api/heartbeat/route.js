export async function GET() {
  console.log("GET /api/heartbeat");
  return Response.json({ date: new Date().toISOString() });
}
