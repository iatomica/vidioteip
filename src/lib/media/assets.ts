import { staticFile } from "remotion";

/**
 * Resolves an asset path to a valid Remotion URL.
 * If the path starts with http/https or data:, it is returned as is.
 * Otherwise, it resolves via staticFile() looking in /public/assets/... or /public/...
 */
export function resolveAsset(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://") ||
    pathOrUrl.startsWith("data:")
  ) {
    return pathOrUrl;
  }

  // Clean leading slashes
  let cleanPath = pathOrUrl.replace(/^\/+/, "");

  // If path doesn't already start with assets/, prefix assets/
  if (!cleanPath.startsWith("assets/")) {
    cleanPath = `assets/${cleanPath}`;
  }

  try {
    return staticFile(cleanPath);
  } catch {
    return `/${cleanPath}`;
  }
}

/**
 * Generates an SVG data URL placeholder for testing when no image is provided.
 */
export function generateSvgPlaceholder(
  text: string,
  width: number = 1080,
  height: number = 720,
  bg: string = "#1E293B",
  fg: string = "#38BDF8"
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${bg}"/>
    <circle cx="${width / 2}" cy="${height / 2}" r="120" fill="${fg}" opacity="0.1"/>
    <text x="50%" y="48%" font-family="sans-serif" font-size="38" font-weight="bold" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    <text x="50%" y="56%" font-family="sans-serif" font-size="20" fill="#94A3B8" text-anchor="middle" dominant-baseline="middle">VIDIOTEIP NEWS ASSET</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
