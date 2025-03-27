
import React, { useEffect, useRef } from 'react';

interface WarrantyCaptchaProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
}

const WarrantyCaptcha: React.FC<WarrantyCaptchaProps> = ({ onVerify, onExpire }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.turnstile && containerRef.current) {
        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: '1x00000000000000000000AA',
          theme: 'light',
          callback: (token: string) => {
            onVerify(token);
            captchaRef.current = token;
          },
          'expired-callback': () => {
            onExpire();
          }
        });
        captchaRef.current = widgetId;
      }
    };
    
    return () => {
      script.remove();
    };
  }, [onVerify, onExpire]);

  const resetCaptcha = () => {
    if (window.turnstile && captchaRef.current) {
      window.turnstile.reset(captchaRef.current);
    }
  };

  return (
    <div className="mt-4">
      <div ref={containerRef} className="flex justify-center"></div>
    </div>
  );
};

export default WarrantyCaptcha;
export { type WarrantyCaptchaProps };
