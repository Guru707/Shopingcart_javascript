let shop = document.querySelector("#shop");

async function data() {
  try {
    let response = await fetch("https://fakestoreapi.com/products");
    let data = await response.json();
    getDataSho(data);
  } catch {
    console.log("Data Not Found");
  }
}

let basket = JSON.parse(localStorage.getItem("localData")) || [];

let getDataSho = (data) => {
  // Ensure 'data' is an array before proceeding
  if (!Array.isArray(data)) {
    console.log("Invalid data format");
    return;
  }

  return (shop.innerHTML = data
    .map((item) => {
      let { id, image, category, title, description, price } = item;
      let search = basket.find((getItem) => getItem.id === id) || { item: 0 }; // Provide default value for 'search'

      return `<div id="data-${id}" class="border rounded border-2 mb-3">
                <figure class="product-img"><img src="${image}" class=""></figure>
                <div class="p-3">
                  <p class="bold capitalize ">${category}</p>
                  <h5 class="font-semibold  ">${title}</h5>
                  <p>${description}</p>
                  <div class="flex items-center mt-3">
                    <div><h3 class="text-xl font-bold price">$${price}</h3></div>
                    <div class="flex items-center ml-auto">
                      <div class="decrease p-2" onclick="decrement(${id})"><i class="fa-solid fa-minus"></i></div>
                      <div class="quantity p-2" id="${id}">${search.item}</div>
                      <div class="increase p-2" onclick="increment(${id})"><i class="fa-solid fa-plus"></i></div>
                    </div>
                  </div>
                </div>
              </div>`;
    })
    .join(""));
};

let increment = (id) => {
  let search = basket.find((getId) => getId.id === id);
  
  if (search === undefined) {
    basket.push({
      id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  getUpdate(id);
  cartCalculation();
  localStorageData(basket);
};

let decrement = (id) => {
  let search = basket.find((getId) => getId.id === id);

  if (search === undefined || search.item === 0) return;

  search.item -= 1;
  if (search.item === 0) {
    basket = basket.filter((x) => x.id !== id);
  }

  getUpdate(id);
  cartCalculation();
  localStorageData(basket);
};

let localStorageData = (data) => {
  localStorage.setItem("localData", JSON.stringify(data));
};

let getUpdate = (id) => {
  let search = basket.find((item) => item.id === id);
  let quantity = document.getElementById(id);
  if (search && quantity) {
    quantity.innerHTML = search.item;
  }
};

let cartCalculation = () => {
  let cartVal = document.querySelector("#cart_value");
  let totalItems = basket.reduce((acc, cur) => acc + cur.item, 0);

  cartVal.innerHTML = totalItems;
};

cartCalculation();
data(); 
