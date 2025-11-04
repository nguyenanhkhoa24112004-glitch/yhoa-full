import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidUrl(u: string) {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url") || "";
  if (!target || !isValidUrl(target)) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  try {
    const u = new URL(target);
    const res = await fetch(target, {
      headers: {
        // Giả lập trình duyệt để tránh chặn hotlink
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Referer: `${u.protocol}//${u.host}/`,
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Upstream fetch failed" }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    const response = new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
    return response;
  } catch (e) {
    console.error("[proxy-image]", e);
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}