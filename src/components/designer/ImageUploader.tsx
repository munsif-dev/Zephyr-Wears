'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/lib/uploadthing';
import { useSimpleDesignStore } from '@/stores/simpleDesignStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export function ImageUploader() {
  const { imageUrl, setImage } = useSimpleDesignStore();

  const handleRemoveImage = () => {
    setImage('');
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="space-y-3">
          {/* Success indicator */}
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Image uploaded successfully</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>

          {/* Image preview */}
          <div className="relative aspect-square w-full max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-primary shadow-lg">
            <Image
              src={imageUrl}
              alt="Uploaded design"
              fill
              className="object-contain bg-muted/30"
            />
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
            <div className="flex flex-col items-center gap-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h4 className="font-semibold text-base">Upload Your Design</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Drag and drop or click to browse your files
                </p>
              </div>

              {/* Upload Button */}
              <div className="mt-2">
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
                      'bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg ut-ready:bg-primary ut-uploading:cursor-not-allowed ut-uploading:bg-primary/50',
                    allowedContent: 'hidden',
                    container: 'flex flex-col items-center gap-2',
                  }}
                />
              </div>

              {/* File requirements */}
              <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary"></span>
                  Max 4MB
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary"></span>
                  PNG or JPG
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary"></span>
                  300 DPI recommended
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
