/* =====================================================
   FAMARA'SMARKET - COMPLETE SHOPPING SYSTEM
   ===================================================== */

"use strict";

/* =====================================================
   SETTINGS
   ===================================================== */

const WHATSAPP_NUMBER = "099568485";

/* =====================================================
   CART
   ===================================================== */

let cart = [];

try {
    cart = JSON.parse(
        localStorage.getItem("famarasCart")
    ) || [];
} catch (error) {
    cart = [];
}


/* =====================================================
   SAVE CART
   ===================================================== */

function saveCart() {
    localStorage.setItem(
        "famarasCart",
        JSON.stringify(cart)
    );
}


/* =====================================================
   CART COUNT
   ===================================================== */

function updateCartCount() {

    const countElement =
        document.getElementById("cart-count");

    if (!countElement) return;

    const total = cart.reduce(
        function(sum, item) {
            return sum + Number(item.quantity || 0);
        },
        0
    );

    countElement.textContent = total;
}


/* =====================================================
   ADD TO CART
   ===================================================== */

function addToCart(productName, price) {

    price = Number(price);

    if (!productName || isNaN(price)) {
        alert("Product information is missing.");
        return;
    }

    const existing =
        cart.find(function(item) {
            return item.name === productName;
        });

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });

    }

    saveCart();
    updateCartCount();
    displayCart();

    alert(
        productName +
        " has been added to your cart! 🛒"
    );
}


/* =====================================================
   REMOVE FROM CART
   ===================================================== */

function removeFromCart(productName) {

    cart = cart.filter(function(item) {
        return item.name !== productName;
    });

    saveCart();
    updateCartCount();
    displayCart();
    displayCheckout();
}


/* =====================================================
   CHANGE QUANTITY
   ===================================================== */

function changeQuantity(productName, amount) {

    const item =
        cart.find(function(product) {
            return product.name === productName;
        });

    if (!item) return;

    item.quantity += Number(amount);

    if (item.quantity <= 0) {

        cart = cart.filter(function(product) {
            return product.name !== productName;
        });

    }

    saveCart();
    updateCartCount();
    displayCart();
    displayCheckout();
}


/* =====================================================
   CART TOTAL
   ===================================================== */

function getCartTotal() {

    return cart.reduce(
        function(total, item) {

            return total +
                Number(item.price) *
                Number(item.quantity);

        },
        0
    );
}


/* =====================================================
   DISPLAY CART
   ===================================================== */

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");

    if (!cartItems) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        if (cartTotal) {
            cartTotal.textContent = "Total: Le 0";
        }

        return;
    }


    cartItems.innerHTML = "";


    cart.forEach(function(item) {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        const row =
            document.createElement("div");

        row.className = "cart-item";


        row.style.cssText = `
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:15px;
            padding:15px 0;
            border-bottom:1px solid #ddd;
            flex-wrap:wrap;
        `;


        const details =
            document.createElement("div");

        details.innerHTML = `
            <strong>
                ${escapeHTML(item.name)}
            </strong>

            <p style="margin:5px 0;color:#777;">
                Le ${Number(item.price).toLocaleString()}
                × ${item.quantity}
            </p>
        `;


        const total =
            document.createElement("strong");

        total.textContent =
            "Le " +
            itemTotal.toLocaleString();


        const controls =
            document.createElement("div");

        controls.style.cssText = `
            display:flex;
            gap:6px;
            align-items:center;
        `;


        const minus =
            document.createElement("button");

        minus.type = "button";
        minus.textContent = "−";

        minus.onclick = function() {
            changeQuantity(item.name, -1);
        };


        const quantity =
            document.createElement("span");

        quantity.textContent =
            item.quantity;


        const plus =
            document.createElement("button");

        plus.type = "button";
        plus.textContent = "+";

        plus.onclick = function() {
            changeQuantity(item.name, 1);
        };


        const remove =
            document.createElement("button");

        remove.type = "button";
        remove.textContent = "Remove";

        remove.onclick = function() {
            removeFromCart(item.name);
        };


        controls.appendChild(minus);
        controls.appendChild(quantity);
        controls.appendChild(plus);
        controls.appendChild(remove);


        row.appendChild(details);
        row.appendChild(total);
        row.appendChild(controls);

        cartItems.appendChild(row);

    });


    if (cartTotal) {

        cartTotal.textContent =
            "Total: Le " +
            getCartTotal().toLocaleString();

    }
}


/* =====================================================
   SHOW CART
   ===================================================== */

function showCart() {

    const cartArea =
        document.getElementById("cart-message");

    if (cartArea) {

        cartArea.scrollIntoView({
            behavior: "smooth"
        });

        return;
    }

    window.location.href = "shop.html";
}


/* =====================================================
   SEARCH PRODUCTS
   ===================================================== */

function filterProducts() {

    const search =
        document.getElementById("product-search");

    const category =
        document.getElementById("category-filter");

    if (!search) return;


    const searchText =
        search.value
        .toLowerCase()
        .trim();


    const selectedCategory =
        category
        ? category.value
        : "all";


    const products =
        document.querySelectorAll(
            ".product-card"
        );


    products.forEach(function(product) {

        const name =
            (
                product.dataset.name ||
                product.textContent
            ).toLowerCase();


        const productCategory =
            (
                product.dataset.category ||
                ""
            ).toLowerCase();


        const matchesName =
            name.includes(searchText);


        const matchesCategory =
            selectedCategory === "all" ||
            productCategory ===
            selectedCategory;


        product.style.display =
            matchesName &&
            matchesCategory
            ? ""
            : "none";

    });
}


/* =====================================================
   CHECKOUT DISPLAY
   ===================================================== */

function displayCheckout() {

    const items =
        document.getElementById(
            "order-items"
        );

    const total =
        document.getElementById(
            "order-total"
        );

    const checkout =
        document.getElementById(
            "checkout-content"
        );

    const empty =
        document.getElementById(
            "empty-checkout"
        );


    if (!items) return;


    if (cart.length === 0) {

        if (checkout)
            checkout.style.display = "none";

        if (empty)
            empty.style.display = "block";

        return;
    }


    if (checkout)
        checkout.style.display = "";


    if (empty)
        empty.style.display = "none";


    items.innerHTML = "";


    cart.forEach(function(item) {

        const row =
            document.createElement("div");

        row.className =
            "order-item";


        row.innerHTML = `
            <div>
                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <div style="
                    color:#777;
                    font-size:.9rem;
                    margin-top:5px;
                ">
                    Le ${Number(item.price).toLocaleString()}
                    × ${item.quantity}
                </div>
            </div>

            <strong>
                Le ${
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    ).toLocaleString()
                }
            </strong>
        `;


        items.appendChild(row);

    });


    if (total) {

        total.textContent =
            "Le " +
            getCartTotal().toLocaleString();

    }
}


/* =====================================================
   PAYMENT METHOD
   ===================================================== */

function setupPaymentMethods() {

    const payment =
        document.getElementById(
            "payment-method"
        );

    if (!payment) return;


    payment.addEventListener(
        "change",
        function() {

            document
                .querySelectorAll(".payment-info")
                .forEach(function(box) {

                    box.style.display =
                        "none";

                });


            const value =
                payment.value;


            if (value === "Afrimoney") {

                showPaymentBox(
                    "afrimoney-info"
                );

            }


            if (value === "Orange Money") {

                showPaymentBox(
                    "orange-info"
                );

            }


            if (value === "Bank Transfer") {

                showPaymentBox(
                    "bank-info"
                );

            }


            if (value === "Cash on Delivery") {

                showPaymentBox(
                    "cash-info"
                );

            }


            if (value === "Other") {

                showPaymentBox(
                    "other-info"
                );

            }

        }
    );
}


/* =====================================================
   SHOW PAYMENT BOX
   ===================================================== */

function showPaymentBox(id) {

    const box =
        document.getElementById(id);

    if (box) {

        box.style.display =
            "block";

    }
}


/* =====================================================
   PLACE ORDER
   ===================================================== */

function setupCheckout() {

    const form =
        document.getElementById(
            "order-form"
        );

    if (!form) return;


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            const name =
                document.getElementById(
                    "customer-name"
                ).value.trim();


            const phone =
                document.getElementById(
                    "customer-phone"
                ).value.trim();


            const area =
                document.getElementById(
                    "delivery-area"
                ).value;


            const address =
                document.getElementById(
                    "delivery-address"
                ).value.trim();


            const payment =
                document.getElementById(
                    "payment-method"
                ).value;


            if (
                !name ||
                !phone ||
                !area ||
                !address ||
                !payment
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;
            }


            const orderNumber =
                "FM-" +
                Date.now()
                .toString()
                .slice(-6);


            const total =
                getCartTotal();


            const order = {

                orderNumber:
                    orderNumber,

                customerName:
                    name,

                phone:
                    phone,

                deliveryArea:
                    area,

                address:
                    address,

                paymentMethod:
                    payment,

                products:
                    cart,

                total:
                    total,

                date:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "lastFamarasOrder",
                JSON.stringify(order)
            );


            /* =====================================
               CREATE WHATSAPP MESSAGE
               ===================================== */

            let message =
                "🛍️ *NEW FAMARA'SMARKET ORDER*%0A%0A";


            message +=
                "*Order:* " +
                orderNumber +
                "%0A";


            message +=
                "*Customer:* " +
                name +
                "%0A";


            message +=
                "*Phone:* " +
                phone +
                "%0A";


            message +=
                "*Delivery Area:* " +
                area +
                "%0A";


            message +=
                "*Address:* " +
                address +
                "%0A";


            message +=
                "*Payment:* " +
                payment +
                "%0A%0A";


            message +=
                "*PRODUCTS*%0A";


            cart.forEach(function(item) {

                message +=
                    "• " +
                    item.name +
                    " × " +
                    item.quantity +
                    " = Le " +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    ).toLocaleString() +
                    "%0A";

            });


            message +=
                "%0A*TOTAL:* Le " +
                total.toLocaleString();


            /* =====================================
               OPEN WHATSAPP
               ===================================== */

            const whatsappURL =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                message;


            window.open(
                whatsappURL,
                "_blank"
            );


            /* =====================================
               CLEAR CART
               ===================================== */

            cart = [];

            saveCart();

            updateCartCount();

            displayCart();

            displayCheckout();


            /* =====================================
               SUCCESS MESSAGE
               ===================================== */

            const success =
                document.getElementById(
                    "success-message"
                );


            if (success) {

                success.style.display =
                    "block";


                const number =
                    document.getElementById(
                        "order-number"
                    );


                if (number) {

                    number.textContent =
                        "Order Number: " +
                        orderNumber;

                }


                success.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );
}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


/* =====================================================
   START
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        displayCart();

        displayCheckout();

        setupPaymentMethods();

        setupCheckout();

        filterProducts();

        console.log(
            "Famara'smarket shopping system is running successfully."
        );

    }
);