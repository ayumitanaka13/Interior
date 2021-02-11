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



// api
const cards = document.querySelector('.cards');
let responseData = [];

getItems();

async function getItems() {
  const res = await axios.get('https://demo-api-project01.herokuapp.com/api/products');
  responseData = res.data
  showItems(responseData);
  // showTags(responseData);
}

function showItems(datas) {
  cards.innerHTML = '';

  datas.forEach((data) => {
    const { name, price, description, image_url } = data;

    const card = document.createElement('div');
    card.classList.add('card');

    const cardText = document.createElement('div');
    cardText.classList.add('card_text');

    const itemTitle = document.createElement('h6');
    itemTitle.classList.add('item_title')
    itemTitle.innerHTML = `${name}`
    cardText.appendChild(itemTitle)

    const addItemWrapper = document.createElement('div')
    cardText.appendChild(addItemWrapper)
    
    const shoppingCart = document.createElement('i')
    shoppingCart.classList.add('fas')
    shoppingCart.classList.add('fa-shopping-cart')
    shoppingCart.setAttribute('id', 'add_item')
    addItemWrapper.appendChild(shoppingCart);

    // add clicked item to cart
    shoppingCart.addEventListener("click", addToCart);

    const priceSign = document.createElement('h6');
    priceSign.classList.add('price_sign')
    priceSign.innerHTML = `
        $
        <span id="price">
          ${price}
        </span>
    `
    addItemWrapper.appendChild(priceSign);

    card.innerHTML = `
          <div class="gallery_img">
            <img id="item_image" src="${image_url}" alt="${name}">
              <div class="caption">
                <p>
                  ${description}
                </p>
              </div>
          </div>
    `
    
    card.appendChild(cardText)
    cards.appendChild(card);
    
  });
}

// show tags


// search item

// searching input
const search = document.querySelector('.search');

search.addEventListener('input', function (e) {
  findItem(e.target.value);
});

// search tag
// const 

function findItem(searchItem) {

  const filteredItems = responseData.filter((item) => {
    if (item.name.toLowerCase().includes(searchItem.toLowerCase())) {
      return item;
    } else if (item.category.toLowerCase().includes(searchItem.toLowerCase())) {
      return item;
    } else if (item.description.toLowerCase().includes(searchItem.toLowerCase())) {
      return item;
    } else {
      return;
    }
  })
  showItems(filteredItems);

}


// --------------------------- cart function ----------------------------

const cart_items = document.querySelector("#cart_items");

// remove a item 
const removeItemButtons = document.querySelectorAll("#cart_trash");
for (let removeButton of removeItemButtons) {
  removeButton.addEventListener("click", removeCartItem);
}

// change quantity 
const quantityInputs = document.querySelectorAll("#cart_quantity");
for (let input of quantityInputs) {
  input.addEventListener("change", quantityChanged);
}


// click checkout
const checkout = document.querySelector('#cart_checkout');
checkout.addEventListener('click', function() {
  alert("Thank you for shopping with us!");
  while (cart_items.hasChildNodes()) {
    cart_items.removeChild(cart_items.firstChild);
  }
  updateCartQtyTotal();
})

// remove item from the cart
function removeCartItem(e) {
  const removeButtonClicked = e.target;
  removeButtonClicked.parentElement.parentElement.parentElement.parentElement.remove();
  updateCartQtyTotal();
}

// change item quantity
function quantityChanged(e) {
  const inputNum = e.target;
  if (isNaN(inputNum.value) || inputNum.value <= 0) {
    inputNum.value = 1;
  }
  updateCartQtyTotal();
}

// get clicked item 
function addToCart(e) {
  const addButtonClicked = e.target;
  const shopItem = addButtonClicked.parentElement.parentElement.parentElement;
  const title = shopItem.querySelector(".item_title").innerText;
  const price = shopItem.querySelector("#price").innerText;
  const imageSrc = shopItem.querySelector("#item_image").src;
  addItemToCart(title, price, imageSrc);
  updateCartQtyTotal();
}

// add clicked item to cart
function addItemToCart(title, price, imageSrc) {

  const cart = document.createElement("div");
  cart.classList.add("cart");

  // to get what inside of cart
  const cartItemNames = document.querySelectorAll("#cart_item_title");
  for (let cartItemName of cartItemNames) {
    if (cartItemName.innerText.trim() === title) {
      alert("This item is alredy added to the cart.");
      return;
    }
  }

  cart.innerHTML = `
    <ul id="cart_item"> 
      <li id="cart_item_img">
        <img src="${imageSrc} alt="${title}">
      </li>
      <li id="cart_item_title">
        ${title}
      </li>
      <li>
        <input id="cart_quantity" type="number" value="1">
      </li>
      <li>
        $ <span id="cart_price">${price}</span>
      </li>
      <li id="cart_trash">
        <a href="#"><i class="fas fa-times"></i></a>
      </li>
    </ul>
  `;

  cart_items.append(cart);
  // div.appendChild(ul);

  // 親となる要素ノード.insertBefore(挿入するノード, 子ノード);
  // const cart_total = document.querySelector('.cart_total');
  // cart_items.insertBefore(cart, cart_total);

  cart
    .querySelector("#cart_trash")
    .addEventListener("click", removeCartItem);
  cart
    .querySelector("#cart_quantity")
    .addEventListener("change", quantityChanged);
}

function updateCartQtyTotal() {
  const carts = document.querySelectorAll("#cart_item");
  // const sm_quantity = document.querySelector("#sm_quantity");

  let total = 0.00;
  let quantity = 0;
  for (let cart of carts) {
    const priceEl = cart.querySelector("#cart_price");
    const quantityEl = cart.querySelector("#cart_quantity");
    const price = parseFloat(priceEl.textContent);
    quantity = quantityEl.value;
    total += price * quantity;
    // quantity += quantity;
  }
  // quantity += quantity;
  document.querySelectorAll("#sm_quantity").textContent = `${quantity}`;

  total = Math.round(total * 100) / 100;
  document.querySelector("#cart_total_price").innerText = `Total $ ${total}`;

}





