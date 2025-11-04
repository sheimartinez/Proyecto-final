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

  // 🔹 Creamos contenedor general con 2 columnas
  contenidoCarrito.innerHTML = `
    <div class="col-md-8 col-12" id="listaCarrito"></div>
    <div class="col-md-4 col-12" id="resumenDeCarrito"></div>
  `;

  const listaCarrito = document.getElementById("listaCarrito");
  const resumenCarrito = document.getElementById("resumenDeCarrito");

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


    // 🗑️ Eliminar producto individual
    const botonEliminar = document.getElementById(`eliminar-${index}`);
    botonEliminar.addEventListener("click", () => {
      carrito.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(carrito));
      location.reload(); // recarga para actualizar la vista
    });
  });

  // 💰 Mostrar resumen
  function actualizarResumen() {
    let subtotalTotal = 0;

    carrito.forEach((p) => {
      const cant = p.cantidad || 1;
      const precioOriginal = parseFloat(p.precio.split(" ")[1]);
      const moneda = p.precio.split(" ")[0];
      const precioEnPesos = moneda === "USD" ? precioOriginal * 40 : precioOriginal;
      subtotalTotal += precioEnPesos * cant;
    });

    const envio = 0;
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
          <p class="mb-1 text-success">GRATIS</p>
        </div>

        <hr>

        <div class="d-flex justify-content-between">
          <p class="mb-1 fw-bold">Total:</p>
          <p class="mb-1 fw-bold" id="total">UYU ${total.toLocaleString()}</p>
        </div>

        ${
          huboConversion
            ? `<p class="text-muted mt-2" style="font-size: 0.9em;">*Los precios en USD fueron convertidos a pesos uruguayos (1 USD = 40 UYU)</p>`
            : ""
        }

        <button class="btn btn-primary w-100 mt-3">Finalizar compra</button>
      </div>
    </div>
    `;
  }

  actualizarResumen();
});
