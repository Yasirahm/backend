import { useState } from "react";

function UploadProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/upload-product", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      setName("");
      setPrice("");
      setImage(null);
    } catch {
      alert("Failed to upload product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
        type="number"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />
      <button type="submit">Upload Product</button>
    </form>
  );
}

export default UploadProduct;
