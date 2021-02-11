$(function () {
  $(".toggle").click(function () {
    $(this).toggleClass("active");
    $(".menu").toggleClass("open");
  });
});

const clickedMenu = () => {
  $(".toggle").toggleClass("active");
  $(".menu").removeClass("open");
}


$(".shopping-cart").click(function () {
  $(this).toggleClass("on");
  $(".cart").slideToggle();
});

// $("#store").click(function () {
//   $(".shopping-cart").removeClass("on");
//   $(".cart").slideToggle();
// });

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
let tagsArr = [];
let arr = [];
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
  cardsWrapper.innerHTML = '';

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
        arr.push(card);
              
        datas[counter];
        counter++;
        
      }
      cardsWrapper.appendChild(cards);
    }
    swiper.update()
}

// showTags
function showTags(datas) {
  let tags = [];
  datas.forEach((data) => {
    tagsArr.push(data.category);
    tags = tagsArr.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    })
  })
  tags.forEach((tag) => {
    const categories = document.querySelector('.categories');
    const btn = document.createElement('button');
    btn.classList.add('category');
    btn.innerText = `# ${tag}`;
    categories.append(btn);
});
}

// search item
const search = document.querySelector('.search');

search.addEventListener('input', function(e) {
  findItem(e.target.value);
});

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
  console.log(filteredItems);
}

// search.addEventListener('input', function(e) {
//   filterData(e.target.value);
// });
// function filterData(searchItem) {
//   arr.forEach(item => {
//       /* add conditional logic below */
//       console.log(item);
//     if (item.innerText.toLowerCase().includes(searchItem.toLowerCase())) {
//           //remove the class of .hide
//           item.classList.remove('hide');
//       } else {
//           //add the class of .hide
//           item.classList.add('hide');
//       }
//   })
// }


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