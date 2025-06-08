document.addEventListener('DOMContentLoaded', () => {
    const contenedorUniversidades = document.getElementById('contenedor-universidades');

    async function cargarUniversidades() {
        try {
            // **¡Asegúrate que esta ruta sea correcta!**
            // Si universidades.json está en la raíz: 'universidades.json'
            // Si universidades.json está en src/components/: 'src/components/universidades.json'
            const respuesta = await fetch('src/components/universities.json'); 
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            const universidades = await respuesta.json();

            universidades.forEach(universidad => {
                const universidadCard = document.createElement('div');
                universidadCard.classList.add('university-card'); 

                universidadCard.innerHTML = `
                    <img src="${universidad.logo}" alt="${universidad.alt_logo}">
                    <div class="university-info">
                        <a href="${universidad.link_web}"><h4>${universidad.nombre}</h4></a>
                        <p><strong>Ubicación principal:</strong> ${universidad.ubicacion_principal}</p>
                        <p><strong>Campuses:</strong> ${universidad.numero_campuses}</p>
                        <p class="description">${universidad.descripcion_corta}</p>
                    </div>
                `;
                contenedorUniversidades.appendChild(universidadCard);
            });

        } catch (error) {
            console.error('No se pudieron cargar las universidades:', error);
            if (contenedorUniversidades) {
                contenedorUniversidades.innerHTML = '<p>Lo sentimos, no pudimos cargar la información de las universidades en este momento.</p>';
            }
        }
    }

    cargarUniversidades();
});