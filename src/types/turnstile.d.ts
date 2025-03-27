
// TypeScript definitions for Cloudflare Turnstile
interface Window {
  turnstile?: {
    render: (
      container: string | HTMLElement,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
        theme?: string;
        [key: string]: any;
      }
    ) => string;
    remove: (widgetId: string) => void;
    reset: (widgetId: string) => void;
  };
}
