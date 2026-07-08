const categories = [
  "Laptop",
  "Smartphone",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Printer",
];

const products = [];

for (let i = 1; i <= 30; i++) {
  products.push({
    name: `Product ${i}`,
    sku: `SKU${String(i).padStart(3, "0")}`,
    category: categories[i % categories.length],
    description: `Demo Product ${i}`,
    unitprice: 1000 + i * 500,
    reorderLevel: 5,
    status: "ACTIVE",
  });
}

export default products;