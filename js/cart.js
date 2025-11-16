document.addEventListener("DOMContentLoaded", () => {
  const contenidoCarrito = document.getElementById("contenidoCarrito");

  // Recuperamos el carrito desde localStorage
  const carrito = JSON.parse(localStorage.getItem("cartItems")) || [];

  //parte del desafiate, cantidad de productos en el carrito
  const contadorCarrito = document.getElementById("carritoCantidad");
  if (contadorCarrito) {
    if (carrito.length > 0) {
      contadorCarrito.textContent = `(${carrito.length})`; //cambia o lee solo el texto dentro del elemento
      contadorCarrito.style.display = "inline";
    } else {
      contadorCarrito.style.display = "none";
    }
  }

  // Si no hay productos
  if (carrito.length === 0) {
    contenidoCarrito.innerHTML = `
      <div class="text-center mt-5">
        <h4>El carrito está vacío 🛒</h4>
      </div>
    `;
    return;
  }

  const listaCarrito = contenidoCarrito;
  const resumenCarrito = document.getElementById("resumenCompra");

  // 🔁 Recorremos todos los productos del carrito
  carrito.forEach((producto, index) => {
    const nombre = producto.nombre;
    const precioTexto = producto.precio; // "USD 14500" o "UYU 2999"
    const moneda = precioTexto.split(" ")[0];
    const costo = parseFloat(precioTexto.split(" ")[1]);
    const imagen = producto.imagen;
    const cantidad = producto.cantidad || 1;
    const costoEnPesos = moneda === "USD" ? costo * 40 : costo; // 💱 conversión
    const subtotal = costoEnPesos * cantidad;

    // Guardamos la versión en pesos en el carrito
    carrito[index].moneda = "UYU";
    carrito[index].costoEnPesos = costoEnPesos;
    carrito[index].subtotal = subtotal;

    // 🔸 Generamos la tarjeta del producto
    const itemHTML = `
<div class="card mb-3 w-100">
  <div class="row g-0 align-items-center">
    <div class="col-md-4">
      <img src="${imagen}" class="img-fluid rounded-start" alt="${nombre}">
    </div>

    <div class="col-md-8">
      <div class="card-body row text-center">
        
        <div class="col-md-4 mb-3 text-start">
            <h5 class="card-title text-start">${nombre}</h5>
            <button id="eliminar-${index}" class="btn text-primary p-0 mt-2" style="font-weight: bold;">Eliminar</button>
        </div>

        <div class="col-md-4 mb-3 text-center">
          <label class="form-label d-block"><strong>Cantidad:</strong></label>
          <nav aria-label="Selector de cantidad">
            <ul class="pagination pagination-sm justify-content-center mb-0">
              <li class="page-item">
                <a class="page-link bg-secondary text-white" href="#" id="restar-${index}">−</a>
              </li>
              <li class="page-item">
                <a class="page-link bg-secondary text-white" href="#" id="cantidad-${index}" style="pointer-events:none;">${cantidad}</a>
              </li>
              <li class="page-item">
                <a class="page-link bg-secondary text-white" href="#" id="sumar-${index}">+</a>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-4 mb-3">
          <p><strong>Precio:</strong><br>UYU ${costoEnPesos.toLocaleString()}</p>
          <p><strong>Subtotal:</strong><br><span id="subtotal-${index}">UYU ${subtotal.toLocaleString()}</span></p>
        </div>

      </div>
    </div>
  </div>
</div>
    `;

    listaCarrito.insertAdjacentHTML("beforeend", itemHTML);

    const cantidadElemento = document.getElementById(`cantidad-${index}`);
    const botonSumar = document.getElementById(`sumar-${index}`);
    const botonRestar = document.getElementById(`restar-${index}`);
    const subtotalElemento = document.getElementById(`subtotal-${index}`);

    botonSumar.addEventListener("click", (e) => {
      e.preventDefault();
      let nuevaCantidad = (carrito[index].cantidad || 1) + 1;
      carrito[index].cantidad = nuevaCantidad;
      cantidadElemento.textContent = nuevaCantidad;
      const nuevoSubtotal = carrito[index].costoEnPesos * nuevaCantidad;
      subtotalElemento.textContent = `UYU ${nuevoSubtotal.toLocaleString()}`;
      localStorage.setItem("cartItems", JSON.stringify(carrito));
      actualizarResumen();
    });

    botonRestar.addEventListener("click", (e) => {
      e.preventDefault();
      let nuevaCantidad = (carrito[index].cantidad || 1) - 1;
      if (nuevaCantidad < 1) nuevaCantidad = 1;
      carrito[index].cantidad = nuevaCantidad;
      cantidadElemento.textContent = nuevaCantidad;
      const nuevoSubtotal = carrito[index].costoEnPesos * nuevaCantidad;
      subtotalElemento.textContent = `UYU ${nuevoSubtotal.toLocaleString()}`;
      localStorage.setItem("cartItems", JSON.stringify(carrito));
      actualizarResumen();
    });


    // Eliminar producto individual
    const botonEliminar = document.getElementById(`eliminar-${index}`);
    botonEliminar.addEventListener("click", () => {
      carrito.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(carrito));
      location.reload(); // recarga para actualizar la vista
    });
  });

  //  Mostrar resumen
  function actualizarResumen() {
    let subtotalTotal = 0;

    carrito.forEach((p) => {
      const cant = p.cantidad || 1;
      const precioOriginal = parseFloat(p.precio.split(" ")[1]);
      const moneda = p.precio.split(" ")[0];
      const precioEnPesos = moneda === "USD" ? precioOriginal * 40 : precioOriginal;
      subtotalTotal += precioEnPesos * cant;
    });

    const porcentajeEnvio = parseInt(localStorage.getItem("porcentajeElegido")) || 0;
    const envio = Math.round(subtotalTotal * (porcentajeEnvio / 100));
    const total = subtotalTotal + envio;
    const huboConversion = carrito.some(p => p.precio.startsWith("USD"));

    resumenCarrito.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title mb-3">Resumen del carrito</h3>
        <hr>

        <div class="d-flex justify-content-between">
          <p class="mb-1">Productos (${carrito.length}):</p>
          <p class="mb-1">UYU ${subtotalTotal.toLocaleString()}</p>
        </div>

        <div class="d-flex justify-content-between">
          <p class="mb-1">Envío:</p>
          <p class="mb-1">UYU ${envio.toLocaleString()}</p>
        </div>

        <hr>

        ${localStorage.getItem("envioTexto") ? `
  <div class="d-flex justify-content-between">
    <p class="mb-1">Tipo de envío:</p>
    <p class="mb-1">${localStorage.getItem("envioTexto")}</p>
  </div>
` : ""}
        <div class="d-flex justify-content-between">
          <p class="mb-1 fw-bold">Total:</p>
          <p class="mb-1 fw-bold" id="total">UYU ${total.toLocaleString()}</p>
        </div>

        ${
          huboConversion
            ? `<p class="text-muted mt-2" style="font-size: 0.9em;">*Los precios en USD fueron convertidos a pesos uruguayos (1 USD = 40 UYU)</p>`
            : ""
        }

        <button id="continuarCompraBtn" class="btn btn-primary w-100 mt-3">Continuar compra</button>
      </div>
    </div>
    `;
  } ////cambié el nombre del botón a continuar compra y le añadí un id

document.querySelectorAll(".btnMarcado").forEach((botoncito) => {
  botoncito.addEventListener("click", () => {
    localStorage.setItem("porcentajeElegido", botoncito.dataset.porcentaje);
    localStorage.setItem("envioTexto", botoncito.textContent.trim());
    actualizarResumen();
  });
});

  actualizarResumen();
  
  //parte 2 de entrega 6
  document.getElementById("continuarCompraBtn").addEventListener("click", () => {
  contenidoCarrito.innerHTML = "";
  mostrarParte1();
});

//parte 2 de la entrega 6, funciones para mostrar los datos
function mostrarParte1() {

  const contenidoParte1 = `
  <div id="parte1">
    <div class="card-body">
      <h4>1. Datos de envío</h4>
      <div>
       <input class="form-control mb-2" id="departamento" placeholder="Departamento">
       <input class="form-control mb-2" id="localidad" placeholder="Localidad">
       <input class="form-control mb-2" id="calle" placeholder="Calle">
       <input class="form-control mb-2" id="numero" placeholder="Número">
       <input class="form-control mb-2" id="esquina" placeholder="Esquina">
      </div>

      <div>
       <h4>2. Tipo de envío</h4>
        <div class="d-grid gap-2">
          <button class="btnMarcado btn btn-outline-primary" data-porcentaje="15">
            Premium 2 a 5 días (15%)
          </button>
          <button class="btnMarcado btn btn-outline-primary" data-porcentaje="7">
            Express 5 a 8 días (7%)
          </button>
          <button class="btnMarcado btn btn-outline-primary" data-porcentaje="5">
            Standard 12 a 15 días (5%)
          </button>
        </div>
      </div>

      <button id="continuarParte1" class="btn btn-primary mt-3">Continuar</button>
    </div>
  </div>
  `;

  contenidoCarrito.innerHTML = contenidoParte1;

  // evento para continuar
  document.getElementById("continuarParte1").addEventListener("click", () => {
    document.getElementById("continuarParte1").remove();
    mostrarParte2();
  });

  // seleccion de botones
  const botonesParte1 = document.querySelectorAll(".btnMarcado");

  botonesParte1.forEach(botoncito => {
    botoncito.addEventListener("click", () => {

      // le saco el active a todos
      botonesParte1.forEach(btn => btn.classList.remove("active"));

      // dejo señalado el que apreté
      botoncito.classList.add("active");

      // guardamos porcentaje y texto del envío
      localStorage.setItem("porcentajeElegido", botoncito.dataset.porcentaje);
      localStorage.setItem("envioTexto", botoncito.textContent.trim());

      //  actualiza el resumen en tiempo real
      actualizarResumen();
    });
  });

}

function mostrarParte2(){
  const contenidoParte2 = `
  <div id="parte2">
    <div class="card-body">
      <h4>3. Forma de pago</h4>
      <div class="formaPago">
        <i class="fa-regular fa-credit-card"></i>
        <span>Tarjeta de crédito</span>
      </div>
      <div class="formaPago">
        <i class="fa-regular fa-credit-card"></i>
        <span>Tarjeta de débito</span>
      </div>
      <div class="formaPago">
        <i class="fa-solid fa-building-columns"></i>
        <span>Transferencia Bancaria</span>
      </div>
      <div class="formaPago">
        <i class="fa-solid fa-money-bill-wave"></i>
        <span>Efectivo</span>
      </div>

      <button id="finalizarCompra" class="btn btn-success mt-3">Finalizar compra</button>
    </div>
  </div>
  `;

  contenidoCarrito.innerHTML = contenidoCarrito.innerHTML + contenidoParte2;

  const metodoPago = document.querySelectorAll(".formaPago");
  metodoPago.forEach(metodo => {
    metodo.addEventListener("click", () => {
      metodoPago.forEach(metodoNo => metodoNo.classList.remove("seleccionada"));
      metodo.classList.add("seleccionada");
    });
  });
}
});
