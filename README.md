# BloomSupply — Premium Floral E-Commerce Platform

BloomSupply is a full-stack, aesthetic-driven e-commerce platform designed for purchasing curated floral arrangements, subscriptions, and botanical gifts. Built with performance, security, and a premium user experience in mind, the platform features a fully responsive frontend and a robust backend API.

---

## 🛠 Tech Stack

### Frontend (Client)
*   **Framework:** React 18 (Bootstrapped with Vite for fast HMR and builds)
*   **Styling:** Tailwind CSS v4 (Custom premium design system, Geist font, modern ambient shadows)
*   **Routing:** React Router DOM v6
*   **Icons:** Lucide React
*   **State Management:** React Context API (AuthContext, CartContext)

### Backend (Server)
*   **Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JWT (JSON Web Tokens) with dual-token rotation (Access Token + HTTP-Only Refresh Token Cookie)
*   **Security:** bcryptjs (password hashing), cors, cookie-parser

---

## ✨ Key Functionalities

The platform is strictly divided into two user roles to keep the experience clean and secure:

### 1. Customer (User Panel)
*   **Premium Shopping Experience:** Beautifully padded, highly responsive UI with smooth animations and fallback imagery.
*   **Product Discovery:** Browse products with advanced filtering (by category, badges like "bestseller", price sorting, and text search).
*   **Cart & Checkout:** Persistent shopping cart state. Seamless simulated checkout process calculating subtotal and delivery logic.
*   **User Accounts:** Secure login/registration. Users can view their past order history and manage their shipping address.

### 2. Admin (Admin Dashboard)
*   **Secure Access:** Protected routes that ensure only users with the `admin` role can access the dashboard.
*   **Product Management:** Full CRUD (Create, Read, Update, Delete) operations for inventory, pricing, and stock control.
*   **Category Management:** Organize the store taxonomy.
*   **Banner Management:** Control the Hero Carousel promotions dynamically from the dashboard.
*   **Order Management:** View all incoming orders and update their fulfillment statuses (Pending, Processing, Shipped, Delivered).
*   **User Management:** View registered customers.

---

## 🚀 How to Run the Project Locally

Follow these steps to set up the project on your local machine for development or review.

### Prerequisites
1.  **Node.js** (v18 or higher recommended)
2.  **MongoDB** (Ensure MongoDB is installed and running locally, or have a MongoDB Atlas URI ready)

### Step 1: Install Dependencies
Open your terminal and install the dependencies for both the frontend and backend.

```bash
# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### Step 2: Environment Variables
Create a `.env` file inside the `server/` directory and add the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bloomsupply  # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Run the Servers

You will need two terminal windows open to run both the frontend and backend concurrently.

**Terminal 1 (Start the Backend API):**
```bash
cd server
npm run dev
```
*The server should start on `http://localhost:5000` and connect to MongoDB.*

**Terminal 2 (Start the Frontend UI):**
```bash
cd client
npm run dev
```
*Vite will start the React app, usually accessible at `http://localhost:5173`.*

---

## 🔑 Test Credentials

If you have seeded the database (by running `node seed.js` in the `server` directory), you can use the following credentials to log in:

**Admin Login**
*   **Email:** `admin@bloomsupply.com`
*   **Password:** `admin123`

**Customer Login**
*   **Email:** `customer@bloomsupply.com`
*   **Password:** `password123`

---

## 🔐 Authentication Flow Note for Developers
This project uses a secure **Dual Token System** for authentication:
1.  **Access Token:** Short-lived token stored in React memory (React Context). It is sent in the `Authorization` header (`Bearer <token>`) for API requests.
2.  **Refresh Token:** Long-lived token stored in a secure, `HTTP-Only` cookie. When the Access Token expires, the client automatically requests a new one from the `/api/auth/refresh` endpoint using this cookie, preventing XSS attacks and avoiding local storage vulnerabilities. 

## 🎨 Design Philosophy
The frontend utilizes a strict design system found in `client/src/index.css` and `tailwind.config`. 
*   **Spacing:** Emphasizes deep horizontal padding to allow content to breathe.
*   **Typography:** Exclusively uses the modern **Geist** font for a structured, clean look.
*   **Images:** Graceful fallback handling via `client/src/utils/fallbackData.js` ensures the layout never breaks, even if the database is empty or APIs fail.
