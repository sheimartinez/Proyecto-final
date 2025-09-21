var productos = [];
var productosFiltrados = [];

// aca es para filtrar por precio
function filtrarProductos() {
    let minimoInput = document.getElementById('minimo').value;
    let maximoInput = document.getElementById('maximo').value;
    
    let minimo = 0;
    let maximo = 999999999;
    
    if (minimoInput !== "") {
        minimo = parseInt(minimoInput);
    }
    
    if (maximoInput !== "") {
        maximo = parseInt(maximoInput);
    }
    
    // filtrar productos
    productosFiltrados = [];
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].cost >= minimo && productos[i].cost <= maximo) {
            productosFiltrados.push(productos[i]);
        }
    }
    
    aplicarOrdenamiento();
}

// como lo dice esto es lo que pedia para limpiar filtros
function limpiarFiltros() {
    document.getElementById('minimo').value = '';
    document.getElementById('maximo').value = '';
    document.getElementById('orden').value = 'precio-bajo';
    
    productosFiltrados = [];
    for (let i = 0; i < productos.length; i++) {
        productosFiltrados.push(productos[i]);
    }
    
    aplicarOrdenamiento();
}

// funcion para ordenar productos
function ordenarProductos() {
    aplicarOrdenamiento();
}

// y con esta funcion puedo aplicar sort
function aplicarOrdenamiento() {
    const tipoOrden = document.getElementById('orden').value;
    
    let productosAMostrar;
    if (productosFiltrados.length > 0) {
        productosAMostrar = productosFiltrados;
    } else {
        productosAMostrar = productos;
    }
    
    // esto es una copia del array porque si no se modifica el original y no se puede volver atras
    let productosCopia = [];
    for (let i = 0; i < productosAMostrar.length; i++) {
        productosCopia.push(productosAMostrar[i]);
    }
    
    // aca usamos sort para ordenar
    if (tipoOrden === 'precio-bajo') {
        productosCopia.sort(function(a, b) {
            return a.cost - b.cost; // por las dudas marco que aca es de menor a mayor
        });
    } 
    else if (tipoOrden === 'precio-alto') {
        productosCopia.sort(function(a, b) {
            return b.cost - a.cost; // y aca de mayor a menor
        });
    }
    else if (tipoOrden === 'mas-vendidos') {
        productosCopia.sort(function(a, b) {
            return b.soldCount - a.soldCount; // con esto nos fijamos los mas vendidos 
        });
    }
    
    mostrarProductos(productosCopia);
}


// este es la correccion que hicimos de la entrega 1 

function mostrarProductos(lista){
  const contenedor = document.getElementById("lista-productos");
  let contenido = "";

  if (lista.length === 0){
    contenedor.innerHTML = "<p>Sin resultados.</p>";
    return;
  }

  for (let i=0; i < lista.length; i++){
    contenido = contenido + `
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
   
    for (let i = 0; i < productos.length; i++) {
        productosFiltrados.push(productos[i]);
    }
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
  
  // aca actualizamos los productos filtrados y aplicamos el ordenamiento
  productosFiltrados = filtrados;
  aplicarOrdenamiento();
});