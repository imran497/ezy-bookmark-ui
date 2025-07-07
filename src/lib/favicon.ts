export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '/favicon.ico';
  }
}

export function getFaviconUrls(url: string): string[] {
  try {
    const domain = new URL(url).hostname;
    const urlObj = new URL(url);
    
    return [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `${urlObj.protocol}//${urlObj.hostname}/apple-touch-icon.png`,
      `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`,
      '/favicon.ico'
    ];
  } catch {
    return ['/favicon.ico'];
  }
}

export function getHighResFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '/favicon.ico';
  }
}

export function getDuckDuckGoFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  } catch {
    return '/favicon.ico';
  }
}

export function getFallbackFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return '/favicon.ico';
  }
}