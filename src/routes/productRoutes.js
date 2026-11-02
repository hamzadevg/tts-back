import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';
import Product from '../models/Product.js';

const router = express.Router();

// ⚠️ SEED ROUTE - SABSE PEHLE HONA CHAHIYE
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    console.log('🗑️ Purane products delete ho gaye');

    const generateProducts = (baseName, category, subCategory, basePrice, imageIdxStart) => {
      const colors = ['Brown', 'Black', 'Tan', 'Dark Brown', 'Olive', 'Maroon', 'Navy', 'Grey', 'Beige', 'Chocolate'];
      const images = [
        '1543163521-1bf539c55dd2', '1603808033192-082d6919d3e1', '1595950653106-6c9ebd614d3a',
        '1560343090-f0409e92791a', '1614252369475-531eba835eb1', '1525966222134-fcfa99b8ae77',
        '1549298916-b41d501d3772', '1576995853123-5a10305d93c0', '1553062407-98eeb64c6a62',
        '1544816155-12df9643f363', '1596755094514-f87e32f85e2c', '1618354691373-d851c5c3a990',
        '1582552938357-32b906df40cb', '1521572163474-6864f9cf17ab', '1556821840-3a63f95609a7',
        '1576566588028-4147f3842f27', '1503342217505-b0a15ec3261c', '1584917865442-de89df76afd3',
        '1590874103328-eac38a683ce7', '1594223274512-ad4803739b7c', '1601361905353-17f86263d921',
        '1591561954557-26941169b49e', '1548036328-c9fa89d128fa', '1595777457583-95e059d581b8',
        '1496747611176-843222e1e57c', '1515886657613-9f3515b0c78f', '1539008835657-9e8e9680c956',
        '1572804013309-59a88b7e92f1', '1585487000160-6ebcfceb0d03', '1566174053879-31528523f8ae',
        '1544022613-e87ca75a784a', '1550639525-c97d455acf70', '1571902943202-507ec2618e8f',
        '1605100804763-247f67b3557e', '1611591437281-460bfbe1220a', '1599643478518-a784e5dc4c8f',
        '1573408301185-9146fe634ad0', '1584302179498-4d3c4b6c3e2c', '1515562141207-7a88fb7ce338',
        '1535632066927-ab7c9ab60908', '1602751584552-8ba73aad10e1', '1598560917505-59a3ad559071',
        '1515377905703-c4788e51af15'
      ];

      return Array.from({ length: 10 }, (_, i) => ({
        name: `${baseName} ${colors[i % colors.length]}`,
        category: category,
        subCategory: subCategory,
        price: basePrice + (i * 150),
        oldPrice: i % 3 === 0 ? basePrice + 800 + (i * 150) : null,
        rating: 4 + (i % 2),
        reviews: 5 + i * 2,
        isSale: i % 3 === 0,
        quantity: 20 + i * 3,
        image: `https://images.unsplash.com/photo-${images[(imageIdxStart + i) % images.length]}?q=80&w=800&auto=format&fit=crop`
      }));
    };

    const allProducts = [
      // Handmade Chappels
      ...generateProducts('Premium Kheri', 'Handmade Chappels', 'kheri', 4000, 0),
      ...generateProducts('Classic Kaptaan', 'Handmade Chappels', 'kaptaan', 5000, 10),
      ...generateProducts('Noroozi Chappal', 'Handmade Chappels', 'noroozi', 3500, 20),
      ...generateProducts('Quetta Chappal', 'Handmade Chappels', 'quetta', 5500, 30),
      
      // Shoes
      ...generateProducts('Sneaker', 'Shoes', 'sneakers', 3000, 5),
      ...generateProducts('Loafer', 'Shoes', 'loafers', 4000, 15),
      ...generateProducts('Oxford Shoe', 'Shoes', 'oxfords', 5500, 25),
      ...generateProducts('Sandal', 'Shoes', 'sandals', 1500, 35),
      
      // Clothes
      ...generateProducts('Cotton T-Shirt', 'Clothes', 'tshirts', 1200, 2),
      ...generateProducts('Premium Hoodie', 'Clothes', 'hoodies', 3000, 12),
      ...generateProducts('Shirt', 'Clothes', 'shirts', 2500, 22),
      ...generateProducts('Jacket', 'Clothes', 'jackets', 5000, 32),
      
      // Fabrics
      ...generateProducts('Lawn Fabric', 'Fabrics', 'lawn', 1500, 3),
      ...generateProducts('Cotton Fabric', 'Fabrics', 'cotton', 1200, 13),
      ...generateProducts('Khaddar Fabric', 'Fabrics', 'khaddar', 1000, 23),
      ...generateProducts('Silk Fabric', 'Fabrics', 'silk', 3500, 33),
      
      // Jewelleries
      ...generateProducts('Silver Ring', 'Jewelleries', 'rings', 1500, 4),
      ...generateProducts('Bracelet', 'Jewelleries', 'bracelets', 1000, 14),
      ...generateProducts('Necklace', 'Jewelleries', 'necklaces', 2500, 24),
      ...generateProducts('Earring', 'Jewelleries', 'earrings', 800, 34),
      
      // Females: Dresses
      ...generateProducts('Lawn Suit', 'Dresses', 'lawn-suits', 2500, 6),
      ...generateProducts('Silk Dress', 'Dresses', 'silk-dresses', 5000, 16),
      ...generateProducts('Casual Dress', 'Dresses', 'casual-wear', 1800, 26),
      ...generateProducts('Formal Dress', 'Dresses', 'formal-wear', 4000, 36),
      
      // Females: Handbags
      ...generateProducts('Tote Bag', 'Handbags', 'tote-bags', 2000, 7),
      ...generateProducts('Clutch', 'Handbags', 'clutches', 1500, 17),
      ...generateProducts('Shoulder Bag', 'Handbags', 'shoulder-bags', 2500, 27),
      ...generateProducts('Backpack', 'Handbags', 'backpacks', 2200, 37),
      
      // Females: Footwear
      ...generateProducts('Heel', 'Female Footwear', 'heels', 2500, 8),
      ...generateProducts('Flat', 'Female Footwear', 'flats', 1500, 18),
      ...generateProducts('Khussa', 'Female Footwear', 'khussa', 2000, 28),
      ...generateProducts('Women Sneaker', 'Female Footwear', 'sneakers-women', 2800, 38),
      
      // Females: Jewellery
      ...generateProducts('Bangle', 'Female Jewellery', 'bangles', 1200, 9),
      ...generateProducts('Women Earring', 'Female Jewellery', 'earrings-women', 800, 19),
      ...generateProducts('Women Necklace', 'Female Jewellery', 'necklaces-women', 2500, 29),
      ...generateProducts('Women Ring', 'Female Jewellery', 'rings-women', 1000, 39),
      
      // Females: Fabrics
      ...generateProducts('Chiffon Fabric', 'Female Fabrics', 'chiffon', 1800, 1),
      ...generateProducts('Lawn Fabric', 'Female Fabrics', 'lawn-female', 1500, 11),
      ...generateProducts('Silk Fabric', 'Female Fabrics', 'silk-female', 3500, 21),
      ...generateProducts('Velvet Fabric', 'Female Fabrics', 'velvet', 2800, 31),
    ];

    await Product.insertMany(allProducts);
    console.log(`✅ ${allProducts.length} products insert ho gaye`);
    res.json({ message: `✅ ${allProducts.length} Products seeded successfully!` });
  } catch (error) {
    console.error('❌ Seed Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET routes - Inhe SEED ke BAAD rakhna zaroori hai
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;