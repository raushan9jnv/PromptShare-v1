const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts an 11-char YouTube video ID from any common URL form:
 * - https://www.youtube.com/watch?v=VIDEOID
 * - https://youtu.be/VIDEOID
 * - https://www.youtube.com/embed/VIDEOID
 * - https://www.youtube.com/shorts/VIDEOID
 * - a bare 11-char ID
 */
export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (VIDEO_ID_PATTERN.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return VIDEO_ID_PATTERN.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id && VIDEO_ID_PATTERN.test(id) ? id : null;
    }
    const embedMatch = url.pathname.match(/^\/(embed|shorts)\/([^/]+)/);
    if (embedMatch) {
      const id = embedMatch[2];
      return VIDEO_ID_PATTERN.test(id) ? id : null;
    }
  }

  return null;
}
