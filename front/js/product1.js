// // Recup json
// // http://localhost:3000/api/products
let singleProductData = [];
// Recupération de l'ID dans url
let currentPage = window.location.href;
let url = new URL(currentPage);
let urlIdProduct = url.searchParams.get("id");
// console.log(urlIdProduct);

// // Demande à l'API d'aller chercher le produit
const fetchSingleProduct = async () => {
  await fetch("http://localhost:3000/api/products/" + urlIdProduct)
    .then((res) => res.json())
    // .then((data)=> console.log(data))
    .then((data) => (singleProductData = data));
  // console.log(singleProductData);
  // console.log(singleProductData.colors);
};

// //demander à l'API d'afficher LE produit sur la page
const singleProductDisplay = async () => {
  await fetchSingleProduct();

  //image à récupérer :
  // console.log(singleProductData.imageUrl);
  // console.log(singleProductData.altTxt);
  document.getElementById("item__img").innerHTML +=
    "<img src =" +
    singleProductData.imageUrl +
    " alt=" +
    singleProductData.altTxt +
    ">";

  //Nom à récupérer :
  // console.log(singleProductData.name);
  document.getElementById("title").innerHTML += singleProductData.name;

  //Prix à récupérer
  // console.log(singleProductData.price);
  document.getElementById("price").innerHTML += singleProductData.price + " ";

  //Description à récupérer
  // console.log(singleProductData.description);
  document.getElementById("description").innerHTML +=
    singleProductData.description;

  // Couleurs à récupérer
  //console.log(singleProductData.colors);
  //console.log(singleProductData.colors.length);
  let colorList = singleProductData.colors;

  colorList.forEach((color, i) => {
    document.getElementById("colors").innerHTML +=
      "<option value=" +
      singleProductData.colors[i] +
      ">" +
      singleProductData.colors[i] +
      "</option>";
  });
};
singleProductDisplay();

// Création du panier
const addToCartBtn = document.getElementById("addToCart");
let amountOfItems = document.getElementById("quantity");
let colorPicked = document.getElementById("colors");

///////////////////// Ajout d'un produit dans le panier//////////////////

addToCartBtn.addEventListener("click", (e) => {
  checkQuantity();
});

//////////////////// Verifier quantité /////////////////////////////////
const checkQuantity = () => {
  //console.log(amountOfItems.value);
  let a = amountOfItems.value;
  console.log(a);
  //vérification + Stokage de la quantité
  if (a == 0 || a >= 100) {
    console.log("Vous devez ajouter une quantité (entre 1 et 100)");
  } else {
    //Recupération de la quantité selectionnée
    checkColor();
    //console.log(a);
    //console.log(typeof a);
  }
};

/////////////////////// Verfifier la couleur /////////////////////////////
const checkColor = () => {
  if (colorPicked.value == "") {
    console.log("Vous devez selectioner une couleur");
  } else {
    //Recupération de la couleur selectionnée
    colorPicked = colors.value;
    console.log("couleur: " + colorPicked);
    // Couleur & Quantité Ok
    addItemToCart();
  }
};

//////////////////////Initialisation local storage ///////////////////////

function addItemToCart() {
  let product = {
    itemId: singleProductData._id,
    itemPicture: singleProductData.imageUrl,
    itemAltText: singleProductData.altTxt,
    itemName: singleProductData.name,
    itemPrice: singleProductData.price,
    itemDescription: singleProductData.description,
    itemColor: colorPicked,
    itemAmount: Number(amountOfItems.value),
  };

  //LOCAL STORAGE .Parse transforme les objets du Localstorage en objets JSON
  let itemsInCart = JSON.parse(localStorage.getItem("item"));
  //console.log(itemsInCart);

  //s'il y a déjà des produits dans le panier
  if (itemsInCart) {
    // recherche de la même référence avec la même couleur
    const sameProduct = itemsInCart.find(
      (element) => element.itemId === urlIdProduct && element.itemColor === colorPicked);

      if (sameProduct) {
        console.log("MAJ quantité avec id + couleur identique");

        //alors on cherche les quantités
        console.log("la quantité à ajouter" + product.itemAmount)
        console.log("la quantité trouvée dans le panier: " + sameProduct.itemAmount)
        // change le type de valeurs en Nombres
        
        let updateQuantity =  Number(product.itemAmount) + Number(sameProduct.itemAmount);
        console.log(updateQuantity);
        //On met à jour la nouvelle quantité
        sameProduct.itemAmount = updateQuantity;
        localStorage.setItem("item", JSON.stringify(itemsInCart));
        console.log(itemsInCart);
        
      } else {
      itemsInCart.push(product);
      localStorage.setItem("item", JSON.stringify(itemsInCart));
      console.log("On ajoute le produit dans le panier");
      }
    //s'il n'y a pas déjà des produits dans le panier
  } else {
    //création de la clé
    itemsInCart = [];
    itemsInCart.push(product);
    localStorage.setItem("item", JSON.stringify(itemsInCart));
    //console.log(itemsInCart);
  }
}
