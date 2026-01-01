'use client';

import Image from 'next/image';
import { TShirtSVG } from './TShirtSVG';
import { useSimpleDesignStore, type Placement } from '@/stores/simpleDesignStore';

interface TShirtPreviewProps {
  color?: string;
}

export function TShirtPreview({ color = '#FFFFFF' }: TShirtPreviewProps) {
  const { imageUrl, placement, selectedVariant } = useSimpleDesignStore();

  // Position configuration for image placement
  // SVG viewBox is 400x500
  // Front design area: x=150 y=140 width=100 height=100 (center at 200,190)
  // Back design area: x=150 y=150 width=100 height=120 (center at 200,210)
  const getImagePosition = (placement: Placement) => {
    switch (placement) {
      case 'chest':
        return {
          top: '38%', // (140 + 50) / 500 = 38%
          left: '50%', // (150 + 50) / 400 = 50%
          transform: 'translate(-50%, -50%)',
          width: '25%', // 100 / 400 = 25%
          height: '20%', // 100 / 500 = 20%
        };
      case 'back':
        return {
          top: '42%', // (150 + 60) / 500 = 42%
          left: '50%', // (150 + 50) / 400 = 50%
          transform: 'translate(-50%, -50%)',
          width: '25%', // 100 / 400 = 25%
          height: '24%', // 120 / 500 = 24%
        };
      default:
        return {
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '25%',
          height: '20%',
        };
    }
  };

  const imagePosition = getImagePosition(placement);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* T-shirt mockup with gradient background */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden p-8 shadow-lg">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* SVG T-shirt */}
          <div className="relative w-full h-full">
            <TShirtSVG
              color={selectedVariant?.colorHex || color}
              view={placement === 'back' ? 'back' : 'front'}
              className="w-full h-full"
            />
            
            {/* User's uploaded image overlay */}
            {imageUrl && (
              <div
                className="absolute z-10 pointer-events-none"
                style={imagePosition}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt="Custom design"
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="120px"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View label badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {placement === 'back' ? 'Back' : 'Front'} View
          </span>
        </div>
      </div>

      {/* Info text */}
      <div className="mt-4 text-center">
        {imageUrl ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Design on {placement === 'chest' ? 'front' : 'back'}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Upload an image to see your design</p>
        )}
      </div>
    </div>
  );
}
