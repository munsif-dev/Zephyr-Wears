import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zephyr.com' },
    update: {},
    create: {
      email: 'admin@zephyr.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user created:', admin.email);

  // Create Regular User
  console.log('Creating regular user...');
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('✓ Regular user created:', user.email);

  // Create Products
  console.log('Creating products...');

  const products = [
    {
      name: 'Classic White Tee',
      slug: 'classic-white-tee',
      description: 'A timeless white t-shirt made from 100% premium cotton. Perfect for any occasion.',
      basePrice: 2500,
      category: 'mens',
      featured: true,
      status: 'ACTIVE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    },
    {
      name: 'Black Essential Tee',
      slug: 'black-essential-tee',
      description: 'Essential black t-shirt with a comfortable fit. A wardrobe staple.',
      basePrice: 2500,
      category: 'mens',
      featured: true,
      status: 'ACTIVE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    },
    {
      name: 'Navy Blue Crew Neck',
      slug: 'navy-blue-crew-neck',
      description: 'Soft navy blue t-shirt with a classic crew neck design.',
      basePrice: 3000,
      category: 'mens',
      featured: false,
      status: 'ACTIVE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1622445272461-c6580cab8755?w=800',
    },
    {
      name: "Women's Cotton Tee",
      slug: 'womens-cotton-tee',
      description: 'Comfortable and stylish cotton tee designed for women.',
      basePrice: 2500,
      category: 'womens',
      featured: true,
      status: 'ACTIVE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1627225793904-7500c7e7d88e?w=800',
    },
    {
      name: 'Vintage Wash Tee',
      slug: 'vintage-wash-tee',
      description: 'Unique vintage-washed tee with a soft, worn-in feel.',
      basePrice: 3000,
      category: 'unisex',
      featured: true,
      status: 'ACTIVE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
    },
    {
      name: 'Graphic Print Tee',
      slug: 'graphic-print-tee',
      description: 'Bold graphic print on premium quality cotton.',
      basePrice: 3500,
      category: 'mens',
      featured: false,
      status: 'ACTIVE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
    },
    {
      name: 'Custom Design Tee',
      slug: 'custom-design-tee',
      description: 'Upload your own design and create a unique custom t-shirt.',
      basePrice: 2000,
      category: 'custom',
      featured: true,
      status: 'ACTIVE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
    },
    {
      name: 'Striped Pattern Tee',
      slug: 'striped-pattern-tee',
      description: 'Classic striped pattern tee in multiple color combinations.',
      basePrice: 2500,
      category: 'unisex',
      featured: false,
      status: 'ACTIVE' as const,
      imageUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800',
    },
  ];

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Gray', hex: '#808080' },
  ];

  for (const productData of products) {
    const { imageUrl, ...productInfo } = productData;

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        ...productInfo,
      },
      create: {
        ...productInfo,
        images: {
          create: [
            {
              url: imageUrl,
              altText: productData.name,
              order: 0,
            },
          ],
        },
        variants: {
          create: sizes.flatMap((size) =>
            colors.map((color) => ({
              size,
              color: color.name,
              colorHex: color.hex,
              priceAdjustment: size === 'XL' ? 2.0 : 0,
              stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
            }))
          ),
        },
      },
    });

    console.log(`✓ Created/Updated product: ${product.name}`);
  }

  // Create some sample reviews
  console.log('Creating sample reviews...');
  const allProducts = await prisma.product.findMany({ take: 3 });

  for (const product of allProducts) {
    // Check if review already exists to avoid duplicates
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: product.id,
        userId: user.id,
      },
    });

    if (!existingReview) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: user.id,
          rating: 5,
          comment: 'Excellent quality! Very comfortable and fits perfectly.',
        },
      });
    }
  }
  console.log('✓ Sample reviews created/verified');

  console.log('✨ Database seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@zephyr.com / admin123');
  console.log('User: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
