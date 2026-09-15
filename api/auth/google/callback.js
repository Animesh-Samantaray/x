const backendCallbackUrl = "https://x-yokc.onrender.com/api/auth/google/callback";

export default async function handler(request, response) {
  const query = new URL(request.url, `https://${request.headers.host}`).search;
  const upstreamResponse = await fetch(`${backendCallbackUrl}${query}`, {
    redirect: "manual",
    headers: {
      cookie: request.headers.cookie || "",
    },
  });

  const location = upstreamResponse.headers.get("location");
  const setCookieHeaders = typeof upstreamResponse.headers.getSetCookie === "function"
    ? upstreamResponse.headers.getSetCookie()
    : upstreamResponse.headers.get("set-cookie")
      ? [upstreamResponse.headers.get("set-cookie")]
      : [];

  if (location) {
    response.setHeader("Location", location);
  }

  if (setCookieHeaders.length > 0) {
    response.setHeader("Set-Cookie", setCookieHeaders);
  }

  response.setHeader("Cache-Control", "no-store");
  response.status(upstreamResponse.status).end();
}
