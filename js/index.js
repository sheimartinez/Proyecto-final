document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
    
    // ACA CREAMOS LA PARTE DE DESAFIATE PARA QUE CUANDO ENTRES AL INDEX TE REDIRIJA AL LOGIN SI NO ESTAS REGISTRADO
    const usuarioLogeado = localStorage.getItem("usuarioLogeado");
    
    if (!usuarioLogeado) {
        window.location.href = "login.html"; 
    } else {
        console.log("Bienvenido " + usuarioLogeado);
    }
});