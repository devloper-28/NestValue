import React, { useEffect } from 'react';

interface AdSenseProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export function AdSense({ slot, format = 'auto', responsive = true, className = '' }: AdSenseProps) {
  useEffect(() => {
    try {
      // Check if adsbygoogle is available
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.warn('AdSense error:', error);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7330358024378491"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// AdSense component for specific placements
export function AdSenseBanner() {
  return (
    <div className="my-8 flex justify-center">
      <AdSense
        slot="1234567890"
        format="auto"
        responsive={true}
        className="w-full max-w-728"
      />
    </div>
  );
}

export function AdSenseSidebar() {
  return (
    <div className="my-4">
      <AdSense
        slot="0987654321"
        format="rectangle"
        responsive={true}
        className="w-full"
      />
    </div>
  );
}

export function AdSenseInContent() {
  return (
    <div className="my-6 flex justify-center">
      <AdSense
        slot="1122334455"
        format="auto"
        responsive={true}
        className="w-full max-w-300"
      />
    </div>
  );
}
