const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getCart = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.body.userId || (req.session.user && req.session.user._id);
    const { productId, quantity } = req.body;
    if (!userId) {
      if (req.accepts('html')) {
        return res.redirect('/login');
      } else {
        return res.status(401).json({ error: 'User not logged in' });
      }
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const product = await Product.findById(productId);
    if (!product) {
      if (req.accepts('html')) {
        return res.redirect('/products');
      } else {
        return res.status(404).json({ error: 'Product not found' });
      }
    }
    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }
    await cart.save();
    if (req.accepts('html')) {
      return res.redirect('/cart');
    } else {
      return res.json(cart);
    }
  } catch (err) {
    if (req.accepts('html')) {
      return res.redirect('/products');
    } else {
      return res.status(400).json({ error: err.message });
    }
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.body.userId || (req.session.user && req.session.user._id);
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      if (req.accepts('html')) {
        return res.redirect('/cart');
      } else {
        return res.status(404).json({ error: 'Cart not found' });
      }
    }
    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();
    if (req.accepts('html')) {
      return res.redirect('/cart');
    } else {
      return res.json(cart);
    }
  } catch (err) {
    if (req.accepts('html')) {
      return res.redirect('/cart');
    } else {
      return res.status(400).json({ error: err.message });
    }
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.body.userId || (req.session.user && req.session.user._id);
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      if (req.accepts('html')) {
        return res.redirect('/cart');
      } else {
        return res.status(404).json({ error: 'Cart not found' });
      }
    }
    cart.items = [];
    await cart.save();
    if (req.accepts('html')) {
      return res.redirect('/cart');
    } else {
      return res.json(cart);
    }
  } catch (err) {
    if (req.accepts('html')) {
      return res.redirect('/cart');
    } else {
      return res.status(400).json({ error: err.message });
    }
  }
}; 





