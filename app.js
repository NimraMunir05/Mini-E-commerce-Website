require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ejs = require('ejs');

const app = express();

const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');
const cartRouter = require('./routes/cart');
const Product = require('./models/product');


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// View routes for main pages
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    
    // Helper function to categorize products
    const getProductCategory = (productName) => {
      const electronics = ['Wireless Headphones', 'Smart Watch', 'Laptop', 'Camera'];
      const fashion = ['Running Shoes'];
      const homeLiving = ['Mountain Bike'];
      
      if (electronics.includes(productName)) return 'electronics';
      if (fashion.includes(productName)) return 'fashion';
      if (homeLiving.includes(productName)) return 'home-living';
      return 'electronics'; // default
    };
    
    res.render('products', { products, getProductCategory });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error loading products');
  }
});

app.get('/cart', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const userId = req.session.user._id;
  const Cart = require('./models/cart');
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  res.render('cart', { cart: cart || { items: [] } });
});

app.get('/orders', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const userId = req.session.user._id;
  const Order = require('./models/order');
  const orders = await Order.find({ user: userId }).populate('products.product');
  res.render('orders', { orders });
});

app.get('/login', (req, res) => {
  res.render('login', { 
    error: req.query.error, 
    success: req.query.success 
  });
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? '***' : 'undefined' });
    
    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.redirect('/login?error=Email and password are required');
    }
    
    const User = require('./models/user');
    const bcrypt = require('bcryptjs');
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.redirect('/login?error=Invalid credentials');
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.redirect('/login?error=Invalid credentials');
    }
    
    // Set session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    console.log('Login successful:', user.username);
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login?error=Login failed: ' + err.message);
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('register', { 
    error: req.query.error, 
    success: req.query.success 
  });
});

app.post('/register', async (req, res) => {
  try {
    console.log('Raw request body:', req.body);
    const { username, email, password } = req.body;
    console.log('Registration attempt:', { username, email, password: password ? '***' : 'undefined' });
    
    // Validate input
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.redirect('/register?error=All fields are required');
    }
    
    const User = require('./models/user');
    const bcrypt = require('bcryptjs');
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists');
      return res.redirect('/register?error=User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    console.log('User registered successfully:', user._id);
    res.redirect('/login?success=Registration successful');
  } catch (err) {
    console.error('Registration error:', err);
    res.redirect('/register?error=Registration failed: ' + err.message);
  }
});

// Admin product management
app.get('/admin/products', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }
  const products = await Product.find();
  res.render('admin/products', { products });
});

app.get('/admin/products/add', (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }
  res.render('admin/addProduct');
});

app.post('/admin/products/add', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }
  const { name, price, image } = req.body;
  await Product.create({ name, price, image });
  res.redirect('/admin/products');
});

app.get('/admin/products/edit/:id', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/admin/products');
  res.render('admin/editProduct', { product });
});

app.post('/admin/products/edit/:id', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }
  const { name, price, image } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, price, image });
  res.redirect('/admin/products');
});

app.post('/admin/products/delete/:id', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
});

// Real routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cart', cartRouter);

app.post('/orders/place', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const orderController = require('./controllers/orderController');
  return orderController.placeOrder(req, res);
});

// MongoDB connection with in-memory server
async function startServer() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected (in-memory)');
    
    // Add sample products to the database
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Smart Watch',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Laptop',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Running Shoes',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Camera',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Mountain Bike',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80'
      }
    ];
    
    // Check if products already exist
    const existingProducts = await Product.find();
    if (existingProducts.length === 0) {
      await Product.insertMany(sampleProducts);
      console.log('Sample products added to database');
    }
    
    app.listen(3000, () => {
      console.log('Server running on port 3000');
      console.log('MongoDB URI:', mongoUri);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();