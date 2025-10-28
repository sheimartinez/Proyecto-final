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

//parte 2 de entrega 4
const urlComentarios= PRODUCT_INFO_COMMENTS_URL + productoId + EXT_TYPE;
getJSONData(urlComentarios).then(function(resultado){
    if (resultado.status === "ok"){
        console.log("Comentarios cargados", resultado.data);
        mostrarComentarios(resultado.data);
    }
});
} //

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

    let contenido = "";

    if (relacionados == null || relacionados.length === 0) {
        contenido += `<p>No hay productos relacionados</p>`;
    } else {
        for (let relacionado of relacionados) {
            contenido += `
            <div class="card mx-3" id="${relacionado.id}" style="cursor:pointer;">
                <img src="${relacionado.image}" class="card-img">
                <div class="card-info">
                    <h3 class="card-title">${relacionado.name}</h3>
                </div>
            </div>
            `;
        }
    }

    contenedor.innerHTML += contenido;

    let tarjetas = Array.from(contenedor.getElementsByClassName("card"));
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            localStorage.setItem("productoSeleccionado", tarjeta.id);
            window.location.href = "product-info.html";
        });
    });
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