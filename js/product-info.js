//parte 4 de entrega 3
const productoId= localStorage.getItem("productoSeleccionado");

if (!productoId){
    alert("No has seleccionado ningún producto");
} else{
    const urlProducto= PRODUCT_INFO_URL + productoId + EXT_TYPE;
                        

    getJSONData(urlProducto).then(function(resultado){
        if (resultado.status === "ok") {
            console.log("Producto cargado", resultado.data);
                    mostrarProducto(resultado.data);
                }
            });
        }  

function mostrarProducto(producto){
    const contenedor= document.getElementById("lista-productos");

    let imagenesProductos = "";
    producto.images.forEach(imagen => {
        imagenesProductos = imagenesProductos +
        `<img src="${imagen}" style= "max-width:200px; margin:5px;">`;
    });
    contenedor.innerHTML= `
    <div class="detalles-producto">
    <h2>${producto.name}</h2><br>
    <p><strong>Descripción: </strong>${producto.description}</p>
    <p><strong>Categoría: </strong>${producto.category}</p>
    <p><strong>Cantidad de vendidos: </strong>${producto.soldCount}</p>
    <div class="imagen-producto">${imagenesProductos}</div>
    </div>
    `;
}