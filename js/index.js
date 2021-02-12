$(function () {
  $('.toggle').click(function () {
    $(this).toggleClass('active')
    $('.menu').toggleClass('open')
  })
})

// const clickedMenu = () => {
//   $(".toggle").toggleClass("active");
//   $(".menu").removeClass("open");
// }

$('.shopping-cart').click(function () {
  $(this).toggleClass('on')
  $('.cart').slideToggle()
  if (!$('#theModal').is(':visible')) {
    $('#theModal').show()
  } else {
    $('#theModal').hide()
  }
})

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
  },
})

//// api
let responseData = []
let tagsArr = []
let arr = []
let cartArr = []
getItems()

// getItems
async function getItems() {
  const res = await axios.get(
    'https://demo-api-project01.herokuapp.com/api/products'
  )
  responseData = res.data
  showItems(responseData)
  showTags(responseData)
}

// showItems
function showItems(datas) {
  const iterate = datas.length / 6
  let counter = 0
  const cardsWrapper = document.querySelector('.swiper-wrapper')
  cardsWrapper.innerHTML = ''

  for (let i = 0; i < iterate; i++) {
    //create the swipper-slide div
    const cards = document.createElement('div')
    cards.classList.add('swiper-slide')
    cards.classList.add('cards')

    for (let j = 0; j < 6; j++) {
      //create the card div to display each card
      const { id, name, price, description, image_url } = datas[counter]
      const card = document.createElement('div')
      card.classList.add('card')
      card.id = id
      const cardText = document.createElement('div')
      cardText.classList.add('card_text')

      const itemTitle = document.createElement('h6')
      itemTitle.classList.add('item_title')
      itemTitle.innerHTML = `${name}`
      cardText.appendChild(itemTitle)

      const addItemWrapper = document.createElement('div')
      cardText.appendChild(addItemWrapper)

      const shoppingCart = document.createElement('i')
      shoppingCart.classList.add('fas')
      shoppingCart.classList.add('fa-shopping-cart')
      shoppingCart.setAttribute('id', 'add_item')
      addItemWrapper.appendChild(shoppingCart)

      // add clicked item to cart
      shoppingCart.addEventListener('click', (e) => {
        e.stopPropagation()
        addToCart({ id, name, price, description, image_url })
      })

      const priceSign = document.createElement('h6')
      priceSign.classList.add('price_sign')
      priceSign.innerHTML = `
            $
            <span id="price">
              ${price}
            </span>
        `
      addItemWrapper.appendChild(priceSign)

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
      cards.appendChild(card)
      arr.push(card)

      datas[counter]
      counter++
    }
    cardsWrapper.appendChild(cards)
  }
  swiper.update()
}

// showTags
function showTags(datas) {
  let tags = []
  datas.forEach((data) => {
    tagsArr.push(data.category)
    tags = tagsArr.filter(function (x, i, self) {
      return self.indexOf(x) === i
    })
  })
  tags.forEach((tag) => {
    const categories = document.querySelector('.categories')
    const btn = document.createElement('button')
    btn.classList.add('category')
    btn.innerText = `# ${tag}`
    categories.append(btn)
  })
}

// search item
const search = document.querySelector('.search')

search.addEventListener('input', function (e) {
  findItem(e.target.value)
})

function findItem(searchItem) {
  const filteredItems = responseData.filter((item) => {
    if (item.name.toLowerCase().includes(searchItem.toLowerCase())) {
      return item
    } else if (item.category.toLowerCase().includes(searchItem.toLowerCase())) {
      return item
    } else if (
      item.description.toLowerCase().includes(searchItem.toLowerCase())
    ) {
      return item
    } else {
      return
    }
  })
  showItems(filteredItems);
  // console.log(filteredItems);
}

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

const cart_items = document.querySelectorAll('#cart_items')

// change quantity
const quantityInputs = document.querySelectorAll('#cart_quantity')
for (let input of quantityInputs) {
  input.addEventListener('change', quantityChanged)
}

// click checkout
const checkout = document.querySelector('#cart_checkout')
checkout.addEventListener('click', function () {
  alert('Thank you for shopping with us!')
  while (cart_items.hasChildNodes()) {
    cart_items.removeChild(cart_items.firstChild)
  }
  updateCartQtyTotal()
})

// remove item from the cart
function removeCartItem(itemId) {

  //remove item from global array
  cartArr = cartArr.filter(product => product.id !== itemId)

  //remove item from each mobile/desktop cart_item div
  cart_items.forEach(() => {
    $("#"+ itemId).remove();
  })
  updateCartQtyTotal()
}


// change item quantity
function quantityChanged(e) {
  const inputNum = e.target
  if (isNaN(inputNum.value) || inputNum.value <= 0) {
    inputNum.value = 1
  }
  updateCartQtyTotal()
}

// get clicked item
function addToCart(data) {
  console.log(data.id)
  if (cartArr.length <= 0) cartArr.push(data)

  const findById = cartArr.find((e) => e.id === data.id)
  if (!findById) {
    cartArr.push(data)
  }
  addItemToCart(cartArr)
  updateCartQtyTotal()
}

// add clicked item to cart
function addItemToCart(arr) {
  //clear both containers first
  cart_items.forEach((clearEle) => (clearEle.innerHTML = ''))
  //iterate through array
  arr.forEach((product) => {
    //iterate through cart_items for laptop and mobile
    cart_items.forEach((ele) => {
      const cart = document.createElement('div')
      cart.classList.add('cart')
      cart.classList.add('cart_item')
      cart.id=product.id
      const cartUL = document.createElement('ul')

      cartUL.id = 'cart_item'
      cartUL.innerHTML = `
          <li id="cart_item_img">
            <img src="${product.image_url} alt="${product.name}">
          </li>
          <li id="cart_item_title">
            ${product.name}
          </li>
          <li>
            <input id="cart_quantity" type="number" value="1">
          </li>
          <li>
            $ <span id="cart_price">${product.price}</span>
          </li>
      `
      cart.appendChild(cartUL)
      const cart_trash = document.createElement('li')
      cartUL.appendChild(cart_trash)
      const span_trash = document.createElement('span')
      span_trash.addEventListener('click', () => removeCartItem(product.id))
      span_trash.innerHTML = `<span><i class="fas fa-times"></i></span>`
      cart_trash.appendChild(span_trash)

      cartUL.appendChild(cart_trash)
      ele.appendChild(cart)
    })
  })
}


function updateCartQtyTotal() {
  const carts = document.querySelectorAll('#cart_item')
  // const cart_totals = document.querySelectorAll(".cart_total");
  const cart_total_prices = document.querySelectorAll('#cart_total_price')
  // const sm_quantity = document.querySelector("#sm_quantity");

  let total = 0.0
  let quantity = 0
  let cart_total = 0.0

  for (cart of carts) {
    const priceEl = cart.querySelector("#cart_price");
    const quantityEl = cart.querySelector("#cart_quantity");

    // total += price * quantity / 2;
  }
    const price = parseFloat(priceEl.textContent);

    quantity = quantityEl.value

    total = price * quantity;

    // cart_total += total;
    // quantity += quantity;
    // document.querySelectorAll("#cart_total_price").innerText = `Total $ ${total}`;

    // totalPriceEl.innerText = `Total $ ${total}`;
  }

  // to show same quantities on laptop and mobile
  // const quantityEls = document.querySelectorAll("#cart_quantity");
  // if (quantityEls[0].value > quantityEls[1].value) {
  //   quantityEls[1].value = quantityEls[0].value;
  // } else if (quantityEls[1].value > quantityEls[0].value) {
  //   quantityEls[0].value = quantityEls[1].value;
  // }

  document.querySelectorAll("#sm_quantity").textContent = `${quantity}`;

  total = Math.round(total * 100) / 100
  // document.querySelectorAll("#cart_total_price").innerText = `Total $ ${total}`;

  for (cart_total_price of cart_total_prices) {

    cart_total_price.innerText = `Total $ ${total}`;
  }

 // to show same quantities on laptop and mobile
//  const quantityEls = document.querySelectorAll("#cart_quantity");
//  for (let quantityEl of quantityEls) {
//    quantityEl.addEventListener("change", function() {
//      quantityEl[0] = quantityEl[1];
//    });
//  } 
 // if (quantityEls[0].value > quantityEls[1].value) {
 //   quantityEls[1].value = quantityEls[0].value;
 // } else if (quantityEls[1].value > quantityEls[0].value) {
 //   quantityEls[0].value = quantityEls[1].value;
 // }

 // change quantity 
const quantityEls = document.querySelectorAll("#cart_quantity");
for (let quantityEl of quantityEls) {
  quantityEl.addEventListener("change", function() {
    quantityEl[0] = quantityEl[1];
  });
  // cart_total_price = total;
  // cart_total_price.innerText = `Total $ ${total}`;
  // console.log(cart_total_price);
  // total = total + cart_total_price;
  // console.log(document.querySelectorAll("#cart_total_price"));

  $('#cart-count').html(quantity)
}
