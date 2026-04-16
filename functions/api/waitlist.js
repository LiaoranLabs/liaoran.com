function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestGet() {
  return json({ status: "ok", method: "POST /api/waitlist with { email }" });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const email = body && body.email;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email" }, 400);
    }

    await env.DB.prepare(
      "INSERT INTO waitlist (email) VALUES (?) ON CONFLICT(email) DO NOTHING"
    )
      .bind(email.toLowerCase().trim())
      .run();

    return json({ ok: true });
  } catch (err) {
    return json({ error: err.message || "Something went wrong" }, 500);
  }
}
