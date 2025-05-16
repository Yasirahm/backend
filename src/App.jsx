import { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [viewCart, setViewCart] = useState(false);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => alert("Failed to fetch products"));
  }, []);

  // Add product to cart (local state + backend)
  const handleAddToCart = async (product) => {
    setCartItems((prev) => [...prev, product]); // add locally for UI
    try {
      await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      alert("Added to cart");
    } catch {
      alert("Failed to add to cart");
    }
  };

  // Remove product from cart locally
  const handleRemoveFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const styles = {
    container: { padding: "20px", fontFamily: "Arial" },
    product: {
      border: "1px solid #ccc",
      padding: "15px",
      margin: "10px",
      borderRadius: "10px",
    },
    button: {
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px",
    },
    cartButton: {
      padding: "10px 20px",
      marginBottom: "20px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.cartButton} onClick={() => setViewCart(!viewCart)}>
        {viewCart ? "Back to Products" : `View Cart (${cartItems.length})`}
      </button>

      {!viewCart ? (
        <>
          <h2>🛍 Product List</h2>
          {products.map((product) => (
            <div key={product._id} style={styles.product}>
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <button
                style={styles.button}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </>
      ) : (
        <>
          <h2>🛒 Your Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} style={styles.product}>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <button
                  style={{ ...styles.button, backgroundColor: "#dc3545" }}
                  onClick={() => handleRemoveFromCart(index)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;
