import { prismaClient } from '../src/index.ts';

const mockProducts = [
  {
    "name": "Wireless Noise Cancelling Headphones",
    "description": "Over-ear bluetooth headphones with active noise cancellation and 30-hour battery life.",
    "price": 8999,
    "tags": "electronics, audio, wearable, headphones, over-ear, wireless, bluetooth, noise-cancelling, travel, black",
    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Ceramic Non-Stick Cookware Set",
    "description": "10-piece induction compatible cooking set featuring a toxic-free ceramic non-stick coating.",
    "price": 4500,
    "tags": "home, kitchen, cooking, cookware, pots, pans, ceramic, non-stick, induction, blue",
    "image_url": "https://images.unsplash.com/photo-1584990347449-a6fb73658bf6?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Men's Slim Fit Chinos",
    "description": "Versatile slim-fit cotton trousers designed for both office wear and casual weekends.",
    "price": 1499,
    "tags": "apparel, menswear, clothing, bottoms, pants, trousers, chinos, slim-fit, cotton, khaki",
    "image_url": "https://images.unsplash.com/photo-1473966968600-fa801b1c7cdda?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Organic Ceremonial Matcha Powder",
    "description": "Pure stone-ground green tea powder sourced from Uji, Japan, perfect for traditional brewing.",
    "price": 1850,
    "tags": "groceries, food, beverage, tea, green-tea, powder, organic, matcha, ceremonial-grade, healthy",
    "image_url": "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Insulated Stainless Steel Flask",
    "description": "Double-walled vacuum water bottle that keeps beverages cold for 24 hours or hot for 12.",
    "price": 950,
    "tags": "accessories, outdoor, drinkware, bottle, reusable, flask, stainless-steel, insulated, thermos, 1-liter",
    "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Smart Fitness Tracker Watch",
    "description": "Waterproof digital wearable with continuous heart rate monitoring and sleep tracking.",
    "price": 2499,
    "tags": "electronics, wearable, smartwatch, fitness, tracker, pedometer, heart-rate, waterproof, silicone, black",
    "image_url": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Women's Floral Summer Maxi Dress",
    "description": "Flowy and breathable sleeveless dress featuring a vibrant botanical print for warm days.",
    "price": 1799,
    "tags": "apparel, womenswear, clothing, dresses, maxi-dress, summer, floral, sleeveless, cotton, casual",
    "image_url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Premium Extra Virgin Olive Oil",
    "description": "Cold-pressed authentic Italian olive oil with a rich, peppery finish for salads and dips.",
    "price": 850,
    "tags": "groceries, pantry, cooking, oil, olive-oil, extra-virgin, cold-pressed, organic, glass-bottle, italian",
    "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Alignment Line Yoga Mat",
    "description": "Eco-friendly, non-slip exercise mat printed with alignment markers for perfect posture.",
    "price": 1150,
    "tags": "sports, fitness, equipment, yoga, pilates, mat, exercise, non-slip, eco-friendly, purple",
    "image_url": "https://images.unsplash.com/photo-1592432678016-e910b06b3848?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Wireless Mechanical Gaming Keyboard",
    "description": "Tactile switch keyboard with customizable RGB backlighting and ultra-low latency connection.",
    "price": 5499,
    "tags": "electronics, computer, peripherals, keyboard, mechanical, gaming, wireless, rgb, tactile, switches",
    "image_url": "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Handmade Rustic Ceramic Mug",
    "description": "Artisan-crafted stoneware coffee cup featuring a unique speckled glaze.",
    "price": 450,
    "tags": "home, kitchen, dining, drinkware, cup, mug, ceramic, handmade, artisan, rustic",
    "image_url": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Organic Aloe Vera Soothing Gel",
    "description": "Pure cooling plant extract gel for deeply moisturizing dry skin and relieving sunburn.",
    "price": 350,
    "tags": "beauty, skincare, personal-care, body, moisturizer, gel, aloe-vera, soothing, sunburn, organic",
    "image_url": "https://images.unsplash.com/photo-1596755389378-c11dde1606b5?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "A5 Hardcover Dotted Journal",
    "description": "Premium thick-paper notebook ideal for bullet journaling, sketching, and daily planning.",
    "price": 600,
    "tags": "stationery, office, supplies, paper, notebook, journal, dotted, hardcover, planner, a5",
    "image_url": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Dark Roast Espresso Beans",
    "description": "Intense and bold whole coffee beans specially roasted for rich crema and heavy body.",
    "price": 650,
    "tags": "groceries, beverage, coffee, whole-bean, espresso, dark-roast, arabica, robusta, morning, caffeinated",
    "image_url": "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Ergonomic Mesh Office Chair",
    "description": "Adjustable desk chair with breathable backing and dedicated lumbar support for long hours.",
    "price": 6500,
    "tags": "furniture, home, office, seating, chair, ergonomic, swivel, mesh, lumbar-support, adjustable",
    "image_url": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Vanilla Scented Soy Candle",
    "description": "Hand-poured natural wax candle delivering a warm, relaxing vanilla bean aroma.",
    "price": 499,
    "tags": "home, decor, fragrance, candle, soy-wax, scented, aromatherapy, vanilla, glass-jar, relaxing",
    "image_url": "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Men's Polarized Aviator Sunglasses",
    "description": "Classic metal-frame eyewear offering 100% UV protection and glare reduction.",
    "price": 1200,
    "tags": "accessories, fashion, eyewear, glasses, sunglasses, men, aviator, polarized, metal-frame, uv-protection",
    "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Brightening Vitamin C Face Serum",
    "description": "Concentrated daily antioxidant treatment designed to even skin tone and boost radiance.",
    "price": 799,
    "tags": "beauty, skincare, face, treatment, serum, anti-aging, hydrating, vitamin-c, brightening, dropper",
    "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "Eco-Friendly Canvas Tote Bag",
    "description": "Heavy-duty reusable cotton bag perfect for everyday grocery shopping and commuting.",
    "price": 250,
    "tags": "accessories, bags, carrying, handbag, tote, canvas, cotton, eco-friendly, reusable, shopping",
    "image_url": "https://images.unsplash.com/photo-1597484662317-9bd7baa12921?q=80&w=800&auto=format&fit=crop"
  },
  {
    "name": "10000mAh Fast Charging Power Bank",
    "description": "Slim portable battery pack equipped with USB-C power delivery for rapid device charging.",
    "price": 1299,
    "tags": "electronics, mobile, accessories, charging, battery, power-bank, portable, usb-c, fast-charge, 10000mah",
    "image_url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop"
  }
]

async function main() {
  console.log("Starting database seed...");
  
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