import React, { useEffect, useRef } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  className?: string;
}

export const Turnstile = ({ siteKey, onVerify, className }: TurnstileProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const turnstileCallback = useRef<string | null>(null);

  useEffect(() => {
    // Ensure the Turnstile script is loaded only once
    const scriptId = 'cf-turnstile-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Function to render Turnstile
    const renderTurnstile = () => {
      if (!window.turnstile || !ref.current) return;

      if (turnstileCallback.current) {
        window.turnstile.remove(turnstileCallback.current);
      }

      turnstileCallback.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onVerify(token);
        },
        'expired-callback': () => {
          onVerify('');
        },
      });
    };

    // Check if turnstile is already available
    if (window.turnstile) {
      renderTurnstile();
    } else {
      // Otherwise wait for it to load
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          renderTurnstile();
          clearInterval(checkTurnstile);
        }
      }, 100);
    }

    return () => {
      if (turnstileCallback.current && window.turnstile) {
        window.turnstile.remove(turnstileCallback.current);
      }
    };
  }, [siteKey, onVerify]);

  return <div ref={ref} className={className} />;
};
