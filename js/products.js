   // <!-- mostrar el listado de productos utilizando fetch-->
     fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
      .then(response => response.json())
      .then(data => {
        const productos = data.products;
        const contenedor = document.getElementById("lista-productos");

        productos.forEach(producto => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML =  `
       <img src="${producto.image}" class="card-img">
       <div class="card-info">
       <h3 class="card-title">${producto.name}</h3>
       <p class="card-description">${producto.description}</p>
       <p class="card-price">${producto.currency} ${producto.cost}</p>
       <p class="card-sold">Cantidad de vendidos: ${producto.soldCount}<br>
       </p>
       </div>
       `;
       contenedor.appendChild(card)
        });
      })
      .catch(error => {
        console.error("Error:", error);
      });

//Pauta desafíate.
var productos = [];

function mostrarProductos(lista){
  const contenedor = document.getElementById("lista-productos");
  let contenido = "";

  if (lista.length === 0){
    contenedor.innerHTML = "<p>Sin resultados.</p>";
    return;
  }


  for (let i=0; i < lista.length; i++){
    contenido= contenido + `
    <div class="card">
    <img src="${lista[i].image}" class="card-img">
    <div class="card-info">
    <h3 class="card-title">${lista[i].name}</h3>
    <p class="card-description">${lista[i].description}</p>
    <p class="card-price">${lista[i].currency} ${lista[i].cost}</p>
    <p class="card-sold">Cantidad de vendidos: ${lista[i].soldCount}<br></p>
    </div>
    </div>
    `;
  }
  contenedor.innerHTML = contenido;
}

getJSONData(PRODUCTS_URL + "101" + EXT_TYPE).then(function(resultado){
  if (resultado.status === "ok") {
    productos = resultado.data.products;
    mostrarProductos(productos);
  }
});

document.getElementById("buscador").addEventListener("input", (event) => {
  let busqueda = event.target.value.toLowerCase();
  let filtrados= [];

  for (let i=0; i < productos.length; i++){
    let nombreProducto= productos[i].name.toLowerCase();
    let descripcionProducto= productos[i].description.toLowerCase();

    if (nombreProducto.indexOf(busqueda) !==-1 || descripcionProducto.indexOf(busqueda) !==-1){
      filtrados.push(productos[i]);
    }
  }
mostrarProductos(filtrados);
});