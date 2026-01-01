'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/lib/uploadthing';
import { useSimpleDesignStore } from '@/stores/simpleDesignStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export function ImageUploader() {
  const { imageUrl, setImage } = useSimpleDesignStore();

  const handleRemoveImage = () => {
    setImage('');
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">Upload Your Design</label>
        {imageUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveImage}
            className="text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {imageUrl ? (
        <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border-2 border-primary">
          <Image
            src={imageUrl}
            alt="Uploaded design"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Upload an image to customize your t-shirt
          </p>

          <UploadButton<OurFileRouter, "designImage">
            endpoint="designImage"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                setImage(res[0].url);
                toast.success('Image uploaded successfully!');
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
              button:
                'bg-primary text-primary-foreground hover:bg-primary/90 ut-ready:bg-primary ut-uploading:cursor-not-allowed ut-uploading:bg-primary/50',
              allowedContent: 'text-xs text-muted-foreground',
            }}
          />

          <p className="text-xs text-muted-foreground mt-4">
            Max file size: 4MB
            <br />
            Recommended: PNG or JPG
          </p>
        </div>
      )}
    </div>
  );
}
