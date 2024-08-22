let globalData = [];
let basket = JSON.parse(localStorage.getItem("localData")) || [];

async function data() {
  try {
    let response = await fetch("https://fakestoreapi.com/products");
    let data = await response.json();
    globalData = data;
    genrateCartItem(globalData);
    getTotalPrice(globalData);
  } catch {
    console.log("Data Not Found");
  }
}

// cart page
let cartCaluculation = () => {
  let cartVal = document.querySelector("#cart_value");
  let getBasketItem = basket.map((val) => {
    return val.item;
  });

  let calVal = getBasketItem.reduce((acc, curVal) => {
    return acc + curVal;
  }, 0);
  // console.log(calVal);

  cartVal.innerHTML = calVal;
};
cartCaluculation();

let genrateCartItem = (data) => {
  let response = data;
  let cartContent = document.querySelector("#cartPage");
  // console.log("cart Item",response);
  // let getCartData = basket.map((getId))
  if (basket.length !== 0) {
    cartContent.innerHTML = basket
      .map((data) => {
        // console.log("cart data ",data)
        let { id, item } = data;
        let search = response.find((res) => res.id === id) || [];
        //  console.log("search",search)
        return `
          
          <div class="max-w-4xl mx-auto p-2 relative">
            <button class="absolute right-5" onclick="removeItem(${id})">X</button>
          <div class="flex items-center justify-between bg-white p-4 shadow rounded-lg mb-3">
            <!-- Product Image -->
            <div class="flex items-center space-x-4">
              <img src="${
                search.image
              }" alt="Product Image" class="w-20 h-20 object-contain rounded-lg border p-2">
              <div>
                <h3 class="text-lg font-semibold">${search.title}</h3>
                <p class="text-gray-500">${search.description}</p>
              </div>
            </div>
        
            <!-- Quantity and Price -->
            <div class="flex items-center space-x-6">
              <div class="flex items-center space-x-2">
                <button onclick="decrement(${id})" type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-1 px-3 rounded">-</button>
                <div id="${id}">${item}</div>
                <button onclick="increment(${id})" class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-1 px-3 rounded">+</button>
              </div>
              <p class="text-lg font-semibold text-gray-800">$${
                item * search.price
              }</p>
            </div>
          </div>   
        </div>`;
      })
      .join("");
  } else {
    cartContent.innerHTML = `<div class="flex items-center">
      <h3 class="mb-0 mr-auto font-bold text-2xl">Opps Cart is Empty</h3>
       <a href="index.html" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Go Back</a>
     </div>
     <img src="../images/cart.svg" class="w-1/2 mx-auto object-contain opacity-20">
     `;
  }
};

data();

function increment(id) {
  let selectItem = id;
  // console.log(selectItem)
  let search = basket.find((getId) => getId.id === id);
  if (search === undefined) {
    basket.push({
      id,
      item: 1,
    });
  } else {
    search.item += 1;
  }
  getUpdate(selectItem);
  cartCaluculation();
  genrateCartItem(globalData);
  getTotalPrice(globalData);
  localStorageData(basket);
}

let decrement = (id) => {
  let selectItem = id;
  // console.log(selectItem)
  let search = basket.find((getId) => getId.id === id);
  // console.log(search)
  if (search == undefined) {
    return;
  } else if (search.item === 0) {
    return;
  } else {
    search.item -= 1;
  }

  getUpdate(selectItem);
  cartCaluculation();
  genrateCartItem(globalData);
  basket = basket.filter((x) => x.item !== 0);
  getTotalPrice(globalData);
  localStorageData(basket);
};

function localStorageData(data) {
  localStorage.setItem("localData", JSON.stringify(data));
}

function getUpdate(id) {
  let search = basket.find((item) => item.id === id);
  let quatity = document.getElementById(id);
  // console.log(quatity);
  quatity.innerHTML = search.item;
  cartCaluculation();
  getTotalPrice(globalData);
}

let removeItem = (id) => {
  basket = basket.filter((getdata) => getdata.id !== id);

  localStorageData(basket);
  genrateCartItem(globalData);
  getTotalPrice(globalData);
  cartCaluculation();

};

function clearAllItems() {
  basket = [];
  localStorageData(basket);
  genrateCartItem(globalData);
  getTotalPrice();
  cartCaluculation();
}

let getTotalPrice = (data) => {
  let price = document.querySelector("#totalprice");
  let resposnse = data;
  if (basket.length !== 0) {
    let total = basket
      .map((data) => {
        let { id, item } = data;
        let res = resposnse.find((data) => data.id === id) || [];
        return res.price * item;
      })
      .reduce((acc, curr) => acc + curr, 0);
    console.log("total", total);
    price.innerHTML = `
      
      <div class="flex justify-between items-center">
                <p class="text-xl font-bold">Total</p>
                <p class="text-xl font-semibold text-gray-800" >$ ${total}</p>
              </div>
              
            <div class="flex space-x-4 mt-3">
  <!-- Danger Button -->
  <button onclick="clearAllItems()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-1">
    Clear Items
  </button>

  <!-- Checkout Button -->
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1">
    Checkout
  </button>
</div>
      `;
  } else {
    price.innerHTML = `<div class="flex justify-between items-center">
        <p class="text-xl font-bold">Total</p>
        <p class="text-xl font-semibold text-gray-800">$ 0.00</p>
      </div>`;
  }
};

getTotalPrice();
