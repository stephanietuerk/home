export function getLastPathFragmentFromURL(url: string): string {
  const parsed = url.split('/');
  return parsed[parsed.length - 1];
}
