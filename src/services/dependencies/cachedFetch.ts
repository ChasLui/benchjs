import { cache } from "./cache";

export const cachedFetch = async (url: RequestInfo | URL, opts?: RequestInit) => {
  const path = url.toString();
  const cached = await cache.get(path);
  if (cached) {
    return new Response(cached, { headers: { "Content-Type": "text/javascript" } });
  }
  const response = await fetch(url, opts);
  const clone = response.clone();
  const content = await clone.text();
  await cache.set(path, content);
  return response;
};
