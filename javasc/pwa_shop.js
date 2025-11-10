import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// ==========================================================
// MIDDLEWARE
// ==========================================================
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

// ==========================================================
// ROOT REDIRECT
// ==========================================================
app.get("/", (req, res) => res.redirect("/login"));

// ==========================================================
// MOCK DATABASE
// ==========================================================
const DB = {
  users: [
    { username: "user1", password: "pass123" },
    { username: "admin", password: "admin123" },
  ],
  products: [
    { id: 1, name: "Solar Power Bank", category: "Electronics", price: 1999, desc: "Recharge anywhere with solar power. Eco-friendly and portable.", image: "/public/solar.png" },
    { id: 2, name: "Wireless Earbuds", category: "Electronics", price: 2499, desc: "Noise-cancelling, waterproof, and 20-hour battery life.", image: "/public/wirelessear.png" },
    { id: 3, name: "Eco Bottle", category: "Accessories", price: 799, desc: "Reusable bottle made from 100% recycled plastic.", image: "/public/ecobottle.png" },
    { id: 5, name: "Smartwatch", category: "Electronics", price: 5999, desc: "Track fitness, health, and notifications on the go.", image: "/public/smartwatch.png" },
    { id: 6, name: "Sunglasses", category: "Accessories", price: 1299, desc: "UV400 protection with polarized lenses.", image: "/public/sunglasses.png" },
    { id: 8, name: "Almonds (1kg)", category: "Grocery", price: 999, desc: "Premium quality California almonds, rich in protein.", image: "/public/almonds.png" },
  ],
  cart: [],
  orders: []
};

// ==========================================================
// LOGIN PAGE
// ==========================================================
app.get("/login", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PWA Shop Login</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
body { font-family: 'Inter', sans-serif; }
.login-card { backdrop-filter: blur(15px); background-color: rgba(255,255,255,0.15); border-radius: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.25); padding: 2.5rem; width: 380px; max-width: 90%; transition: transform 0.3s ease; }
.login-card:hover { transform: translateY(-5px); }
.input-field { background-color: rgba(255,255,255,0.25); border: none; border-radius: 0.75rem; padding: 0.75rem 1rem; color: #fff; backdrop-filter: blur(10px); }
.input-field:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.5); background-color: rgba(255,255,255,0.35); }
.login-button { background: linear-gradient(to right, #4f46e5, #6366f1); }
.login-button:hover { opacity: 0.9; }
</style>
</head>
<body class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-600 via-blue-500 to-cyan-400">
<div class="login-card flex flex-col items-center text-white">
<h1 class="text-3xl font-bold mb-6">Welcome Back!</h1>
<p class="text-gray-200 mb-6 text-center">Sign in to access your PWA Shop dashboard.</p>
<form action="/login" method="POST" class="flex flex-col gap-4 w-full">
<input class="input-field placeholder-gray-200" type="text" name="username" placeholder="Username" required />
<input class="input-field placeholder-gray-200" type="password" name="password" placeholder="Password" required />
<button class="login-button text-white py-2 rounded-xl font-semibold mt-2 hover:scale-105 transition transform">Sign In</button>
</form>
<p class="mt-6 text-gray-200 text-sm">Don't have an account? <a href="#" class="text-white underline hover:text-gray-100">Sign Up</a></p>
</div>
</body>
</html>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = DB.users.find(u => u.username===username && u.password===password);
  if(user) res.redirect("/shop");
  else res.send("<h2>❌ Invalid credentials. <a href='/login'>Try again</a></h2>");
});

// ==========================================================
// SHOP PAGE WITH SLIDING SIDEBAR
// ==========================================================
app.get("/shop",(req,res)=>{
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PWA Shop</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
body { font-family: 'Inter', sans-serif; }
.card { background-color: white; border-radius: 1rem; padding: 1rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s; }
.card:hover { transform: scale(1.05); }
#toast { position: fixed; bottom: 20px; right: 20px; background-color: #4ade80; color: white; padding: 1rem 1.5rem; border-radius: 0.75rem; opacity: 0; transition: opacity 0.5s; z-index: 999; }
#sidebar { position: fixed; top:0; left:-250px; width:250px; height:100%; background: linear-gradient(to bottom, #6366f1, #4f46e5); color:white; padding:1rem; transition: left 0.3s; z-index:1000; overflow-y:auto; }
#sidebar.active { left:0; }
#overlay { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:900; }
#overlay.active { display:block; }
#sidebar button { display:block; width:100%; text-align:left; padding:0.5rem 0; margin-bottom:0.5rem; border:none; background:none; color:white; cursor:pointer; font-weight:500; border-radius:0.5rem; transition: background 0.2s; }
#sidebar button:hover { background: rgba(255,255,255,0.2); }
</style>
</head>
<body class="bg-gray-100 text-gray-800">

<div id="overlay" onclick="toggleSidebar()"></div>

<header class="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 shadow p-4 flex justify-between items-center">
  <div class="flex items-center gap-3">
    <button onclick="toggleSidebar()" class="text-white text-2xl font-bold">☰</button>
    <h1 class="text-2xl font-bold text-white">🛒 PWA Shop</h1>
  </div>
  <div class="flex items-center gap-4">
    <input id="search" onkeyup="filterProducts()" placeholder="Search products..." class="border rounded px-3 py-1">
    <span id="cart-info" class="px-3 py-1 rounded bg-blue-600 text-white">Cart: 0 | ₹0</span>
    <a href="/cart" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">View Cart</a>
  </div>
</header>

<aside id="sidebar">
  <h2 class="text-xl font-bold mb-4">Categories & Products</h2>
  <button onclick="filterCategory('All')">All Products</button>
  <div id="categories"></div>
</aside>

<main class="ml-0 md:ml-64 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4" id="products"></main>

<div id="toast">✅ Added to cart</div>

<script>
let cart = ${JSON.stringify(DB.cart)};
const products = ${JSON.stringify(DB.products)};

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
}

function displayCartInfo(){
  const total = cart.reduce((sum,p)=>sum+p.price,0);
  document.getElementById('cart-info').textContent = \`Cart: \${cart.length} | ₹\${total}\`;
}

function displayProducts(list){
  const container = document.getElementById("products");
  container.innerHTML = list.map(p => \`
    <div class="card text-black">
      <img src="\${p.image}" class="w-full h-48 object-cover rounded-lg mb-2">
      <h2 class="font-bold text-lg">\${p.name}</h2>
      <p class="text-gray-600 mb-1">\${p.desc}</p>
      <p class="font-semibold mb-2 text-blue-600">₹\${p.price}</p>
      <button onclick="addToCart(\${p.id})" class="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Add to Cart</button>
    </div>
  \`).join("");
}

function displayCategories(){
  const container = document.getElementById('categories');
  const cats = [...new Set(products.map(p=>p.category))];
  container.innerHTML = cats.map(c=>\`<button onclick="filterCategory('\${c}')">\${c}</button>\`).join("");
}

function filterProducts(){
  const term = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(p=>p.name.toLowerCase().includes(term));
  displayProducts(filtered);
}

function filterCategory(cat){
  toggleSidebar();
  if(cat==="All"){ displayProducts(products); return; }
  displayProducts(products.filter(p=>p.category===cat));
}

function addToCart(id){
  fetch('/cart/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})})
  .then(res=>{
    const product = products.find(p=>p.id==id);
    cart.push(product);
    displayCartInfo();
    const toast = document.getElementById('toast');
    toast.textContent = \`✅ "\${product.name}" added to cart\`;
    toast.style.opacity=1;
    setTimeout(()=>{toast.style.opacity=0},1500);
  });
}

displayProducts(products);
displayCartInfo();
displayCategories();
</script>

</body>
</html>
  `);
});

// ==========================================================
// CART ADD
// ==========================================================
app.post("/cart/add", (req,res)=>{
  const id = req.body.id;
  const product = DB.products.find(p=>p.id==id);
  if(product) DB.cart.push(product);
  res.json({success:true});
});

// ==========================================================
// CART PAGE
// ==========================================================
app.get("/cart",(req,res)=>{
  const cartItems = DB.cart.map((p,i)=>`
<tr class="border-b">
<td class="px-4 py-2">${i+1}</td>
<td class="px-4 py-2">${p.name}</td>
<td class="px-4 py-2">₹${p.price}</td>
</tr>`).join("");
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cart</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="p-6 bg-gray-100 text-black">
<h1 class="text-2xl font-bold mb-4">🛒 Cart</h1>
${DB.cart.length===0?'<p>Your cart is empty.</p>':`
<table class="table-auto w-full bg-white rounded-lg shadow">
<thead><tr class="bg-blue-600 text-white"><th>#</th><th>Product</th><th>Price</th></tr></thead>
<tbody>${cartItems}</tbody></table>
<form action="/cart/place-order" method="POST" class="mt-4">
<button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Place Order</button>
</form>`}
<a href="/shop" class="mt-4 inline-block bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white px-3 py-1 rounded hover:opacity-90">Back to Shop</a>
</body>
</html>
  `);
});

// ==========================================================
// PLACE ORDER
// ==========================================================
app.post("/cart/place-order",(req,res)=>{
  DB.cart.forEach(p=>DB.orders.push({...p,time:new Date().toLocaleString()}));
  DB.cart=[];
  res.redirect("/orders");
});

// ==========================================================
// ORDERS PAGE
// ==========================================================
app.get("/orders",(req,res)=>{
  const orderItems = DB.orders.map((p,i)=>`
<tr class="border-b">
<td class="px-4 py-2">${i+1}</td>
<td class="px-4 py-2">${p.name}</td>
<td class="px-4 py-2">₹${p.price}</td>
<td class="px-4 py-2">${p.time}</td>
</tr>`).join("");
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Orders</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="p-6 bg-gray-100 text-black">
<h1 class="text-2xl font-bold mb-4">📦 Orders</h1>
${DB.orders.length===0?'<p>No orders yet.</p>':`
<table class="table-auto w-full bg-white rounded-lg shadow">
<thead><tr class="bg-blue-600 text-white"><th>#</th><th>Product</th><th>Price</th><th>Ordered At</th></tr></thead>
<tbody>${orderItems}</tbody></table>`}
<a href="/shop" class="mt-4 inline-block bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white px-3 py-1 rounded hover:opacity-90">Back to Shop</a>
</body>
</html>
  `);
});

// ==========================================================
// START SERVER
// ==========================================================
app.listen(PORT,()=>{
  console.clear();
  console.log("🚀 PWA Shop server started...");
  console.log(`✅ Running at \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
  const url = `http://localhost:${PORT}`;
  switch(process.platform){case"win32":exec(`start ${url}`);break;case"darwin":exec(`open ${url}`);break;case"linux":exec(`xdg-open ${url}`);break;}
});
