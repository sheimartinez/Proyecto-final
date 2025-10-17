document.addEventListener("DOMContentLoaded", function (){
    const boton = document.getElementById("modoBtn");
    const icono = document.getElementById("iconoModo");

    const modoOscuroGuardado = localStorage.getItem("modoOscuro");

    if(modoOscuroGuardado === "true"){
        document.body.classList.add("modo-oscuro");
        icono.classList.remove("fa-moon");
        icono.classList.add("fa-sun");
    }

    boton.addEventListener("click", function(){
        const clasesPagina= document.body.className;
        /*si está en modo oscuro lo saco*/
        if(clasesPagina.indexOf("modo-oscuro") !== -1){
            document.body.classList.remove("modo-oscuro");
            icono.classList.remove("fa-sun");
            icono.classList.add("fa-moon");
            localStorage.setItem("modoOscuro", "false");
        } else {
            /*si no está en modo oscuro lo pongo*/
            document.body.classList.add("modo-oscuro");
            icono.classList.remove("fa-moon");
            icono.classList.add("fa-sun");
            localStorage.setItem("modoOscuro", "true");
        }
    });
});