$(function() {
  $('.toggle').click(function() {
    $(this).toggleClass('active');
    $('.menu').toggleClass('open');
  });
});

// api
const cards = document.querySelector('.cards');
let responseData = [];

getItems();

async function getItems() {
  const res = await axios.get('https://demo-api-project01.herokuapp.com/api/products');
  responseData = res.data
  showItems(responseData);
  showTags(responseData);
}

function showItems(datas) {
  cards.innerHTML = '';

  datas.forEach((data) => {
    const {name, price, description, image_url} = data;

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
  });
}

// show tags


// search item

// searching input
const search = document.querySelector('.search');

search.addEventListener('input', function(e) {
  findItem(e.target.value);
});

// search tag
const 

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


