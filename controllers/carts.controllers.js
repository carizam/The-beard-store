exports.renderCart = async (req, res) => {
  try {
      const cart = req.session.cart || [];
      let totalItems = 0;
      let totalPrice = 0;

      cart.forEach(item => {
          totalItems += item.quantity;
          totalPrice += item.product.price * item.quantity;
      });

      console.log('Total Items:', totalItems); 
      console.log('Total Price:', totalPrice); 

      res.render('cart', { 
          cart,
          totalItems,
          totalPrice
      });
  } catch (error) {
      res.status(500).send(error);
  }
};
