const backendUrl = "https://x-yokc.onrender.com/api/auth/verify-2fa";

const readBody = async (request) => {
  if (request.body) {
    return typeof request.body === "string" ? request.body : JSON.stringify(request.body);
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ success: false, message: "Method not allowed" });
  }

  const upstreamResponse = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "content-type": request.headers["content-type"] || "application/json",
      cookie: request.headers.cookie || "",
    },
    body: await readBody(request),
    redirect: "manual",
  });

  const setCookieHeaders = typeof upstreamResponse.headers.getSetCookie === "function"
    ? upstreamResponse.headers.getSetCookie()
    : upstreamResponse.headers.get("set-cookie")
      ? [upstreamResponse.headers.get("set-cookie")]
      : [];
  const contentType = upstreamResponse.headers.get("content-type");

  if (setCookieHeaders.length > 0) {
    response.setHeader("Set-Cookie", setCookieHeaders);
  }
  if (contentType) {
    response.setHeader("Content-Type", contentType);
  }

  response.setHeader("Cache-Control", "no-store");
  return response.status(upstreamResponse.status).send(await upstreamResponse.text());
}
