let globalData = []; // Store the fetched product data globally
let basket = JSON.parse(localStorage.getItem("localData")) || [];

// Fetch the product data
async function data() {
  try {
    let response = await fetch("https://fakestoreapi.com/products");
    let data = await response.json();
    globalData = data; // Assign the fetched data to globalData
    genrateCartItem(globalData); // Pass globalData to the cart generation function
  } catch {
    console.log("Data Not Found");
  }
}

data();

function genrateCartItem(data) {
  let cartContent = document.querySelector("#cartPage");
  if (basket.length !== 0) {
    cartContent.innerHTML = basket.map((itemData) => {
      let { id, item } = itemData;
      let search = data.find((res) => res.id === id) || []; // Use the globalData to search the product
      return `<div class="max-w-4xl mx-auto p-2">
          <div class="flex items-center justify-between bg-white p-4 shadow rounded-lg mb-3">
            <!-- Product Image -->
            <div class="flex items-center space-x-4">
              <img src="${search.image}" alt="Product Image" class="w-20 h-20 object-contain rounded-lg border p-2">
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
              <p class="text-lg font-semibold text-gray-800">$${item * search.price}</p>
            </div>
          </div>   
        </div>`;
    }).join("");
  } else {
    cartContent.innerHTML = `<div class="flex items-center">
      <h3 class="mb-0 mr-auto font-bold text-2xl">Opps Cart is Empty</h3>
      <a href="index.html" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Go Back</a>
    </div>
    <img src="../images/cart.svg" class="w-1/2 mx-auto object-contain opacity-20">`;
  }
}

function increment(id) {
  let search = basket.find((item) => item.id === id);
//   if (search === undefined) {
//     basket.push({ id, item: 1 });
//   } else {
//     search.item += 1;
//   }
search.item += 1;
  updateCart();
}

function decrement(id) {
  let search = basket.find((item) => item.id === id);
  if (search === undefined || search.item === 0) return;
  search.item -= 1;
  basket = basket.filter((item) => item.item !== 0); // Remove items with 0 quantity
  updateCart();
}

function updateCart() {
  genrateCartItem(globalData); // Use the stored globalData to update the cart
  cartCaluculation();
  localStorageData(basket);
}

function cartCaluculation() {
  let cartVal = document.querySelector("#cart_value");
  let totalItems = basket.reduce((acc, item) => acc + item.item, 0);
  cartVal.innerHTML = totalItems;
}

function localStorageData(data) {
  localStorage.setItem("localData", JSON.stringify(data));
}

function getUpdate(id) {
  let search = basket.find((item) => item.id === id);
  let quantity = document.getElementById(id);
  if (quantity) quantity.innerHTML = search.item;
}
