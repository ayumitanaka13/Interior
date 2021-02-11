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

// page slide
const swiper = new Swiper('.swiper-container', {
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true,    
  }
});

//// api
let responseData = [];
getItems();

// getItems
async function getItems() {
  const res = await axios.get('https://demo-api-project01.herokuapp.com/api/products');
  responseData = res.data
  showItems(responseData);
  showTags(responseData);
}

// showItems
function showItems(datas) {

  const iterate = datas.length/6; 
  let counter = 0;
  const cardsWrapper = document.querySelector('.swiper-wrapper');
  // cardsWrapper.innerHTML = '';

    for (let i = 0; i < iterate; i++) {
      //create the swipper-slide div
      const cards = document.createElement('div');
      cards.classList.add('swiper-slide');
      cards.classList.add('cards');

      for(let j = 0; j < 6; j++){
        //create the card div to display each card
        const {name, price, description, image_url} = datas[counter];
        const card = document.createElement('div');
        card.classList.add('card');
    
        card.innerHTML = `
              <div class="gallery_img">
                <img id="item_image" src="${image_url}" alt="${name}">
                  <div class="caption">
                    <p>
                      ${description}
                    </p>
                  </div>
              </div>
              <div class="card_text">
                <h6 class="item_title">${name}</h6>
                <div>
                  <i id="add_item" class="fas fa-shopping-cart"></i>
                  <h6 class="price_sign">
                    $
                    <span id="price">
                      ${price}
                    </span>
                  </h6>
                </div>
              </div>
            `;
          
        cards.appendChild(card);
        datas[counter];
        counter++
      }
      cardsWrapper.appendChild(cards);
    }
    swiper.update()
}

// showTags
function showTags(datas) {
  datas.forEach((data) => {
    const {category} = data;
    const categories = document.querySelector('.categories');
    const btn = document.createElement('button');

    btn.innerText = `# ${category}`;
    categories.appendChild(btn);
  });
}

// search item
// searching input
const search = document.querySelector('.search');

search.addEventListener('input', function(e) {
  findItem(e.target.value);
});

function findItem(searchItem) {

  const filteredItems = responseData.filter((item) => {
    if (item.name.toLowerCase().includes(searchItem.toLowerCase())) {
      return item;
    } else if (item.category.toLowerCase().includes(searchItem.toLowerCase())){
      return item;
    } else if (item.description.toLowerCase().includes(searchItem.toLowerCase())) {
      return item;
    } else {
      return;
    }
  })
  showItems(filteredItems);
}

// search tag
const tag = document.querySelector('button');
console.log(tag)







// cart function

// if (document.readyState == "loading") {
//   document.addEventListener("DOMContentLoaded", ready);
// } else {
//   ready();
// }

// ready();

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


  div.parentElement.insertBefore(div, cart);

  // header.insertBefore(div, cart);

  // let $win = $(window);
  // $win.on('load resize', function() {
  //   let windowWidth = window.inner
  // })  

  // header.insertBefore(div, cart);
  // nav.insertBefore(div, cart);

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