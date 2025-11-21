document.addEventListener("DOMContentLoaded", () => {
  const contenidoCarrito = document.getElementById("contenidoCarrito");

  // Recuperamos el carrito desde localStorage
  const carrito = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Variable global para porcentaje de envío
  let porcentajeEnvio = 0; // CAMBIO: Variable para guardar el porcentaje seleccionado

  //parte del desafiate, cantidad de productos en el carrito
  const contadorCarrito = document.getElementById("carritoCantidad");
  if (contadorCarrito) {
    if (carrito.length > 0) {
      contadorCarrito.textContent = `(${carrito.length})`;
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

  carrito.forEach((producto, index) => {
    const nombre = producto.nombre;
    const precioTexto = producto.precio;
    const moneda = precioTexto.split(" ")[0];
    const costo = parseFloat(precioTexto.split(" ")[1]);
    const imagen = producto.imagen;
    const cantidad = producto.cantidad || 1;
    const costoEnPesos = moneda === "USD" ? costo * 40 : costo;
    const subtotal = costoEnPesos * cantidad;

    carrito[index].moneda = "UYU";
    carrito[index].costoEnPesos = costoEnPesos;
    carrito[index].subtotal = subtotal;

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

    botonSumar.addEventListener("click", (e) => {
      e.preventDefault();
      let nuevaCantidad = (carrito[index].cantidad || 1) + 1;
      carrito[index].cantidad = nuevaCantidad;
      cantidadElemento.textContent = nuevaCantidad;
      localStorage.setItem("cartItems", JSON.stringify(carrito));
      actualizarResumen(porcentajeEnvio); // CAMBIO: Actualizar con porcentaje
    });

    botonRestar.addEventListener("click", (e) => {
      e.preventDefault();
      let nuevaCantidad = (carrito[index].cantidad || 1) - 1;
      if (nuevaCantidad < 1) nuevaCantidad = 1;
      carrito[index].cantidad = nuevaCantidad;
      cantidadElemento.textContent = nuevaCantidad;
      localStorage.setItem("cartItems", JSON.stringify(carrito));
      actualizarResumen(porcentajeEnvio); // CAMBIO: Actualizar con porcentaje
    });

    const botonEliminar = document.getElementById(`eliminar-${index}`);
    botonEliminar.addEventListener("click", () => {
      carrito.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(carrito));
      location.reload();
    });
  });

  function actualizarResumen(porcentajeEnvioActual = 0) { // CAMBIO: Recibe porcentaje
    let subtotalTotal = 0;

    carrito.forEach((p) => {
      const cant = p.cantidad || 1;
      const precioOriginal = parseFloat(p.precio.split(" ")[1]);
      const moneda = p.precio.split(" ")[0];
      const precioEnPesos = moneda === "USD" ? precioOriginal * 40 : precioOriginal;
      subtotalTotal += precioEnPesos * cant;
    });

    const costoEnvio = subtotalTotal * porcentajeEnvioActual; // CAMBIO
    const total = subtotalTotal + costoEnvio; // CAMBIO
    const huboConversion = carrito.some(p => p.precio.startsWith("USD"));

    resumenCarrito.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title mb-3 text-center">Resumen de Compra</h3>
        <hr>

        <div class="d-flex justify-content-between">
          <p class="mb-1 fw-bold">Subtotal:</p>
          <p class="mb-1">UYU ${subtotalTotal.toLocaleString()}</p>
        </div>
        <br>

        <div class="d-flex justify-content-between">
          <p class="mb-1 fw-bold">Envío:</p>
          <p class="mb-1 text-success">UYU ${costoEnvio.toLocaleString()}</p>
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

        <button id="continuarCompraBtn" class="btn btn-primary w-100 mt-3">Continuar compra</button>
      </div>
    </div>
    `;

    // parte 2 de la entrega 7, listener al botón de continuar
    document.getElementById("continuarCompraBtn").addEventListener("click", () => {
      contenidoCarrito.innerHTML = "";
      mostrarParte1();
    });
  }

  actualizarResumen(porcentajeEnvio); // porcentaje inicia en 0

  // parte 2 de la entrega 7
  function mostrarParte1() {
    const contenidoParte1 = `
  <form id="parte1"> 
  <div id="parte1">
    <div class="card-body">
      <h4>1. Datos de envío</h4>
      <div>
       <input class="form-control mb-2" id="Departamento" placeholder="Departamento" required>
       <input class="form-control mb-2" id="Localidad" placeholder="Localidad" required>
       <input class="form-control mb-2" id="Calle" placeholder="Calle" required>
       <input class="form-control mb-2" id="Numero" placeholder="Número" required>
       <input class="form-control mb-2" id="Esquina" placeholder="Esquina" required>
      </div>
      <div>
       <h4>2. Tipo de envío</h4>
        <div class="d-grid gap-2">
          <button type="button" class="btnMarcado btn btn-outline-primary" id="Premium">Premium 2 a 5 días (15%)</button>
          <button type="button" class="btnMarcado btn btn-outline-primary" id="Express">Express 5 a 8 días (7%)</button>
          <button type="button" class="btnMarcado btn btn-outline-primary" id="Standard">Standard 12 a 15 días (5%)</button>
        </div>
      </div>

      <button id="continuarParte1" class="btn btn-primary mt-3" type="button">Continuar</button>
    </div>
  </div>
  </form>
  `;

  //parte 4 de la entrega 7 
    document.getElementById("contenedor").innerHTML = contenidoParte1;

    function validarParte1() {
      const departamento = document.getElementById("Departamento").value;
      const localidad = document.getElementById("Localidad").value;
      const calle = document.getElementById("Calle").value;
      const numero = document.getElementById("Numero").value;
      const esquina = document.getElementById("Esquina").value;

      if (!departamento || !localidad || !calle || !numero || !esquina) {
        return false;
      }

      const seleccionarEnvio = document.querySelector(".btnMarcado.active");
      return seleccionarEnvio !== null;
    }

    document.getElementById("continuarParte1").addEventListener("click", () => {
      if (validarParte1()) {
        mostrarParte2();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salió mal!",
          footer: "Por favor completa todos los campos y selecciona una forma de envío."
        });
      }
    });

    //parte 2 de la entrega 7
    const botonesParte1 = document.querySelectorAll(".btnMarcado");
    botonesParte1.forEach(botoncito => {
      botoncito.addEventListener("click", () => {
        botonesParte1.forEach(botonesNo => botonesNo.classList.remove("active"));
        botoncito.classList.add("active"); //hasta acá

        // guardar el porcentaje dependiendo el metodo de envio 
        if (botoncito.id === "Premium") porcentajeEnvio = 0.15;
        if (botoncito.id === "Express") porcentajeEnvio = 0.07;
        if (botoncito.id === "Standard") porcentajeEnvio = 0.05;

        actualizarResumen(porcentajeEnvio); // CAMBIO: Actualizar resumen al seleccionar envío
      });
    });
  }

  // parte 2 de entrega 7
  function mostrarParte2() { 
    const contenidoParte2 = `
  <div id="parte2">
    <div class="card-body">
      <h4>3. Forma de pago</h4>

      <div class="formaPago" data-tipo="credito">
        <i class="fa-regular fa-credit-card"></i>
        <span>Tarjeta de crédito</span>
      </div>

      <div class="formaPago" data-tipo="debito">
        <i class="fa-regular fa-credit-card"></i>
        <span>Tarjeta de débito</span>
      </div>

      <div class="formaPago" data-tipo="transferencia">
        <i class="fa-solid fa-building-columns"></i>
        <span>Transferencia Bancaria</span>
      </div>

      <div class="formaPago" data-tipo="efectivo">
        <i class="fa-solid fa-money-bill-wave"></i>
        <span>Efectivo</span>
      </div>

      <div id="inputsPago" class="mt-3"></div>

      <button id="finalizarCompra" class="btn btn-success mt-3">Finalizar compra</button>
    </div>
  </div>
  `; 
//hasta acá

    document.getElementById("contenedor").innerHTML = contenidoParte2;

    const metodoPago = document.querySelectorAll(".formaPago");
    const inputsPagoDiv = document.getElementById("inputsPago");

    // mostrar los inputs segun el metodo de pago
    metodoPago.forEach(metodo => {
      metodo.addEventListener("click", () => {
        metodoPago.forEach(m => m.classList.remove("seleccionada"));
        metodo.classList.add("seleccionada");

        const tipo = metodo.dataset.tipo;

        if (tipo === "credito" || tipo === "debito") {
          inputsPagoDiv.innerHTML = `
            <h5>Datos de tarjeta</h5>
            <input id="numTarjeta" class="form-control mb-2" placeholder="Número de tarjeta">
            <input id="vencimiento" class="form-control mb-2" placeholder="MM/AA">
            <input id="cvc" class="form-control mb-2" placeholder="CVC">
          `;
        }

        if (tipo === "transferencia") {
          inputsPagoDiv.innerHTML = `
            <h5>Transferencia Bancaria</h5>
            <input id="cuenta" class="form-control mb-2" placeholder="Número de cuenta">
          `;
        }

        if (tipo === "efectivo") {
          inputsPagoDiv.innerHTML = `
            <h5>Pago en efectivo</h5>
            <input id="nombre" class="form-control mb-2" placeholder="Nombre completo">
            <input id="documento" class="form-control mb-2" placeholder="Documento">
          `;
        }
      });
    });

    // validar el pago
    function validarPago() {
      const metodoElegido = document.querySelector(".formaPago.seleccionada");
      if (!metodoElegido) return false;

      const tipo = metodoElegido.dataset.tipo;

      if (tipo === "credito" || tipo === "debito") {
        return (
          document.getElementById("numTarjeta").value.trim() !== "" &&
          document.getElementById("vencimiento").value.trim() !== "" &&
          document.getElementById("cvc").value.trim() !== ""
        );
      }

      if (tipo === "transferencia") {
        return document.getElementById("cuenta").value.trim() !== "";
      }

      if (tipo === "efectivo") {
        return (
          document.getElementById("nombre").value.trim() !== "" &&
          document.getElementById("documento").value.trim() !== ""
        );
      }

      return false;
    }

    // validar las cantidades
    function validarCantidades() {
      const carrito = JSON.parse(localStorage.getItem("cartItems")) || [];
      return carrito.every(p => p.cantidad && p.cantidad > 0);
    }

    // finalizar compra
    document.getElementById("finalizarCompra").addEventListener("click", () => {
      if (!validarCantidades()) {
        Swal.fire("Error", "Cada producto debe tener una cantidad válida.", "error");
        return;
      }

      if (!validarPago()) {
        Swal.fire("Error", "Complete correctamente los datos del método de pago.", "error");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "¡Compra realizada!",
        text: `Su compra ha sido procesada con éxito.\nTotal: UYU ${calcularTotalFinal().toLocaleString()}`
      }).then(() => { //detalle de volver al carrito despúes de finalizar la compra y que se vacíe.
        localStorage.removeItem("cartItems");
        window.location.href = "cart.html";
      })
    });
  }

  // funcion para calcular total final considerando el envio
  function calcularTotalFinal() {
    let subtotalTotal = 0;
    carrito.forEach((p) => {
      const cant = p.cantidad || 1;
      const precioOriginal = parseFloat(p.precio.split(" ")[1]);
      const moneda = p.precio.split(" ")[0];
      const precioEnPesos = moneda === "USD" ? precioOriginal * 40 : precioOriginal;
      subtotalTotal += precioEnPesos * cant;
    });
    const costoEnvio = subtotalTotal * porcentajeEnvio;
    return subtotalTotal + costoEnvio;
  }
});
