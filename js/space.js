// Seleccionar elementos del DOM
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar = document.getElementById("btnBuscar");
const contenedor = document.getElementById("contenedor");

// Agregar evento de clic al botón de búsqueda
btnBuscar.addEventListener("click", () => {
  const query = inputBuscar.value.trim(); // Obtener el valor del input

  if (query === "") {
    alert("Por favor, ingresa un término para buscar.");
    return;
  }

  // Construir la URL con el parámetro de búsqueda
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;

  // Realizar la solicitud a la API
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      mostrarResultados(data.collection.items); // Procesar y mostrar los resultados
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud:", error);
      alert("Ocurrió un error al buscar las imágenes. Intenta nuevamente.");
    });
});

// Función para mostrar los resultados
function mostrarResultados(items) {
  contenedor.innerHTML = ""; // Limpiar resultados previos

  if (items.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron resultados para esta búsqueda.</p>";
    return;
  }

  let filaActual = null;

  items.forEach((item, index) => {
    const { title, description, date_created } = item.data[0];
    const imageUrl = item.links?.[0]?.href || "https://via.placeholder.com/150";

    // Crear una nueva fila cada 3 elementos
    if (index % 3 === 0) {
      filaActual = document.createElement("div");
      filaActual.classList.add("row", "mb-4");
      contenedor.appendChild(filaActual);
    }

    // Crear la tarjeta
    const tarjeta = `
      <div class="col-md-4">
        <div class="card h-100">
          <img src="${imageUrl}" class="card-img-top" alt="${title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${title}</h5>
            <div class="card-text scrollable">
              ${description || "Sin descripción disponible."}
            </div>
            <p class="mt-auto"><small class="text-muted">${new Date(date_created).toLocaleDateString()}</small></p>
          </div>
        </div>
      </div>
    `;

    filaActual.insertAdjacentHTML("beforeend", tarjeta);
  });
}
