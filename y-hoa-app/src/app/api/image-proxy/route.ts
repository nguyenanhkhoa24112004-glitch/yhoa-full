import type { NextRequest } from "next/server";

const ALLOWED_HOSTS = new Set([
  "images.unsplash.com",
  "upload.wikimedia.org",
  "commons.wikimedia.org",
  "vi.wikipedia.org",
  "en.wikipedia.org",
  "cdn.pixabay.com",
  "tracuuduoclieu.vn",
  "bvyhctbaoloc.vn",
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("url");
  const url = raw ? decodeURIComponent(raw) : null;

  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  let upstream: URL;
  try {
    upstream = new URL(url);
  } catch (e) {
    return new Response("Invalid url", { status: 400 });
  }

  if (!(upstream.protocol === "http:" || upstream.protocol === "https:")) {
    return new Response("Unsupported protocol", { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(upstream.hostname)) {
    return new Response("Forbidden host", { status: 403 });
  }

  try {
    const res = await fetch(upstream.toString(), {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        Accept: "*/*",
        Referer: "https://www.google.com/",
      },
    });

    if (!res.ok) {
      return new Response(`Upstream error: ${res.status}`, { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const body = await res.arrayBuffer();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch (e: any) {
    return new Response(`Proxy error: ${e?.message || "unknown"}`, { status: 500 });
  }
}