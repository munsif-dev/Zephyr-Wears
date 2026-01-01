# TShirt Designer - Custom T-Shirt E-Commerce Platform

A full-stack e-commerce platform for designing and buying custom t-shirts, built with Next.js 14, TypeScript, PostgreSQL, and Prisma.

## Features

- **Custom T-Shirt Design Studio**: Design custom t-shirts with text, images, and basic shapes
- **Product Catalog**: Browse and filter t-shirts by category, price, size, and color
- **Shopping Cart**: Add products to cart with variants (size, color)
- **User Authentication**: Email/password authentication with NextAuth.js
- **Order Management**: Track orders from placement to delivery
- **Admin Panel**: Manage products, orders, and inventory
- **Reviews & Ratings**: Customer reviews and ratings system
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** - UI component library
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth.js** - Authentication
- **Uploadthing** - File uploads
- **Stripe** - Payment processing (placeholder)

## Project Structure

```
/zephyr
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── products/     # Product APIs
│   │   │   ├── cart/         # Cart APIs
│   │   │   ├── orders/       # Order APIs
│   │   │   ├── designs/      # Design APIs
│   │   │   └── uploadthing/  # File upload endpoints
│   │   ├── (shop)/           # Shop route group
│   │   ├── (auth)/           # Auth route group
│   │   ├── (designer)/       # Design studio route group
│   │   ├── (dashboard)/      # User dashboard route group
│   │   ├── (admin)/          # Admin panel route group
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Header, Footer, Navbar
│   │   ├── products/         # Product components
│   │   ├── cart/             # Cart components
│   │   ├── designer/         # Design studio components
│   │   ├── checkout/         # Checkout components
│   │   ├── dashboard/        # User dashboard components
│   │   └── admin/            # Admin components
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── stripe.ts         # Stripe client
│   │   ├── uploadthing.ts    # Uploadthing configuration
│   │   ├── constants.ts      # App constants
│   │   ├── utils.ts          # Utility functions
│   │   └── validations.ts    # Zod schemas
│   ├── stores/
│   │   ├── cartStore.ts      # Cart state management
│   │   └── designerStore.ts  # Designer state management
│   ├── actions/              # Server actions
│   ├── types/                # TypeScript types
│   ├── hooks/                # Custom React hooks
│   └── middleware.ts         # Auth middleware
├── .env                       # Environment variables
├── .env.example              # Environment variables template
└── package.json
```

## Database Schema

The database includes the following models:

- **User**: User accounts with roles (CUSTOMER/ADMIN)
- **Product**: T-shirt products with customization options
- **ProductVariant**: Size and color variants with inventory
- **Category**: Product categories
- **Tag**: Product tags
- **Design**: Custom user designs
- **DesignLayer**: Individual layers in a design (text, image, shape)
- **CartItem**: Shopping cart items
- **Order**: Customer orders
- **OrderItem**: Individual items in an order
- **Review**: Product reviews and ratings
- **Address**: Shipping addresses

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   The `.env` file is already created. Update these values:

   ```env
   # Database - Update with your PostgreSQL credentials
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tshirt_ecommerce?schema=public"

   # NextAuth.js - Generate a secret key
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"

   # Uploadthing - Sign up at https://uploadthing.com
   UPLOADTHING_TOKEN="your-uploadthing-token"

   # Stripe - Get from https://stripe.com
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

3. **Generate NextAuth secret**:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and update `NEXTAUTH_SECRET` in `.env`

4. **Set up PostgreSQL database**:
   - Create a PostgreSQL database:
     ```sql
     CREATE DATABASE tshirt_ecommerce;
     ```
   - Update the `DATABASE_URL` in `.env` with your credentials

5. **Run Prisma migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Generate Prisma Client** (already done):
   ```bash
   npx prisma generate
   ```

7. **Seed the database** (optional - see seed section below)

8. **Run the development server**:
   ```bash
   npm run dev
   ```

9. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## What's Built ✅

### Infrastructure
- ✅ Next.js 14 project with TypeScript configured
- ✅ PostgreSQL database with comprehensive Prisma schema
- ✅ NextAuth.js authentication setup (email/password)
- ✅ Middleware for route protection
- ✅ shadcn/ui components installed
- ✅ Zustand stores for cart and designer state
- ✅ API routes structure

### Core Files
- ✅ Database schema (`prisma/schema.prisma`) - Complete with all models
- ✅ Prisma client (`src/lib/prisma.ts`)
- ✅ NextAuth config (`src/lib/auth.ts`)
- ✅ Stripe client (`src/lib/stripe.ts`)
- ✅ Uploadthing config (`src/lib/uploadthing.ts`)
- ✅ Type definitions (`src/types/`)
- ✅ Validation schemas (`src/lib/validations.ts`)
- ✅ Constants (`src/lib/constants.ts`)
- ✅ Cart store (`src/stores/cartStore.ts`)
- ✅ Designer store (`src/stores/designerStore.ts`)
- ✅ Auth middleware (`src/middleware.ts`)
- ✅ NextAuth API route (`src/app/api/auth/[...nextauth]/route.ts`)
- ✅ Uploadthing API route (`src/app/api/uploadthing/route.ts`)
- ✅ Products API route (`src/app/api/products/route.ts`)

## What Needs to Be Built 🚧

### High Priority

**1. Pages & Layouts**
- [ ] Shop layout with header/footer (`src/app/(shop)/layout.tsx`)
- [ ] Homepage (`src/app/(shop)/page.tsx`)
- [ ] Product listing page (`src/app/(shop)/products/page.tsx`)
- [ ] Product detail page (`src/app/(shop)/products/[slug]/page.tsx`)
- [ ] Cart page (`src/app/(shop)/cart/page.tsx`)
- [ ] Checkout page (`src/app/(shop)/checkout/page.tsx`)
- [ ] Login page (`src/app/(auth)/login/page.tsx`)
- [ ] Register page (`src/app/(auth)/register/page.tsx`)

**2. Essential Components**
- [ ] Header with navigation and cart icon (`src/components/layout/Header.tsx`)
- [ ] Footer (`src/components/layout/Footer.tsx`)
- [ ] Product card (`src/components/products/ProductCard.tsx`)
- [ ] Product grid (`src/components/products/ProductGrid.tsx`)
- [ ] Variant selector (size/color) (`src/components/products/VariantSelector.tsx`)
- [ ] Cart item (`src/components/cart/CartItem.tsx`)
- [ ] Cart summary (`src/components/cart/CartSummary.tsx`)

**3. API Routes**
- [ ] Cart APIs (`src/app/api/cart/route.ts`)
- [ ] Orders APIs (`src/app/api/orders/route.ts`)
- [ ] Checkout API (`src/app/api/checkout/route.ts`)

### Medium Priority

**4. Design Studio**
- [ ] Design canvas page (`src/app/(designer)/design/page.tsx`)
- [ ] Canvas component with HTML5 Canvas API (`src/components/designer/DesignCanvas.tsx`)
- [ ] Tool panel (text, image, select) (`src/components/designer/ToolPanel.tsx`)
- [ ] Layer panel (`src/components/designer/LayerPanel.tsx`)
- [ ] Text editor (`src/components/designer/TextEditor.tsx`)
- [ ] Image uploader (`src/components/designer/ImageUploader.tsx`)
- [ ] Design APIs (`src/app/api/designs/route.ts`)

**5. User Dashboard**
- [ ] Dashboard layout (`src/app/(dashboard)/layout.tsx`)
- [ ] Dashboard home (`src/app/(dashboard)/dashboard/page.tsx`)
- [ ] Order history (`src/app/(dashboard)/dashboard/orders/page.tsx`)
- [ ] Saved designs (`src/app/(dashboard)/dashboard/designs/page.tsx`)

### Low Priority

**6. Admin Panel**
- [ ] Admin layout (`src/app/(admin)/layout.tsx`)
- [ ] Product management (`src/app/(admin)/admin/products/page.tsx`)
- [ ] Order management (`src/app/(admin)/admin/orders/page.tsx`)
- [ ] User management (`src/app/(admin)/admin/users/page.tsx`)

**7. Reviews System**
- [ ] Review components (`src/components/products/ReviewList.tsx`)
- [ ] Review form (`src/components/products/ReviewForm.tsx`)
- [ ] Review APIs (`src/app/api/products/[id]/reviews/route.ts`)

## Database Seeding

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create category
  const category = await prisma.category.upsert({
    where: { slug: 'mens-tshirts' },
    update: {},
    create: {
      name: "Men's T-Shirts",
      slug: 'mens-tshirts',
      description: 'T-shirts for men',
    },
  });

  // Create products
  const product = await prisma.product.upsert({
    where: { slug: 'classic-cotton-tee' },
    update: {},
    create: {
      name: 'Classic Cotton Tee',
      slug: 'classic-cotton-tee',
      description: 'Comfortable cotton t-shirt perfect for custom designs',
      basePrice: 19.99,
      categoryId: category.id,
      isCustomizable: true,
      material: '100% Cotton',
      fit: 'regular',
      status: 'ACTIVE',
      featured: true,
      images: {
        create: [{
          url: 'https://via.placeholder.com/600x600/000000/FFFFFF?text=Black+Tee',
          alt: 'Classic Cotton Tee',
          order: 0,
        }],
      },
      variants: {
        create: [
          { sku: 'CCT-S-BLK', size: 'S', color: 'Black', colorHex: '#000000', stock: 50, images: ['https://via.placeholder.com/600x600/000000/FFFFFF?text=Black+S'] },
          { sku: 'CCT-M-BLK', size: 'M', color: 'Black', colorHex: '#000000', stock: 100, images: ['https://via.placeholder.com/600x600/000000/FFFFFF?text=Black+M'] },
          { sku: 'CCT-L-BLK', size: 'L', color: 'Black', colorHex: '#000000', stock: 75, images: ['https://via.placeholder.com/600x600/000000/FFFFFF?text=Black+L'] },
          { sku: 'CCT-S-WHT', size: 'S', color: 'White', colorHex: '#FFFFFF', stock: 50, images: ['https://via.placeholder.com/600x600/FFFFFF/000000?text=White+S'] },
          { sku: 'CCT-M-WHT', size: 'M', color: 'White', colorHex: '#FFFFFF', stock: 100, images: ['https://via.placeholder.com/600x600/FFFFFF/000000?text=White+M'] },
          { sku: 'CCT-L-WHT', size: 'L', color: 'White', colorHex: '#FFFFFF', stock: 75, images: ['https://via.placeholder.com/600x600/FFFFFF/000000?text=White+L'] },
        ],
      },
    },
  });

  console.log('Created product:', product.name);
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Install tsx: `npm install -D tsx`

Run seed: `npx prisma db seed`

## Design Studio Implementation Guide

For the basic design studio using HTML5 Canvas API:

```typescript
// src/components/designer/DesignCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useDesignerStore } from '@/stores/designerStore';

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layers = useDesignerStore((state) => state.layers);
  const selectedLayerId = useDesignerStore((state) => state.selectedLayerId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw t-shirt background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw layers
    layers
      .sort((a, b) => a.order - b.order)
      .forEach((layer) => {
        if (!layer.visible) return;

        ctx.save();
        ctx.globalAlpha = layer.opacity;
        ctx.translate(layer.x, layer.y);
        ctx.rotate((layer.rotation * Math.PI) / 180);

        if (layer.type === 'TEXT' && layer.data.text) {
          ctx.font = `${layer.data.fontSize || 24}px ${layer.data.fontFamily || 'Arial'}`;
          ctx.fillStyle = layer.data.color || '#000000';
          ctx.fillText(layer.data.text, 0, 0);
        } else if (layer.type === 'IMAGE' && layer.data.url) {
          const img = new Image();
          img.src = layer.data.url;
          img.onload = () => {
            ctx.drawImage(img, 0, 0, layer.width || 100, layer.height || 100);
          };
        }

        // Draw selection border if selected
        if (layer.id === selectedLayerId) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.strokeRect(0, 0, layer.width || 100, layer.height || 100);
        }

        ctx.restore();
      });
  }, [layers, selectedLayerId]);

  return (
    <div className="flex justify-center items-center p-8 bg-gray-100">
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="border-2 border-gray-300 bg-white shadow-lg"
      />
    </div>
  );
}
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Open Prisma Studio (GUI)
npx prisma migrate dev   # Create new migration
npx prisma generate      # Regenerate Prisma Client
npx prisma db push       # Push schema changes (dev only)
npx prisma db seed       # Seed database

# Code Quality
npm run lint             # Run ESLint
```

## External Services Setup

### Uploadthing
1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy your API token
4. Update `UPLOADTHING_TOKEN` in `.env`

### Stripe
1. Sign up at [stripe.com](https://stripe.com)
2. Get your test API keys from Dashboard
3. Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` in `.env`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Database Hosting
- **Vercel Postgres**: Built-in integration
- **Railway**: [railway.app](https://railway.app)
- **Neon**: [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)

## Next Steps

1. **Set up database**: Create PostgreSQL database and run migrations
2. **Configure environment variables**: Update `.env` with your credentials
3. **Seed database**: Add sample products for testing
4. **Build pages**: Start with shop layout and product listing
5. **Build components**: Create reusable UI components
6. **Implement design studio**: Basic canvas with text and image layers
7. **Add authentication**: Complete login/register pages
8. **Build checkout**: Integrate Stripe for payments

## License

MIT License - Use freely for learning or commercial purposes

---

Built with ❤️ using Next.js 14, TypeScript, PostgreSQL, and Prisma
