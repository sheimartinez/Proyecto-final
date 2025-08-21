document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById ('loginForm');
const usuario = document.getElementById ('usuario');
const password = document.getElementById('password');

if (usuario.value==="" || password.value===""){
    alert ("Inválido");
}
});

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById('boton');
    
    boton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "http://127.0.0.1:5500/workspace-inicial-grupo5/";
    });
});
