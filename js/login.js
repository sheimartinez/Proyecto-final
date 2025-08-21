// declaramos las constantes para trabajar mejor //
document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById ('loginForm');
const usuario = document.getElementById ('usuario');
const password = document.getElementById('password');
const boton = document.querySelector("form button[type='button']");

// Código para que al darle al botón nos redireccione a la portada 
// y salte una alerta si los campos están vacíos //
  boton.addEventListener("click", function () {
    if (usuario.value === "" || password.value === "") {
      alert("Inválido");
    } else {
      window.location.href = "index.html";
    }
  })
});