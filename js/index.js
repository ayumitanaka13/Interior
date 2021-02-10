// menu open
$(function () {
  $(".toggle").click(function () {
    $(this).toggleClass("active");
    $(".menu").toggleClass("open");
  });
});

// cart open
$(".shopping-cart").click(function () {
  $(this).toggleClass("on");
  $(".cart").slideToggle();
});

// cart function
// if (document.readyState == "loading") {
//   document.addEventListener("DOMContentLoaded", ready);
// } else {
//   ready();
// }

ready();

const cartItems = document.querySelector(".cart")[0];

function ready() {
  const removeItemButtons = document.querySelector("#cart_trash");
  removeButton.addEventListener("click", removeCartItem);
  // console.dir(removeItemButtons)
  for (let removeButton of removeItemButtons) {
    removeButton.addEventListener("click", removeCartItem);
  }

  const quantityInputs = document.querySelector("#cart_quantity");

  for (let input of quantityInputs) {
    input.addEventListener("change", quantityChanged);
    console.log(quantityInputs);
  }

  const addToCartButtons = document.querySelector("#add_item");
  for (let cartButton of addToCartButtons) {
    cartButton.addEventListener("click", addToCart);
  }

  document
    .querySelector("#cart_checkout")[0]
    .addEventListener("click", purchaseClicked);
}

function purchaseClicked() {
  alert("Thank you for shopping with us!");
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
}

function removeCartItem(e) {
  const removeButtonClicked = e.target;
  removeButtonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(e) {
  const inputNum = e.target;
  if (isNaN(inputNum.value) || inputNum.value <= 0) {
    inputNum.value = 1;
  }
  updateCartTotal();
}

function addToCart(e) {
  const addButtonClicked = e.target;
  const shopItem = addButtonClicked.parentElement.parentElement.parentElement;
  const title = shopItem.querySelector(".item_title")[0].innerText;
  const price = shopItem.querySelector("#price")[0].innerText;
  const imageSrc = shopItem.querySelector("#item_image")[0].src;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
  // const ul = document.createElement('ul');
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");
  const div = document.createElement("div");
  const cart = document.querySelector(".cart_total");
  div.id = "cart";
  div.classList.add("cart");
  // div.setAttribute("id", randomNum)


  // to get what inside of cart
  const cartItemNames = document.querySelector("#cart_item_title");
  for (let cartItemName of cartItemNames) {
    if (cartItemName.innerText === title) {
      alert("This item is alredy added to the cart.");
      return;
    }
  }

  div.innerHTML = `
    <ul> 
      <li id="cart_item_img">
        <a href="#"><img src="/img/top.jpg" alt=""></a>
      </li>
      <li id="cart_item_title">
        <a href="#">item name</a>
      </li>
      <li>
        <input id="cart_quantity" type="number" value="1">
      </li>
      <li id="cart_price">
        <a href="#">$ 0.00</a>
      </li>
      <li id="cart_trash">
        <a href="#"><i class="fas fa-times"></i></a>
      </li>
    </ul>
  `;

  header.insertBefore(div, cart);
  nav.insertBefore(div, cart);
  // div.appendChild(ul);
  cart
    .querySelector("#cart_trash")[0]
    .addEventListener("click", removeCartItem);
  cart
    .querySelector("#cart_quantity")[0]
    .addEventListener("change", quantityChanged);
}

function updateCartTotal() {
  const cart = document.querySelector(".cart");
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    let cart = cart[i];
    const priceElement = cart.querySelector("#cart_price")[0];
    const quantityElement = cart.querySelector("#cart_quantity")[0];
    const price = parseFloat(priceElement.innerText);
    const quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.querySelector("#cart_total_price")[0].innerText = `$ ${total}`;
}