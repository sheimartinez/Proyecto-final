var productos = []; //pauta desafiate
var productosFiltrados = [];

// aca es para filtrar por precio
function filtrarProductos() {
    let minimoInput = document.getElementsByClassName('minimo');
    let maximoInput = document.getElementsByClassName('maximo');

    let minInput= "";
    let maxInput= "";

    for (let i = 0; i < minimoInput.length; i++){
        if (minInput === "" && minimoInput[i].value !== ""){
            minInput = minimoInput[i].value;
        }
    }
    
    for (let i = 0; i < maximoInput.length; i++){
        if (maxInput === "" && maximoInput[i].value !== ""){
            maxInput = maximoInput[i].value;
        }
    }

    let minimo = 0;
    let maximo = 999999999;
    
    if (minInput !== "") {
        minimo = parseInt(minInput);
    }
    
    if (maxInput !== "") {
        maximo = parseInt(maxInput);
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
    const minimoLimpiar = document.getElementsByClassName('minimo');
    const maximoLimpiar = document.getElementsByClassName('maximo');
    const ordenLimpiar= document.getElementsByClassName('orden');

    for(let i = 0; i < minimoLimpiar.length; i++){
        minimoLimpiar[i].value = "";
    }

    for(let i = 0; i < maximoLimpiar.length; i++){
        maximoLimpiar[i].value = "";
    }

    for(let i = 0; i < ordenLimpiar.length; i++){
        ordenLimpiar[i].value = "precio-bajo";
    }
    
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
    const ordenAplicar = document.getElementsByClassName('orden');
    let tipoOrden = "precio-bajo";

    for(let i = 0; i< ordenAplicar.length; i++){
        if(ordenAplicar[i].offsetParent !== null && tipoOrden === "precio-bajo" && ordenAplicar[i].value !== ""){
            tipoOrden = ordenAplicar[i].value;
        }
    }
    
    let productosAMostrar= [];
    if (productosFiltrados.length > 0) {
        for(let i=0; i < productosFiltrados.length; i++){
        productosAMostrar.push(productosFiltrados[i]);
    }
    } else {
        for(let i=0; i<productos.length; i++){
        productosAMostrar.push(productos[i]);
    }
    }
    
    // aca usamos sort para ordenar
    if (tipoOrden === 'precio-bajo') {
        productosAMostrar.sort(function(a, b) {
            return a.cost - b.cost; // por las dudas marco que aca es de menor a mayor
        });
    } 
    else if (tipoOrden === 'precio-alto') {
        productosAMostrar.sort(function(a, b) {
            return b.cost - a.cost; // y aca de mayor a menor
        });
    }
    else if (tipoOrden === 'mas-vendidos') {
        productosAMostrar.sort(function(a, b) {
            return b.soldCount - a.soldCount; // con esto nos fijamos los mas vendidos 
        });
    }
    
    mostrarProductos(productosAMostrar);
}


//pauta desafiate
function mostrarProductos(lista){
  const contenedor = document.getElementById("lista-productos");
  let contenido = "";

  if (!lista || lista.length === 0){
    contenedor.innerHTML = "<p>Sin resultados.</p>";
    return;
  }

lista.forEach((producto) => {
  contenido = contenido + `
  <div class="card" id="${producto.id}" data-aos="flip-right" style="cursor:pointer;">
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
  AOS.refresh();

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
const token = localStorage.getItem("token");
const urlProductos = `http://localhost:3000/cats_products/${categoriaID}`;

if (categoriaID && token) {
    fetch(urlProductos, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        productos = data.products;
        productosFiltrados = [...productos];
        mostrarProductos(productos);

        const texto = document.getElementById("textoCategoria");
        if(texto) texto.innerHTML = `Aquí verás todos los productos disponibles de la categoría ${data.catName}`;
    })
    .catch(error => 
        console.error("Error al cargar los productos:", error)
    );
}

const buscar= document.getElementsByClassName("barraBuscador");

for(let i=0; i < buscar.length; i++){
buscar[i].addEventListener("input", (event) => {
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

  if (productosFiltrados.length === 0) {
    mostrarProductos([]);
    return;
  }

  aplicarOrdenamiento();
});
}