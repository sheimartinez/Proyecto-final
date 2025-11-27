// declaramos las constantes para trabajar mejor //
document.addEventListener("DOMContentLoaded", () => {
    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    const boton = document.getElementById('boton');


    boton.addEventListener("click", (e) => {
        e.preventDefault();

        if (usuario.value === "" || password.value === "") {
        Swal.fire({
            icon: 'error',
            title:'Inválido',
            text: 'Por favor completa todos los campos',
            confirmButtonText: "OK"
        });
        return;
    }

    if (usuario.value.indexOf("@") === -1 || usuario.value.indexOf(".") === -1) {
    Swal.fire({
        icon: 'warning',
        title: 'Email inválido',
        text: 'Por favor ingrese un email válido',
        confirmButtonText: "OK"
    });
    return;
}
localStorage.setItem("usuarioLogeado", usuario.value); // esta parte me re complico porue era lo que faltaba para ir al index.html nuevamente

window.location.href = "index.html";
});
});