document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById('profile-img');
  const input = document.getElementById('file-input');
  const logoutBtn = document.getElementById("logout-btn");
  const botonImagen = document.getElementById("btnImagen");
  const eliminarImagen = document.getElementById("eliminarImagen");

if (eliminarImagen){
  eliminarImagen.addEventListener("click", () => {
    img.src = "img/default-profile.png";

    delete profileImages[usuario];
    localStorage.setItem("profileImages", JSON.stringify(profileImages));
  })
}

  const usuario = localStorage.getItem("usuarioLogeado");
  if (!usuario) {
    // Si no hay usuario logueado, redirige al login
    window.location.href = "login.html";
    return;
  }

  const profileImages = JSON.parse(localStorage.getItem("profileImages")) || {};
  if (profileImages[usuario]) {
    img.src = profileImages[usuario];
  } else {
    img.src = "img/default-profile.png";
  }

  botonImagen.addEventListener("click", () => {
    input.click();
  });

  input.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;
        img.src = imageData;
      // Guarda la imagen de este usuario
        profileImages[usuario] = imageData;
        localStorage.setItem("profileImages", JSON.stringify(profileImages));
      };
      reader.readAsDataURL(file);
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogeado");
      window.location.href = "login.html";
    });
  }
});


  // PARTE 4 ENTEGA 5

  const form = document.getElementById("profile-form");
  const emailInput = document.getElementById("usuario");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");

  // toma el email con el usuario logueado
 const usuarioEmail = localStorage.getItem("usuarioLogeado");
if (emailInput && usuarioEmail) {
    emailInput.value = usuarioEmail;
}

  // aca se carga los datos guardados del perfil
  const perfilGuardado = JSON.parse(localStorage.getItem("perfilUsuario")) || {};

  if (perfilGuardado[usuario]) {
    const datos = perfilGuardado[usuario];
    if (nombreInput) nombreInput.value = datos.nombre || "";
    if (apellidoInput) apellidoInput.value = datos.apellido || "";
  }

  // los datos al enviar el formulario
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // datos ingresados
      const datos = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
      };

      // datos en localStorage (por usuario)
      perfilGuardado[usuario] = datos;
      localStorage.setItem("perfilUsuario", JSON.stringify(perfilGuardado));

      Swal.fire({
        icon: "success",
        title: "Los cambios se han guardado correctamente",
        showConfirmButton: false,
        timer: 1500
      });
      });
  }








