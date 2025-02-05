const STORAGE_KEY = "products";

// โหลดข้อมูลสินค้า
function loadProducts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// บันทึกสินค้าใน Local Storage
function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// เพิ่มสินค้าใหม่
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let price = parseFloat(document.getElementById("price").value);
  let inStock = parseInt(document.getElementById("inStock").value);
  let category = document.getElementById("category").value;

  if (!name || isNaN(price) || isNaN(inStock) || price <= 0 || inStock < 0) {
    alert("กรุณากรอกข้อมูลให้ถูกต้อง");
    return;
  }

  let products = loadProducts();
  products.push({
    id: Date.now(),
    name,
    price,
    inStock,
    category,
    minStock: 5,
    totalSales: 0,
  });

  saveProducts(products);
  document.getElementById("productForm").reset();
  renderProducts();
});

// ฟังก์ชันขายสินค้า
function sellProduct(id) {
  let products = loadProducts();
  let product = products.find((p) => p.id === id);
  if (product && product.inStock > 0) {
    product.inStock--;
    product.totalSales++;
    saveProducts(products);
    renderProducts();
  } else {
    alert("สินค้าหมด!");
  }
}

// เติมสต็อกสินค้า
function restockProduct(id) {
  let amount = prompt("จำนวนที่ต้องการเติม:");
  let quantity = parseInt(amount);

  if (!isNaN(quantity) && quantity > 0) {
    let products = loadProducts();
    let product = products.find((p) => p.id === id);
    if (product) {
      product.inStock += quantity;
      saveProducts(products);
      renderProducts();
    }
  } else {
    alert("กรุณากรอกจำนวนให้ถูกต้อง");
  }
}

// ลบสินค้า
function deleteProduct(id) {
  let products = loadProducts().filter((p) => p.id !== id);
  saveProducts(products);
  renderProducts();
}

// แสดงสินค้า
function renderProducts() {
  let products = loadProducts();
  let table = document.getElementById("productTable");
  let lowStockList = document.getElementById("lowStockList");
  table.innerHTML = "";
  lowStockList.innerHTML = "";

  products.forEach((product) => {
    let row = `<tr>
            <td class="border p-2">${product.name}</td>
            <td class="border p-2">${product.category}</td>
            <td class="border p-2">${product.price}</td>
            <td class="border p-2 ${product.inStock < 5 ? "text-red-500" : ""}">
              ${product.inStock}
            </td>
            <td class="border p-2">${product.totalSales}</td>
            <td class="border p-2">
              <button onclick="sellProduct(${
                product.id
              })" class="bg-red-500 text-white px-2 py-1 rounded">ขาย</button>
              <button onclick="restockProduct(${
                product.id
              })" class="bg-blue-500 text-white px-2 py-1 rounded">เพิ่มสต็อก</button>
              <button onclick="deleteProduct(${
                product.id
              })" class="bg-gray-500 text-white px-2 py-1 rounded">ลบ</button>
            </td>
        </tr>`;
    table.innerHTML += row;

    if (product.inStock < product.minStock) {
      let lowStockItem = `<li>${product.name} - คงเหลือ: ${product.inStock}</li>`;
      lowStockList.innerHTML += lowStockItem;
    }
  });

  renderBestSellers();
}

// แสดงสินค้าขายดี
function renderBestSellers() {
  let products = loadProducts();
  let bestSellers = document.getElementById("bestSellers");
  bestSellers.innerHTML = "";

  let sortedProducts = products
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 3);

  sortedProducts.forEach((product) => {
    let listItem = `<li>${product.name} ขายไปแล้ว ${product.totalSales} ชิ้น</li>`;
    bestSellers.innerHTML += listItem;
  });
}

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
document.addEventListener("DOMContentLoaded", renderProducts);
