document.addEventListener('DOMContentLoaded', () => {
    const contenedorReseñas = document.getElementById('contenedor-reseñas');

    // Función asíncrona para cargar y mostrar las reseñas
    async function cargarReseñas() {
        try {
            // Realizamos la petición para obtener el archivo JSON
            const respuesta = await fetch('src/components/testimonials.json');
            
            // Verificamos si la respuesta fue exitosa
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            // Convertimos la respuesta a formato JSON
            const reseñas = await respuesta.json();

            // Iteramos sobre cada reseña y la añadimos al HTML
            reseñas.forEach(reseña => {
                const reseñaCard = document.createElement('div');
                reseñaCard.classList.add('testimonial-card'); // Usa la clase que ya tienes

                // Usamos innerHTML para construir la estructura de la tarjeta
                // Nota: El <br> lo incluimos directamente en el HTML generado
                reseñaCard.innerHTML = `
                    <img src="${reseña.imagen}" alt="${reseña.alt_imagen}">
                    <div class="testimonial-content">
                        <h4>${reseña.nombre_completo}, <br>${reseña.universidad_carrera}</h4>
                        <p>"${reseña.texto_reseña}"</p>
                    </div>
                `;
                contenedorReseñas.appendChild(reseñaCard);
            });

        } catch (error) {
            console.error('No se pudieron cargar las reseñas:', error);
            // Mensaje de respaldo si hay un error
            if (contenedorReseñas) {
                contenedorReseñas.innerHTML = '<p>Lo sentimos, no pudimos cargar las reseñas en este momento.</p>';
            }
        }
    }

    // Llamamos a la función para cargar las reseñas cuando el DOM esté listo
    cargarReseñas();
});