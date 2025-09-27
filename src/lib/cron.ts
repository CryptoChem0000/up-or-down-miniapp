export function allowCron(req: Request): boolean {
  const cronHeader = req.headers.get("x-vercel-cron");
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  // Vercel cron jobs include this header
  if (cronHeader === "1") {
    return true;
  }
  
  // Manual cron calls with secret
  if (authHeader === `Bearer ${cronSecret}` && cronSecret) {
    return true;
  }
  
  return false;
}

export function requireCronAuth(req: Request): Response | null {
  if (!allowCron(req)) {
    return new Response("Forbidden", { 
      status: 403,
      headers: { "Content-Type": "text/plain" }
    });
  }
  
  return null;
}
