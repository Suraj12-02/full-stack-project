# 🛍️ PWA Shop – Node.js E-Commerce App

A simple, elegant, and responsive Progressive Web App (PWA)-style e-commerce platform built with **Node.js**, **Express**, and **TailwindCSS**.  
This app includes a login system, product listings, category filtering, cart management, and order tracking — all in one lightweight web server.

---

## 🚀 Features

✅ **Login System** – Simple username/password authentication  
✅ **Product Listing** – Displays multiple product categories dynamically  
✅ **Category Filter & Search** – Filter products by category or search term  
✅ **Add to Cart** – Add items to cart with toast notifications  
✅ **Sidebar Navigation** – Sliding sidebar for product categories  
✅ **Order Management** – Place orders and view order history  
✅ **Stylish UI** – Built with TailwindCSS for modern and responsive design  
✅ **Auto Launch** – Automatically opens in your browser when server starts  

---

## 🧩 Tech Stack

- **Backend:** Node.js, Express  
- **Frontend:** HTML, TailwindCSS, JavaScript  
- **Database:** In-memory mock database (no external DB required)  
- **Runtime:** ES Modules  

---

## 📂 Project Structure

```
PWA-Shop/
├── public/                 # Static assets (images)
│   ├── solar.png
│   ├── wirelessear.png
│   ├── ecobottle.png
│   ├── smartwatch.png
│   ├── sunglasses.png
│   └── almonds.png
├── src/
│   └── app.js              # Main server file
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/pwa-shop.git
cd pwa-shop
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run the server
```bash
npm start
```

or, if you’re using `nodemon`:

```bash
npm run dev
```

### 4️⃣ Open in browser
The app will automatically open in your browser.  
If not, visit 👉 **[http://localhost:3000](http://localhost:3000)**

---

## 👥 Login Credentials

| Username | Password  | Role  |
|-----------|------------|--------|
| `user1`   | `pass123`  | User  |
| `admin`   | `admin123` | Admin |

---

## 🛒 App Flow

1️⃣ **Login Page** → Sign in using credentials  
2️⃣ **Shop Page** → Browse products, filter by category, add to cart  
3️⃣ **Cart Page** → View cart and place your order  
4️⃣ **Orders Page** → View your past orders  

---

## 🧠 Key Code Highlights

- **In-Memory Mock DB:**  
  No database setup needed — data is stored in JavaScript objects.  

- **Express Routes:**  
  Organized routes for `/login`, `/shop`, `/cart`, and `/orders`.  

- **Auto-Launch:**  
  Opens automatically in your default browser based on OS (`start`, `open`, or `xdg-open`).  

---

## 💡 Future Improvements

- Add persistent storage using MongoDB or SQLite  
- Implement user registration & authentication with sessions  
- Add PWA manifest & offline caching  
- Integrate payment gateway simulation  
- Admin dashboard for managing products & orders  

---

## 🧑‍💻 Author

**Priyanshu Singh**  
📍 Chandigarh University  
💼 Full Stack Developer | Passionate about Node.js, Java, and React  
🌐 [GitHub Profile](https://github.com/your-username)

---

## 📝 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

**✨ Enjoy coding & keep building awesome projects! ✨**
