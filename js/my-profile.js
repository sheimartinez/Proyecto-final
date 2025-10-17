document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById('profile-img');
  const input = document.getElementById('file-input');
  const logoutBtn = document.getElementById("logout-btn");

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
    img.src = "img/default-profile.png"; // imagen por defecto, qun que no se le agrego aun
  }

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





