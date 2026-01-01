import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Add New Product | Admin',
  description: 'Add a new product to your catalog',
};

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a new product with variants and images
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
