const Order = require('../models/order');
const Cart = require('../models/cart');

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.body.userId || (req.session.user && req.session.user._id);
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      if (req.accepts('html')) {
        return res.redirect('/cart');
      } else {
        return res.status(400).json({ error: 'Cart is empty' });
      }
    }
    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order = new Order({
      user: userId,
      products: cart.items.map(item => ({ product: item.product._id, quantity: item.quantity })),
      total,
    });
    await order.save();
    cart.items = [];
    await cart.save();
    if (req.accepts('html')) {
      return res.redirect('/orders');
    } else {
      return res.status(201).json(order);
    }
  } catch (err) {
    if (req.accepts('html')) {
      return res.redirect('/cart');
    } else {
      return res.status(400).json({ error: err.message });
    }
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const orders = await Order.find({ user: userId }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 