var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

function displayCollectionName (name) {
  document.getElementById("collectionName").value = name;
}

async function searchAPI() {
  let response = null;
  let json = null;
  let arr = [];
  let offset = 0;
  do {
    response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections?offset=${offset}&limit=200`, {});
    json = await response.json();
    for(let i = 0; i < json.length; i++){
      arr.push(json[i]);
    }

    offset += 200;
  } while (200 === json.length);

  console.log(arr);
  return arr;
}

async function query(){
  let collections = await searchAPI();
  let index = 0;
  let input = document.getElementById("collectionName");

  input.onkeyup = function() {
    index = 0;
    document.getElementById("collectionList").innerHTML = null;
    text = document.getElementById("collectionName").value;   
    for (let i = 0; i < collections.length; i++){
      if(collections[i].symbol.toLowerCase().startsWith(text.toLowerCase()) && index < 5 && text != null){
        document.getElementById("collectionList").innerHTML += `<p class="element" id="${collections[i].symbol}" onClick="displayCollectionName(this.id)">${collections[i].symbol}</p>`;
        index++;
      }
    }
  }
}

function checkSubmit() {
  let text = null;
  let interval = null;
  document.getElementById('submit').addEventListener("click", function() {
    document.getElementById("listings").innerHTML = null;
    listings = [];
    document.getElementById("stats").innerHTML = null;
    clearInterval(interval);
    text = document.getElementById("collectionName").value; 
    displayStats(text);
    interval = setInterval(searchListings, 1000, text);
  });
}

async function searchListings(text) {
  response = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${text}/listings?offset=0&limit=1`, {});
  json = await response.json();

  if (JSON.stringify(json) != JSON.stringify(listings[listings.length-1])){
    listings.push(json);searchListings
    getImage(json[0].tokenMint, json[0].price);
  }
}

async function getImage(mintAddress, price) {
  response = await fetch(`https://api-mainnet.magiceden.dev/v2/tokens/${mintAddress}`, {});
  json = await response.json();
  document.getElementById("listings").innerHTML += `<tr id="listingRow"><td><img src="${json.image}" id="nft"></td><td style="font-size:30px" >${price}</td><td><a href="https://magiceden.io/item-details/${mintAddress}" target="_blank"/><button id="page" style="font-size:30px">Go to page</button></a></td></tr>`;
}

async function displayStats(text){
  response = await fetch(`https://api-devnet.magiceden.dev/v2/collections/${text}/stats`, {});
  json = await response.json();
  for(property in json){
    document.getElementById('stats').innerHTML += `<tr><td>${property.toUpperCase()}:</td><td>${json[property]}</td></tr>`;
  }
}

let imageUrl;
let listings = [];
checkSubmit();
query();

