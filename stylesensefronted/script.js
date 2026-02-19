const BASE_URL = "http://localhost:8080/api";

let userId = localStorage.getItem("userId");

// ---------------- REGISTER ----------------
function register() {

    fetch(BASE_URL + "/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("regEmail").value,
            password: document.getElementById("regPassword").value
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Registered successfully!");
        window.location.href = "index.html";
    });
}

// ---------------- LOGIN ----------------
function login() {

    fetch(BASE_URL + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => {
        if (res.status === 200) return res.json();
        else throw "Invalid login";
    })
    .then(data => {
        localStorage.setItem("userId", data.id);
        window.location.href = "products.html";
    })
    .catch(() => alert("Wrong credentials"));
}

// ---------------- LOAD PRODUCTS ----------------
if (window.location.pathname.includes("products.html")) {
    loadProducts();
}

function loadProducts() {

    fetch(BASE_URL + "/products/all")
        .then(res => res.json())
        .then(data => displayProducts(data));
}

function displayProducts(data) {

    const container = document.getElementById("products");
    container.innerHTML = "";

    data.forEach(product => {
        container.innerHTML += `
            <div class="product">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <p>₹${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
}

function filterCategory(category) {

    let url = BASE_URL + "/products/all";

    if (category !== "") {
        url = BASE_URL + "/products/category/" + category;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => displayProducts(data));
}

function addToCart(productId) {

    fetch(BASE_URL + "/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            productId: productId,
            quantity: 1
        })
    })
    .then(() => alert("Added to cart"));
}

// ---------------- CART ----------------
if (window.location.pathname.includes("cart.html")) {
    loadCart();
}

function loadCart() {

    fetch(BASE_URL + "/cart/" + localStorage.getItem("userId"))
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("cart");
            container.innerHTML = "";

            data.forEach(item => {
                container.innerHTML += `
                    <p>Product ID: ${item.productId} | Qty: ${item.quantity}</p>
                `;
            });
        });
}

function placeOrder() {

    fetch(BASE_URL + "/orders/place/" + localStorage.getItem("userId"), {
        method: "POST"
    })
    .then(() => {
        alert("Order placed successfully!");
        window.location.href = "orders.html";
    });
}

// ---------------- ORDERS ----------------
if (window.location.pathname.includes("orders.html")) {
    loadOrders();
}

function loadOrders() {

    fetch(BASE_URL + "/orders/" + localStorage.getItem("userId"))
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("orders");
            data.forEach(order => {
                container.innerHTML += `
                    <p>Order ID: ${order.id} | Total: ₹${order.totalAmount}</p>
                `;
            });
        });
}

// ---------------- NAVIGATION ----------------
function goToCart() {
    window.location.href = "cart.html";
}

function goToProducts() {
    window.location.href = "products.html";
}
