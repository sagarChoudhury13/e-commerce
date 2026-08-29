import { prismaClient } from '../src/index.ts';

const mockProducts = [
  {
    name: "Country Bean Hazelnut Instant Coffee",
    description: "Premium 60% Arabica instant coffee with a rich hazelnut finish. No added sugar.",
    tags: "coffee, beverages, instant, arabica",
    price: 350,
    image_url: "https://placehold.co/600x600/png?text=Hazelnut+Coffee"
  },
  {
    name: "KALINI Floral Embroidered A-Line Kurta",
    description: "Traditional ethnic wear featuring intricate floral embroidery and a comfortable A-line fit.",
    tags: "ethnic, kurta, apparel, floral, traditional",
    price: 1299,
    image_url: "https://placehold.co/600x600/png?text=A-Line+Kurta"
  },
  {
    name: "Lenovo IdeaPad 1 AMD Ryzen 5",
    description: "Thin and light everyday computing laptop equipped with AMD Ryzen 5 processor and 512GB SSD.",
    tags: "laptop, electronics, computing, ryzen",
    price: 42000,
    image_url: "https://placehold.co/600x600/png?text=Lenovo+IdeaPad"
  },
  {
    name: "HIGHLANDER Men's Full-Sleeve Western Shirt",
    description: "Casual button-down western shirt made from breathable cotton for all-day comfort.",
    tags: "shirt, apparel, menswear, casual",
    price: 899,
    image_url: "https://placehold.co/600x600/png?text=Western+Shirt"
  },
  {
    name: "Cockatoo SmartRun Motorized Treadmill",
    description: "Space-saving home fitness treadmill with digital display, preset programs, and heart rate sensors.",
    tags: "fitness, home gym, treadmill, cardio",
    price: 18500,
    image_url: "https://placehold.co/600x600/png?text=SmartRun+Treadmill"
  },
  {
    name: "St. Botanica Pro-Keratin Haircare Set",
    description: "Restorative shampoo and conditioner duo infused with keratin and argan oil for smooth, frizz-free hair.",
    tags: "haircare, beauty, keratin, shampoo",
    price: 899,
    image_url: "https://placehold.co/600x600/png?text=Pro-Keratin+Set"
  },
  {
    name: "Amazon Basics Adjustable Laptop Stand",
    description: "Ergonomic ventilated aluminum stand with multiple height adjustments for home office setups.",
    tags: "accessories, office, laptop stand, ergonomic",
    price: 650,
    image_url: "https://placehold.co/600x600/png?text=Laptop+Stand"
  },
  {
    name: "Beyoung Loose-Fit Cotton Pyjamas",
    description: "Ultra-soft loungewear pyjamas featuring an elastic waistband and relaxed fit.",
    tags: "loungewear, pyjamas, apparel, cotton",
    price: 599,
    image_url: "https://placehold.co/600x600/png?text=Cotton+Pyjamas"
  },
  {
    name: "FOVERA Memory Foam Car Seat Cushion",
    description: "Orthopedic memory foam cushion designed to relieve back pain during long daily commutes.",
    tags: "automotive, accessories, seat cushion, comfort",
    price: 1100,
    image_url: "https://placehold.co/600x600/png?text=Car+Seat+Cushion"
  },
  {
    name: "Organic Harvest Skincare Trio",
    description: "100% organic face wash, toner, and moisturizer formulated for daily skin hydration.",
    tags: "skincare, beauty, organic, face wash",
    price: 1450,
    image_url: "https://placehold.co/600x600/png?text=Skincare+Trio"
  },
  {
    name: "Wipro Garnet 15W LED Ceiling Light",
    description: "Energy-efficient surface-mounted LED light offering bright, glare-free illumination.",
    tags: "home, lighting, led, ceiling",
    price: 450,
    image_url: "https://placehold.co/600x600/png?text=LED+Ceiling+Light"
  },
  {
    name: "Sirona Handmade Bath Soap Bar",
    description: "Natural handmade bathing bar crafted with essential oils for a refreshing shower experience.",
    tags: "bath, beauty, soap, handmade",
    price: 250,
    image_url: "https://placehold.co/600x600/png?text=Handmade+Soap"
  }
];

async function main() {
  console.log("Starting database seed...");
  
  // Wipe existing products to prevent duplicates during testing
  await prismaClient.products.deleteMany();
  
  // Insert all 12 mock products in a single database transaction
  const result = await prismaClient.products.createMany({
    data: mockProducts,
  });
  
  console.log(`Successfully seeded ${result.count} products!`);
}
main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });