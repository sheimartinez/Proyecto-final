document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById ('loginForm');
const usuario = document.getElementById ('usuario');
const password = document.getElementById('password');
const boton = document.querySelector("form button[type='button']");

  boton.addEventListener("click", function () {
    if (usuario.value === "" || password.value === "") {
      alert("Inválido");
    } else {
      window.location.href = "index.html";
    }
  })
});