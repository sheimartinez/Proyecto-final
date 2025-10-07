var productos = []; //pauta desafiate
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


//pauta desafiate
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

  
  // aca actualizamos los productos filtrados y aplicamos el ordenamiento
  productosFiltrados = filtrados;
  aplicarOrdenamiento();
});