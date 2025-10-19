// declaramos las constantes para trabajar mejor //
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('loginForm');
    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    const boton = document.getElementById('boton');


    boton.addEventListener("click", (e) => {
        e.preventDefault();

        if (usuario.value === "" || password.value === "") {
        alert("Inválido");
    }

    if (usuario.value.indexOf("@") === -1 || usuario.value.indexOf(".") === -1) {
    alert("Por favor ingrese un email válido.");
    return;
}
localStorage.setItem("usuarioLogeado", usuario.value); // esta parte me re complico porue era lo que faltaba para ir al index.html nuevamente

window.location.href = "index.html";
});
});