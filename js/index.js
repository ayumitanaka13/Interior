$(function () {
  $('.toggle').click(function () {
    $(this).toggleClass('active')
    $('.menu').toggleClass('open')
  })
})

$('.shopping-cart').click(function () {
  $(this).toggleClass('on')
  $('.cart').slideToggle()
  if (!$('#theModal').is(':visible')) {
    $('#theModal').show()
  } else {
    $('#theModal').hide()
  }
})

// page slide
const swiper = new Swiper('.swiper-container', {
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true,
  },
})

// ----------------------------- api --------------------------------
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
  const apiData = datas
  const size = 6
  const cardsWrapper = document.querySelector('.swiper-wrapper')
  cardsWrapper.innerHTML = ''

  const chunkedArr = new Array(Math.ceil(apiData.length / size))
    .fill('')
    .map(function () {
      return this.splice(0, size)
    }, apiData.slice())

  console.log(chunkedArr)


  chunkedArr.forEach((box, index) => {

    const cards = document.createElement('div')
    cards.classList.add('swiper-slide')
    cards.classList.add('cards')

    box.forEach((item, index) => {
      const { id, name, price, description, image_url } = item;
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
    })

    cardsWrapper.appendChild(cards)
  })
  swiper.update()
}

// showTags
function showTags(datas) {
  let tags = [];
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

  const tagButtons = document.querySelectorAll('.category');
  for (let tagBtn of tagButtons) {
    const clickedTag = tagBtn.innerText.replace('#', '').trim();
    tagBtn.addEventListener('click', function(e) {
      const clickedTag = e.target.innerText.replace('#', '').trim();
      console.log(clickedTag);
      findItem(clickedTag);
    })    
  }
}

// search item
const search = document.querySelector('.search')
search.addEventListener('input', function (e) {
  findItem(e.target.value);
})

function findItem(searchItem) {
  const filteredItems = responseData.filter((item) => {
    if (item.name.toLowerCase().includes(searchItem.toLowerCase())) {
      return true
    } else if (item.category.toLowerCase().includes(searchItem.toLowerCase())) {
      return true
    } else if (
      item.description.toLowerCase().includes(searchItem.toLowerCase())
    ) {
      return true
    } else {
      return false
    }
  })
  showItems(filteredItems)
}


// --------------------------- cart function ----------------------------

const cart_items = document.querySelectorAll('#cart_items')

// change quantity
const quantityInputs = document.querySelectorAll('#cart_quantity')
for (let input of quantityInputs) {
  input.addEventListener('change', () => quantityChanged(product.id))
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
  cartArr = cartArr.filter((product) => product.id !== itemId)

  //remove item from each mobile/desktop cart_item div
  cart_items.forEach(() => {
    $('#' + itemId).remove()
  })
  updateCartQtyTotal()
}

// change item quantity
function quantityChanged(itemId) {
  const inputNum = e.target
  if (isNaN(inputNum.value) || inputNum.value <= 0) {
    inputNum.value = 1
  }
  updateCartQtyTotal()
}

// get clicked item
function addToCart(data) {
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
      cart.id = product.id
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
      cart_trash.appendChild(span_trash);

      // const quantityInputs = document.querySelector('#cart_quantity');
      // quantityInputs.addEventListener('change', () => quantityChanged(product.id));
  
      cartUL.appendChild(cart_trash)
      ele.appendChild(cart)
    })
  })
}

function updateCartQtyTotal() {
  const carts = document.querySelectorAll('#cart_item')
  const cart_total_prices = document.querySelectorAll('#cart_total_price')

  let total = 0.0
  let quantity = 0
  // let cart_total = 0.0

  for (cart of carts) {
    const priceEl = cart.querySelector('#cart_price')
    const quantityEl = cart.querySelector('#cart_quantity')

    const price = parseFloat(priceEl.textContent)
    
    quantity = quantityEl.value;
    console.log(quantity);

    total += price * quantity;
  }

  total = Math.round(total * 100) / 100 /2;

  for (cart_total_price of cart_total_prices) {
    cart_total_price.innerText = `Total $ ${total}.00`
  }

  $('#cart-count').html(quantity)
}