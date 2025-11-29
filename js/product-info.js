//parte 4 de entrega 3
const productoId= localStorage.getItem("productoSeleccionado");

if (!productoId){
    alert("No has seleccionado ningún producto");
} else{
    const urlProducto= PRODUCT_INFO_URL + "/" + productoId;
                        

    getJSONData(urlProducto).then(function(resultado){
        if (resultado.status === "ok") {
            console.log("Producto cargado", resultado.data);
                    mostrarProducto(resultado.data);
                }
            }); 

//parte 2 de entrega 4
const urlComentarios= PRODUCT_INFO_COMMENTS_URL + "/" + productoId;
getJSONData(urlComentarios).then(function(resultado){
    if (resultado.status === "ok"){
        console.log("Comentarios cargados", resultado.data);
        mostrarComentarios(resultado.data);
    }
});
} //

//función para la pauta Desafiate de la entrega 6
function guardarProducto(producto){
   const carrito = JSON.parse(localStorage.getItem("cartItems")) || [];
   
   const productoGuardado = {
    nombre: producto.name,
    precio: producto.currency + " " + producto.cost,
    imagen: producto.images[0],
    cantidad: 1
};

   let existe = false //supongo que el carrito está vacío

   carrito.forEach((producto) => {
    if (producto.nombre === productoGuardado.nombre) {
        producto.cantidad += 1;
        existe = true;
    }
});

if (!existe){
    carrito.push(productoGuardado);
}

localStorage.setItem("cartItems", JSON.stringify(carrito)); //convierto el objeto a texto para el localStorage
}

//modificación de la función para el carrusel de la entrega 4
function mostrarProducto(producto){
    const nombreProducto= document.getElementById("nombreProducto");
    const precioProducto= document.getElementById("precioProducto");
    const descripcionProducto= document.getElementById("descripcionProducto");
    const categoriaProducto= document.getElementById("categoriaProducto");
    const cantidadVendidos = document.getElementById("vendidosProducto");
    const imgProducto = document.getElementById("imagenProducto");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const btnAnterior = document.getElementById("btnAnterior");

    nombreProducto.innerHTML = producto.name;
    precioProducto.innerHTML = producto.currency + " " + producto.cost;
    descripcionProducto.innerHTML = producto.description;
    categoriaProducto.innerHTML = producto.category;
    cantidadVendidos.innerHTML = producto.soldCount;

    let posicionImagen = 0;
    imgProducto.src = producto.images[posicionImagen];
    
    btnSiguiente.addEventListener("click", () => {
        posicionImagen++;
        if (posicionImagen >= producto.images.length) {
            posicionImagen = 0;
        }

        imgProducto.src = producto.images[posicionImagen];
    });

    btnAnterior.addEventListener("click", () => {
        posicionImagen--;
        if (posicionImagen < 0) {
            posicionImagen = producto.images.length -1;
        }
        imgProducto.src = producto.images[posicionImagen];
    });

    mostrarRelacionados(producto.relatedProducts);

    //pauta 2 entrega 6 - botones
const buy = document.getElementById('buy')
const cart = document.getElementById('cart')

buy.addEventListener ('click', () => {
    guardarProducto(producto);
    window.location.href="cart.html";
});

cart.addEventListener ('click', () => {
    guardarProducto(producto);

//mensaje de exito
Swal.fire({
  position: "top-end",
  icon: "success",
  title: "El producto fue añadido correctamente al carrito",
  showConfirmButton: false,
  timer: 1500
});

});

}

//parte 2 de entrega 4
function mostrarComentarios(comentarios){
    const contenedor= document.getElementById("lista-comentarios");
    let contenidoComentarios= "";
    comentarios.forEach(comment => {
        //creo las estrellas con el puntaje
        let estrellas="";
        for (let i=1; i<=5; i++){
            if (i<= comment.score){
                estrellas= estrellas+ '<span class="fa fa-star checked"></span>';
            } else {
                estrellas= estrellas+ '<span class="fa fa-star"></span>';
            }
        }
        contenidoComentarios= contenidoComentarios + `
        <div class="border p-2 mb-2">
        <div class="d-flex justify-content-between align-items-center">
        <strong>${comment.user}</strong>
        <small class="fecha text-muted">${comment.dateTime}</small>
        </div>

        <div>
        <small>${estrellas}</small>
        </div>

        <p class="mt-2 mb-0">
        ${comment.description}
        </p>
        </div>
        `;   
    });
    contenedor.innerHTML = contenidoComentarios;
}

function mostrarRelacionados(relacionados) {
    const contenedor = document.getElementById("productos-relacionados");

    contenedor.innerHTML = "";

    if (relacionados == null || relacionados.length === 0) {
        contenedor.innerHTML = `<p>No hay productos relacionados</p>`;
    } else {
        relacionados.forEach(relacionado => {
            getJSONData(PRODUCT_INFO_URL + "/" + relacionado.id).then(resultado => {
                if (resultado.status === "ok") {
                    const productoRelacionado = resultado.data;
                    
                    contenedor.innerHTML += `
                    <div class="card mx-3" id="${productoRelacionado.id}" style="cursor:pointer;">
                    <img src="${productoRelacionado.images[0]}" class="card-img">
                    <div class="card-info">
                    <h3 class="card-title">${productoRelacionado.name}</h3>
                    <p class="descripcion">${productoRelacionado.description}</p>
                    <p class="precio" style="color: #28a745">${productoRelacionado.currency} ${productoRelacionado.cost}</p>
                    </div>
                    </div>
                    `;
                    let tarjetas = Array.from(contenedor.getElementsByClassName("card"));
                    tarjetas.forEach(tarjeta => {
                        tarjeta.addEventListener("click", () => {
                            localStorage.setItem("productoSeleccionado", tarjeta.id);
                            window.location.href = "product-info.html";
                        });
                    });
                }
            })
        })
    }
}


// desafiate
let todasLasResenas = [];

// Función para generar estrellas 
function generarEstrellas(puntaje) {
    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= puntaje) {
            estrellas += '<span class="fa fa-star checked"></span>';
        } else {
            estrellas += '<span class="fa fa-star"></span>';
        }
    }
    return estrellas;
}

// formatear fecha

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString('es-ES');
}


// mostrar comentarios

function mostrarComentarios(comentarios) {
    const contenedor = document.getElementById("lista-comentarios");
    let contenidoComentarios = "";
   
    todasLasResenas = [...comentarios];
    
    // aca mostramos todos los comentarios

    todasLasResenas.forEach(comment => {
        contenidoComentarios += `
        <div class="comentario border p-3 mb-3">
            <div class="encabezado-comentario d-flex justify-content-between align-items-start">
            <div>
                <strong>${comment.user}</strong>
                <div class="estrellas mt-1">${generarEstrellas(comment.score)}</div>
                </div>
                <small class="fecha text-muted">${formatearFecha(comment.dateTime)}</small>
            </div>
            <p class="mt-3 mb-0">${comment.description}</p>
            </div>
        </div>
        `;   
    });
    
    contenedor.innerHTML = contenidoComentarios;
}

//envío del formulario

function manejarEnvioResena(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const puntaje = parseInt(document.getElementById('puntaje').value);
    const comentario = document.getElementById('comentario').value;
    
    
    if (!usuario || !puntaje || !comentario) {
        alert('Por favor completá todos los campos');
        return;
    }
    
    // creamos una nueva reseña

    const nuevaResena = {
        user: usuario,
        score: puntaje,
        description: comentario,
        dateTime: new Date().toISOString() 
    };
    
    // agregamos al array en memoria

    todasLasResenas.unshift(nuevaResena); 
    

    mostrarComentarios(todasLasResenas);
    
    
    document.getElementById('form-resena').reset();
    
    // mensaje de éxito
    
   Swal.fire({
    icon: 'success',
    title: '¡Tu reseña fue agregada con éxito!',
    showConfirmButton: true,
   });
}

document.addEventListener('DOMContentLoaded', function() {
    const formResena = document.getElementById('form-resena');
    if (formResena) {
        formResena.addEventListener('submit', manejarEnvioResena);
    }
});