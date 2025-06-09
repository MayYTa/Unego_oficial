document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faq-accordion-container');
    const faqSearchInput = document.getElementById('faq-search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    let todasLasPreguntas = [];
    const NUM_PREGUNTAS_INICIALES = 4;

    // Función para normalizar texto (eliminar acentos y convertir a minúsculas)
    function normalizeText(text) {
        return text
            .normalize("NFD") // Descompone el texto en sus caracteres base y diacríticos
            .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (acentos)
            .toLowerCase(); // Convierte todo a minúsculas
    }

    // Función asíncrona para cargar las preguntas frecuentes
    async function cargarPreguntasFrecuentes() {
        try {
            const respuesta = await fetch('src/components/fqa.json'); 
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            // Normalizar todas las preguntas y respuestas una sola vez al cargar
            const preguntasOriginales = await respuesta.json();
            todasLasPreguntas = preguntasOriginales.map(item => ({
                pregunta: item.pregunta,
                respuesta: item.respuesta,
                preguntaNormalizada: normalizeText(item.pregunta), // Guardamos la versión normalizada
                respuestaNormalizada: normalizeText(item.respuesta) // Guardamos la versión normalizada
            }));

            mostrarPreguntas(todasLasPreguntas.slice(0, NUM_PREGUNTAS_INICIALES));
            
            clearSearchBtn.style.display = 'none';

        } catch (error) {
            console.error('No se pudieron cargar las preguntas frecuentes:', error);
            if (faqContainer) {
                faqContainer.innerHTML = '<p>Lo sentimos, no pudimos cargar las preguntas frecuentes en este momento.</p>';
            }
        }
    }

    // Función para mostrar preguntas en el contenedor
    function mostrarPreguntas(preguntasAMostrar) {
        faqContainer.innerHTML = '';

        if (preguntasAMostrar.length === 0) {
            faqContainer.innerHTML = '<p>No se encontraron preguntas que coincidan con tu búsqueda.</p>';
            return;
        }

        preguntasAMostrar.forEach(item => {
            const faqItemDiv = document.createElement('div');
            faqItemDiv.classList.add('faq-item');

            faqItemDiv.innerHTML = `
                <h4 class="faq-question">${item.pregunta}</h4>
                <p class="faq-answer">${item.respuesta}</p>
            `;
            faqContainer.appendChild(faqItemDiv);
        });
    }

    // --- Lógica del buscador ---

    // Función para filtrar preguntas
    function filtrarPreguntas() {
        const textoBusquedaOriginal = faqSearchInput.value;
        const textoBusquedaNormalizado = normalizeText(textoBusquedaOriginal); // Normalizamos el texto de búsqueda

        let preguntasFiltradas = [];

        if (textoBusquedaNormalizado === '') {
            preguntasFiltradas = todasLasPreguntas.slice(0, NUM_PREGUNTAS_INICIALES);
            clearSearchBtn.style.display = 'none';
        } else {
            // Filtra usando las versiones normalizadas para la comparación
            preguntasFiltradas = todasLasPreguntas.filter(item => 
                item.preguntaNormalizada.includes(textoBusquedaNormalizado) ||
                item.respuestaNormalizada.includes(textoBusquedaNormalizado)
            );
            clearSearchBtn.style.display = 'block';
        }
        
        mostrarPreguntas(preguntasFiltradas);
    }

    // Event listener para la barra de búsqueda
    faqSearchInput.addEventListener('keyup', filtrarPreguntas);

    // Event listener para el botón de limpiar búsqueda
    clearSearchBtn.addEventListener('click', () => {
        faqSearchInput.value = '';
        filtrarPreguntas();
        faqSearchInput.focus();
    });

    // Llamamos a la función principal para cargar y configurar el FAQ al inicio
    cargarPreguntasFrecuentes();
});