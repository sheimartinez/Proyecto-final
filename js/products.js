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
       <img src="${producto.image}" alt="${producto.name}" class="card-img">
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

  