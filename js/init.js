const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL =
  "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

const usuarioLogeado = localStorage.getItem("usuarioLogeado");
const loginLink = document.getElementById("loginLink");

if (usuarioLogeado) {
  loginLink.textContent = usuarioLogeado;
}



document.addEventListener("DOMContentLoaded", () => {
  const loginItem = document.getElementById("login-item");
  const loginLink = document.getElementById("loginLink");
  const userProfileItem = document.getElementById("user-profile-item");
  const usernameText = document.getElementById("username-text");
  const navProfileImg = document.getElementById("nav-profile-img");
  const profileLink = document.getElementById("user-profile-link");

  const usuario = localStorage.getItem("usuarioLogeado");
  const profileImages = JSON.parse(localStorage.getItem("profileImages")) || {};

  if (usuario) {
    loginItem.style.display = "none";
    userProfileItem.style.display = "flex";

    usernameText.textContent = usuario;
    navProfileImg.src = profileImages[usuario] ? profileImages[usuario] : "img/default-profile.png";
    profileLink.href = "my-profile.html";
  } else {
    loginItem.style.display = "block";
    userProfileItem.style.display = "none";
    loginLink.href = "login.html";
  }
});




