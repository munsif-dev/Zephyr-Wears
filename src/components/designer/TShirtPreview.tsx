'use client';

import Image from 'next/image';
import { TShirtSVG } from './TShirtSVG';
import { useSimpleDesignStore, type Placement } from '@/stores/simpleDesignStore';

interface TShirtPreviewProps {
  color?: string;
}

export function TShirtPreview({ color = '#FFFFFF' }: TShirtPreviewProps) {
  const { imageUrl, placement, selectedVariant } = useSimpleDesignStore();

  const tshirtColor = selectedVariant?.colorHex || color;

  // Position configuration for image placement
  const getImagePosition = (placement: Placement) => {
    switch (placement) {
      case 'chest':
        return {
          top: '140px',
          left: '150px',
          width: '100px',
          height: '100px',
        };
      case 'back':
        return {
          top: '150px',
          left: '150px',
          width: '100px',
          height: '120px',
        };
      default:
        return {
          top: '140px',
          left: '150px',
          width: '100px',
          height: '100px',
        };
    }
  };

  const imagePosition = getImagePosition(placement);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* T-shirt SVG */}
      <div className="relative w-full aspect-[4/5]">
        <TShirtSVG
          color={tshirtColor}
          view={placement === 'chest' ? 'front' : 'back'}
          className="w-full h-full"
        />

        {/* User's uploaded image overlay */}
        {imageUrl && (
          <div
            className="absolute"
            style={{
              ...imagePosition,
              zIndex: 10,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt="Custom design"
                fill
                className="object-contain"
                sizes="100px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info text */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {imageUrl ? (
          <p>
            Your design on the <span className="font-medium">{placement}</span>
          </p>
        ) : (
          <p>Upload an image to see your design</p>
        )}
      </div>
    </div>
  );
}
