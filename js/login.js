document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('loginForm');
    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    const boton = document.getElementById('boton');

 
    boton.addEventListener("click", (e) => {
        e.preventDefault(); 

        if (usuario.value === "" || password.value === "") {
            alert("Inválido");
        } else {
            localStorage.setItem("usuarioLogeado", usuario.value); // esta parte me re complico porue era lo que faltaba para ir al index.html nuevamente

            window.location.href = "index.html";
        }
    });
});
