document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('product-search');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyFiltersButton = document.getElementById('apply-filters');
    const ratingFilterRadios = document.querySelectorAll('input[name="rating-filter"]');
    const sortOrderSelect = document.getElementById('sort-order'); // Nuevo: Selector de ordenamiento
    const productContainer = document.querySelector('.main-content'); // Contenedor de las tarjetas
    let productCards = Array.from(document.querySelectorAll('.product-card')); // Convertir a array para ordenar
    const priceAlert = document.getElementById('price-alert');

    const filterAndSortProducts = () => { // Renombrado para reflejar ambas acciones
        const searchTerm = searchInput.value.toLowerCase().trim();
        let minPrice = parseFloat(minPriceInput.value);
        let maxPrice = parseFloat(maxPriceInput.value);
        let selectedRating = parseFloat(document.querySelector('input[name="rating-filter"]:checked').value);
        const sortOrder = sortOrderSelect.value; // Nuevo: Obtener el tipo de ordenamiento

        // VALIDACIÓN DE PRECIOS
        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
            priceAlert.textContent = "El precio mínimo no puede ser mayor que el máximo.";
            priceAlert.classList.remove('hidden');
            
            // OCULTAR TODOS LOS PRODUCTOS CUANDO LA VALIDACIÓN FALLA
            productCards.forEach(card => {
                card.classList.add('hidden');
            });
            
            return; // Detiene la ejecución si hay un error de validación
        } else {
            priceAlert.classList.add('hidden'); // Oculta la alerta si la validación es correcta
        }

        let visibleProducts = []; // Array para almacenar solo los productos visibles

        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const seller = card.querySelector('.product-seller').textContent.toLowerCase();
            const price = parseFloat(card.querySelector('.product-price').dataset.price);
            const rating = parseFloat(card.querySelector('.product-rating').dataset.rating);

            let isVisible = true;

            // 1. Filtrar por texto de búsqueda
            if (searchTerm) {
                if (!title.includes(searchTerm) && !seller.includes(searchTerm)) {
                    isVisible = false;
                }
            }

            // 2. Filtrar por precio mínimo
            if (!isNaN(minPrice) && price < minPrice) {
                isVisible = false;
            }

            // 3. Filtrar por precio máximo
            if (!isNaN(maxPrice) && price > maxPrice) {
                isVisible = false;
            }

            // 4. Filtrar por calificación (estrellas)
            if (selectedRating > 0) {
                if (rating < selectedRating) {
                    isVisible = false;
                }
            }

            // Mostrar u ocultar la tarjeta
            if (isVisible) {
                card.classList.remove('hidden');
                visibleProducts.push(card); // Añadir a los productos visibles
            } else {
                card.classList.add('hidden');
            }
        });

        // ORDENAR LOS PRODUCTOS VISIBLES
        if (sortOrder !== 'default') {
            visibleProducts.sort((a, b) => {
                const aPrice = parseFloat(a.querySelector('.product-price').dataset.price);
                const bPrice = parseFloat(b.querySelector('.product-price').dataset.price);
                const aRating = parseFloat(a.querySelector('.product-rating').dataset.rating);
                const bRating = parseFloat(b.querySelector('.product-rating').dataset.rating);

                if (sortOrder === 'price-asc') {
                    return aPrice - bPrice; // Menor a Mayor Precio
                } else if (sortOrder === 'price-desc') {
                    return bPrice - aPrice; // Mayor a Menor Precio
                } else if (sortOrder === 'rating-desc') {
                    return bRating - aRating; // Mayor a Menor Puntuación
                }
                return 0; // No debería llegar aquí si el valor es válido
            });
        }

        // Reinsertar los productos ordenados en el DOM
        // Primero, limpia el contenedor para evitar duplicados si los productos ya estaban ahí
        productContainer.innerHTML = ''; 
        visibleProducts.forEach(card => {
            productContainer.appendChild(card);
        });
    };

    // Event Listeners
    searchInput.addEventListener('keyup', filterAndSortProducts);
    applyFiltersButton.addEventListener('click', filterAndSortProducts);
    minPriceInput.addEventListener('change', filterAndSortProducts);
    maxPriceInput.addEventListener('change', filterAndSortProducts);
    ratingFilterRadios.forEach(radio => {
        radio.addEventListener('change', filterAndSortProducts);
    });
    sortOrderSelect.addEventListener('change', filterAndSortProducts); // Nuevo: Evento para el select de ordenamiento

    // Ejecutar el filtro/ordenamiento inicial al cargar la página
    filterAndSortProducts();
});