export default {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      return await handleRequest(request, env, ctx);
    } catch (error) {
      console.error(error);
      return new Response("Internal server error", { status: 500 });
    }
  },
} satisfies ExportedHandler<CloudflareBindings>;

async function handleRequest(
  request: Request,
  env: CloudflareBindings,
  ctx: ExecutionContext
): Promise<Response> {
  let response = await env.ASTRO.fetch(request.clone());
  response = cacheStaticAssets(request, response);
  return response;
}

function cacheStaticAssets(request: Request, response: Response): Response {
  const cacheableExtensions = new Set([
    "7z",
    "avi",
    "avif",
    "apk",
    "bin",
    "bmp",
    "bz2",
    "class",
    "css",
    "csv",
    "doc",
    "docx",
    "dmg",
    "ejs",
    "eot",
    "eps",
    "exe",
    "flac",
    "gif",
    "gz",
    "ico",
    "iso",
    "jar",
    "jpg",
    "jpeg",
    "js",
    "mid",
    "midi",
    "mkv",
    "mp3",
    "mp4",
    "ogg",
    "otf",
    "pdf",
    "pict",
    "pls",
    "png",
    "ppt",
    "pptx",
    "ps",
    "rar",
    "svg",
    "svgz",
    "swf",
    "tar",
    "tif",
    "tiff",
    "ttf",
    "webm",
    "webp",
    "woff",
    "woff2",
    "xls",
    "xlsx",
    "zip",
    "zst",
  ]);

  const url = new URL(request.url);
  const extension = url.pathname.split(".").pop()?.toLowerCase();

  const cacheResponse = new Response(response.body, response);

  if (extension && cacheableExtensions.has(extension)) {
    cacheResponse.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  return cacheResponse;
}
