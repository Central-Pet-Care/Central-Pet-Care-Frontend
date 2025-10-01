export function loadCart() {
  const cart = localStorage.getItem("cart");
  if (cart != null) {
    return JSON.parse(cart);
  } else {
    return [];
  }
}

export function addToCart(productId, qty) {
  const cart = loadCart();

  const index = cart.findIndex((item) => item.productId === productId);

  if (index === -1) {
    cart.push({ productId, qty });
  } else {
    const newQty = cart[index].qty + qty;
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
  }

  saveCart(cart);
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeFromCart(productId) {
  const cart = loadCart();
  const newCart = cart.filter((item) => item.productId !== productId);
  saveCart(newCart);
  return newCart;
}

export function updateCartQty(productId, action) {
  const cart = loadCart();
  const updated = cart.map((item) => {
    if (item.productId === productId) {
      let newQty = item.qty;
      if (action === "increase") newQty += 1;
      if (action === "decrease" && newQty > 1) newQty -= 1;
      return { ...item, qty: newQty };
    }
    return item;
  });

  saveCart(updated);
  return updated;
}

