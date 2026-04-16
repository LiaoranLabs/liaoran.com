export async function onRequestGet() {
  return Response.json({ status: "ok", method: "POST /api/waitlist with { email }" });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    await env.DB.prepare(
      "INSERT INTO waitlist (email) VALUES (?) ON CONFLICT(email) DO NOTHING"
    )
      .bind(email.toLowerCase().trim())
      .run();

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
