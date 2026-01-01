import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from './auth';

const f = createUploadthing();

export const ourFileRouter = {
  // Design image uploader
  designImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error('Unauthorized');
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);
      return { url: file.url };
    }),

  // Product images uploader (admin only)
  productImages: f({ image: { maxFileSize: '8MB', maxFileCount: 5 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
