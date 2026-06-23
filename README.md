# 🛍️ ShopEase - Modern E-commerce Platform

A full-stack e-commerce web application built with Node.js, Express.js, MongoDB, and Bootstrap. ShopEase provides a complete online shopping experience with user authentication, product management, shopping cart functionality, and order processing.

![ShopEase Banner](https://img.shields.io/badge/ShopEase-E--commerce%20Platform-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple)

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog**: Browse products organized by categories
- **Category Filtering**: Filter products by Electronics, Fashion, Home & Living
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Management**: Place orders and view order history
- **Responsive Design**: Mobile-first design with Bootstrap 5.3.3

### 👤 User Management
- **User Registration**: Create new accounts with email verification
- **User Authentication**: Secure login with session management
- **Profile Management**: View and manage user information
- **Order History**: Track all past orders and their status

### 🔧 Admin Features
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **Admin Dashboard**: Comprehensive admin interface
- **User Management**: Monitor user accounts and activities

### 🎨 Design & UX
- **Modern UI**: Clean, professional design with gradients
- **Responsive Layout**: Works perfectly on all devices
- **Intuitive Navigation**: Easy-to-use navigation system
- **Loading States**: Smooth loading animations and feedback

## 🚀 Demo

### Live Demo
Visit the application at: `http://localhost:3000`

### Screenshots
- **Home Page**: Landing page with featured products and categories
- **Products Page**: Product catalog with filtering capabilities
- **Cart Page**: Shopping cart management interface
- **Orders Page**: Order history and tracking
- **Admin Panel**: Product and order management

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB (optional - uses in-memory MongoDB by default)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/shopease.git
cd shopease
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
SESSION_SECRET=your_session_secret_here
MONGODB_URI=mongodb://localhost:27017/shopease
```

### Step 4: Start the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### For Customers

1. **Browse Products**
   - Visit the home page to see featured products
   - Navigate to Products page for full catalog
   - Use category filters to find specific items

2. **Create Account**
   - Click "Register" in the navigation
   - Fill in your details and create account
   - Login with your credentials

3. **Shopping Cart**
   - Add products to cart with desired quantities
   - View cart contents and modify quantities
   - Remove items or clear entire cart

4. **Place Orders**
   - Review cart items and totals
   - Click "Place Order" to complete purchase
   - View order history in Orders page

### For Administrators

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to admin sections

2. **Manage Products**
   - Add new products with images and details
   - Edit existing product information
   - Delete products from catalog

3. **Monitor Orders**
   - View all customer orders
   - Update order status
   - Track order details and customer information

## 📁 Project Structure

```
WAD/
├── app.js                 # Main application entry point
├── package.json           # Project dependencies and scripts
├── .env                   # Environment variables
├── README.md             # Project documentation
├── SRS_Document.md       # Software Requirements Specification
│
├── controllers/          # Business logic controllers
│   ├── authController.js    # Authentication logic
│   ├── cartController.js    # Shopping cart operations
│   ├── orderController.js   # Order management
│   └── productController.js # Product operations
│
├── models/              # Database models
│   ├── user.js            # User model
│   ├── product.js         # Product model
│   ├── cart.js            # Cart model
│   └── order.js           # Order model
│
├── routes/              # API route definitions
│   ├── auth.js            # Authentication routes
│   ├── cart.js            # Cart API routes
│   ├── orders.js          # Order routes
│   └── products.js        # Product routes
│
├── views/               # EJS template files
│   ├── index.html         # Home page
│   ├── products.html      # Products catalog
│   ├── cart.ejs          # Shopping cart
│   ├── orders.ejs        # Order history
│   ├── login.ejs         # Login page
│   ├── register.ejs      # Registration page
│   └── admin/            # Admin templates
│       ├── products.ejs     # Admin products
│       ├── addProduct.ejs   # Add product form
│       └── editProduct.ejs  # Edit product form
│
├── public/              # Static assets
│   └── css/
│       └── style.css      # Custom stylesheets
│
└── seed.js              # Database seeding script
```

## 🔌 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout

### Products
- `GET /products` - Get all products
- `GET /admin/products` - Admin product management
- `POST /admin/products/add` - Add new product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

### Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/clear` - Clear entire cart
- `GET /cart` - View cart contents

### Orders
- `POST /orders/place` - Place new order
- `GET /orders` - View order history
- `GET /admin/orders` - Admin order management

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  price: Number (required),
  image: String (required, URL),
  description: String,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number (required)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  total: Number (required),
  status: String (default: 'Pending'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Markup language
- **CSS3** - Styling and animations
- **JavaScript** - Client-side functionality
- **Bootstrap 5.3.3** - CSS framework
- **EJS** - Template engine
- **Google Fonts** - Typography (Inter)

### Development Tools
- **nodemon** - Development server with auto-restart
- **mongodb-memory-server** - In-memory MongoDB for testing

## 🚀 Getting Started

### Quick Start
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your configuration
4. Start the server: `npm start`
5. Visit `http://localhost:3000`

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 🧪 Testing

### Manual Testing
1. **User Registration**: Create a new account
2. **User Login**: Test authentication
3. **Product Browsing**: Navigate through products
4. **Cart Operations**: Add/remove items
5. **Order Placement**: Complete a purchase
6. **Admin Functions**: Test admin panel (requires admin account)

### Sample Data
The application includes sample products that are automatically added to the database on startup:
- Wireless Headphones ($29.99)
- Smart Watch ($49.99)
- Laptop ($79.99)
- Running Shoes ($89.99)
- Camera ($199.99)
- Mountain Bike ($299.99)

## 🔧 Configuration

### Environment Variables
```env
PORT=3000                    # Server port
SESSION_SECRET=your_secret   # Session encryption key
MONGODB_URI=mongodb://...    # Database connection string
```

### Database Configuration
- **Development**: Uses in-memory MongoDB
- **Production**: Configure MongoDB URI in `.env`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test all new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bootstrap** for the responsive CSS framework
- **MongoDB** for the database solution
- **Express.js** for the web framework
- **Node.js** community for excellent documentation

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in `SRS_Document.md`

---

**Made with ❤️ by the ShopEase Development Team**

*Last updated: December 2024* 