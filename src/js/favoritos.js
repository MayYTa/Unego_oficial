document.addEventListener('DOMContentLoaded', async () => {
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts')) || [];
    const grid = document.querySelector('.profile-products-grid');
    
    if (savedProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-favorites">
                <i class="far fa-bookmark"></i>
                <p>No tienes productos guardados</p>
            </div>
        `;
        return;
    }

    try {
        // Cargar productos desde JSON
        const response = await fetch('src/json/productos.json');
        if (!response.ok) throw new Error('Error al cargar productos');
        const allProducts = await response.json();
        
        // Obtener solo los IDs de los productos guardados
        const savedProductIds = savedProducts.map(item => item.id);
        
        // Filtrar solo los favoritos
        const favoriteProducts = allProducts.filter(p => savedProductIds.includes(p.id));
        
        // Renderizar
        renderFavorites(favoriteProducts);
        
    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = `
            <div class="error-message">
                Error al cargar tus productos favoritos
            </div>
        `;
    }
});

function renderFavorites(products) {
    const grid = document.querySelector('.profile-products-grid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = `
            <a href="productos.html?id=${product.id}" class="product-link">
                <div class="product-card" id="${product.id}">
                    <div class="top-right-actions">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    <div class="product-image">
                        <img src="${product.imagen}" alt="${product.titulo}">
                    </div>
                    <div class="product-details">
                        <h3 class="product-title">${product.titulo}</h3>
                        <p class="product-seller">Por ${product.vendedor}</p>
                        <div class="product-price">S/.${product.precio}</div>
                        <div class="product-rating">
                            <span class="rating-value">${product.calificacion.toFixed(1)}</span>
                            <div class="stars">
                                ${generateStarRating(product.calificacion)}
                            </div>
                        </div>
                    </div>
                    <div class="product-actions">
                        <i class="fas fa-bookmark saved" data-product-id="${product.id}"></i>
                    </div>
                </div>
            </a>
        `;
        grid.insertAdjacentHTML('beforeend', productCard);
    });

    // Event listeners para bookmarks
    document.querySelectorAll('.fa-bookmark').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveProduct(this);
            this.closest('.product-card').remove();
            
            // Mostrar mensaje si no quedan favoritos
            if (grid.children.length === 0) {
                grid.innerHTML = `
                    <div class="empty-favorites">
                        <i class="far fa-bookmark"></i>
                        <p>No tienes productos guardados</p>
                    </div>
                `;
            }
        });
    });
}

// Función para alternar favoritos (debe ser idéntica a la de script_productos.js)
function toggleSaveProduct(icon) {
    const productId = icon.getAttribute('data-product-id');
    let savedProducts = JSON.parse(localStorage.getItem('savedProducts')) || [];
    
    if (icon.classList.contains('saved')) {
        savedProducts = savedProducts.filter(item => item.id !== productId);
        icon.classList.replace('fas', 'far');
    } else {
        // Guardamos el ID y la fecha/hora actual
        savedProducts.push({
            id: productId,
            savedAt: new Date().toISOString()
        });
        icon.classList.replace('far', 'fas');
    }
    
    localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
}


// Función para generar estrellas (debe ser idéntica a la de script_productos.js)
function generateStarRating(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star filled"></i>';
    }
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    return starsHtml;
}