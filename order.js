// This code assumes you're using a canvas with id="design-canvas"
// and that you want to display a modal form to collect order info,
// upload the preview image to Cloudinary, and then submit everything
// via POST to a Google Form.

// Cloudinary setup: Replace with your own credentials
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dx6ul77rd/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "keywe-customer-image";

// Google Form POST URL and entry field IDs (replace with your actual values)
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSejTR_mdoHkDczE_k8sGwtg0_7lXK3Adiw5SWJCnHtorNqTCg/formResponse";
const FORM_FIELDS = {
  name: "entry.484152820",
  email: "entry.1530728364",
  phone: "entry.124219980",
  delivery: "entry.578500014",
  address1: "entry.1349205336",
  address2: "entry.1636910658",
  town: "entry.1665833370",
  order_details: "entry.1164158434",
  delivery_date: "entry.811788899",
  image_url: "entry.1233842721",
  price_quote: "entry.1458457949",
  submitted: "submissionTimestamp"
};

function createSplashForm() {
  const modalHtml = `
    <div id="order-modal" style="
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    ">
      <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; width: 100%;">
        <h2>Submit Your Order</h2>
        <form id="order-form">
          <label>Name:<br><input type="text" id="name-input" required></label><br><br>
          <label>Email:<br><input type="email" id="email-input" required></label><br><br>
          <label>Phone:<br><input type="tel" id="phone-input"></label><br><br>
          <label>Pickup or Delivery:<br>
            <select id="delivery-input" required>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </label><br><br>
          <label>Date for Pickup:<br><input type="date" id="date-input" required></label><br><br>
          <div>
            <strong>Design Preview:</strong><br>
            <img id="preview-img" style="width: 100%; max-height: 300px; object-fit: contain; margin-top: 10px;" />
          </div><br>
          <button type="submit">Submit Order</button>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function showOrderModal(designBlob) {
  createSplashForm();
  const reader = new FileReader();
  reader.onloadend = () => {
    document.getElementById("preview-img").src = reader.result;
  };
  reader.readAsDataURL(designBlob);

  document.getElementById("order-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name-input").value;
    const email = document.getElementById("email-input").value;
    const phone = document.getElementById("phone-input").value;
    const deliveryDate = document.getElementById("date-input").value;
    const designJson = getCurrentDesignData();

    // Upload image to Cloudinary
    const imageFormData = new FormData();
    imageFormData.append("file", designBlob);
    imageFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const uploadRes = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: imageFormData
      });

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.secure_url;

      // Submit to Google Form
      const formData = new FormData();
      formData.append(FORM_FIELDS.name, name);
      formData.append(FORM_FIELDS.email, email);
      formData.append(FORM_FIELDS.phone, phone);
      formData.append(FORM_FIELDS.delivery_date, deliveryDate);
      formData.append(FORM_FIELDS.design_json, JSON.stringify(designJson, null, 2));
      formData.append(FORM_FIELDS.image_url, imageUrl);

      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      alert("Your order was submitted successfully!");
      document.getElementById("order-modal").remove();
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("There was a problem submitting your order.");
    }
  });
}

const orderButton = document.getElementById("submit-order");
orderButton.addEventListener("click", () => {
  const canvas = document.getElementById("design-canvas");
  if (!canvas) {
    alert("Design preview not found");
    return;
  }
  canvas.toBlob((blob) => {
    showOrderModal(blob);
  }, "image/png");
});
