document.addEventListener('DOMContentLoaded', (event) => {
  const links = document.querySelectorAll('#linkContainer a');

  // Función para obtener la URL base sin los parámetros de paginación
  function getBaseUrl(url) {
      const urlObj = new URL(url);
      const basePath = urlObj.pathname + (urlObj.search.split('&page=')[0] || '');
      return basePath;
  }

  // Función para actualizar las clases 'selected' según la URL actual
  function updateSelectedLink() {
      // Obtener la ruta de la URL actual sin los parámetros de paginación
      const currentPath = getBaseUrl(window.location.href);

      // Recorrer cada enlace para añadir/quitar la clase 'selected'
      links.forEach(link => {
          // Obtener la ruta del enlace sin los parámetros de paginación
          const linkPath = getBaseUrl(link.href);

          // Comparar la ruta de la URL del enlace con la ruta de la URL actual
          if (linkPath === currentPath) {
              link.classList.add('selected');
          } else {
              link.classList.remove('selected');
          }

          // Condición especial para la sección "Todo"
          if (link.href === window.location.origin + '/' && window.location.pathname === '/' && !window.location.search.includes('q=')) {
              link.classList.add('selected');
          }
      });
  }

  // Actualizar las clases 'selected' al cargar la página por primera vez
  updateSelectedLink();

  // Agregar un evento 'click' a cada enlace para navegar correctamente
  links.forEach(link => {
      link.addEventListener('click', function(event) {
          // No añadir ni quitar clases aquí para evitar parpadeos
          // La actualización de las clases se realizará solo cuando se cargue la nueva página
      });
  });
});


const moveToTopButton = document.querySelector("#move-to-top-button");

// 
window.addEventListener("scroll", () => {
let scrollPosition = window.scrollY || document.documentElement.scrollTop;

if (scrollPosition > 250) {
  moveToTopButton.style.bottom = "50px";
} else {
  moveToTopButton.style.bottom = "-50px";
}
});

// Desplazarse suavemente hacia la parte superior de la página cuando se haga clic en el botón
moveToTopButton.addEventListener("click", (onclick) => {
onclick.preventDefault();

window.scrollTo({
  top: 0,
  behavior: "smooth"
});
});
