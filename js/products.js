//Pauta desafíate.
var productos = [];

function mostrarProductos(lista){
  const contenedor = document.getElementById("lista-productos");
  let contenido = "";

  if (lista.length === 0){
    contenedor.innerHTML = "<p>Sin resultados.</p>";
    return;
  }

lista.forEach((producto) => {
  contenido = contenido + `
  <div class="card" id="${producto.id}" style="cursor:pointer;">
  <img src="${producto.image}" class="card-img">
  <div class="card-info">
  <h3 class="card-title">${producto.name}</h3>
  <p class="card-description">${producto.description}</p>
  <p class="card-price">${producto.currency} ${producto.cost}</p>
  <p class="card-sold">Cantidad de vendidos: ${producto.soldCount}<br></p>
  </div>
  </div>
  `;
});
  contenedor.innerHTML = contenido;

  //código de la pauta 4 entrega 3
const tarjetas= Array.from(document.getElementsByClassName("card"));
tarjetas.forEach(tarjeta => {
  tarjeta.addEventListener("click",() => {
    const seleccion= tarjeta.id;
    localStorage.setItem("productoSeleccionado",seleccion);
    window.location.href="product-info.html";
  });
});
}

const categoriaID = localStorage.getItem("catID");
const urlProductos = `https://japceibal.github.io/emercado-api/cats_products/${categoriaID}.json`;

getJSONData(urlProductos).then(function(resultado){
  if (resultado.status === "ok") {
    productos = resultado.data.products;
    mostrarProductos(productos);
  }
});

document.getElementById("buscador").addEventListener("input", (event) => {
  let busqueda = event.target.value.toLowerCase();
  let filtrados= [];

  productos.forEach((producto) => {
    let nombreProducto= producto.name.toLowerCase();
    let descripcionProducto= producto.description.toLowerCase();

    if (nombreProducto.indexOf(busqueda) !==-1 || descripcionProducto.indexOf(busqueda) !==-1){
      filtrados.push(producto);
    }
  });
  mostrarProductos(filtrados);
});