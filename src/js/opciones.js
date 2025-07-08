//NUEVO
document.querySelectorAll('.menu-edit').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-producto-id');
        if (productos[id]) {
            localStorage.setItem('productoEditar', JSON.stringify(productos[id]));
            localStorage.setItem('productoEditarId', id); // Guarda el ID
            window.location.href = 'editar-publicacion.html';
        }
    });
});



// Cierra el menú si se hace clic fuera
document.addEventListener('click', function() {
    document.querySelectorAll('.product-actions-menu').forEach(function(menu) {
        menu.style.display = 'none';
    });
});

// Inicializa productos SOLO si no existen en localStorage
if (!localStorage.getItem('productos')) {
    const productos = {
        "polo-negro-1": {
            imagen: "assets/img/polo.png",
            descripcion: "Polo negro de algodón, talla M, poco uso.",
            precio: 12.00,
            categoria: "Ropa",
            vendidos: 3,
            stock: 15
        },
        "mochila-1": {
            imagen: "assets/img/mochila.png",
            descripcion: "Mochila resistente, color azul, varios bolsillos.",
            precio: 35.00,
            categoria: "Accesorios",
            vendidos: 5,
            stock: 20
        }
    };
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Siempre usa los productos desde localStorage
const productos = JSON.parse(localStorage.getItem('productos'));
// Menú de los tres puntitos (ya lo tienes)
document.querySelectorAll('.top-right-actions .fa-ellipsis-h').forEach(function(icon) {
    icon.addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelectorAll('.product-actions-menu').forEach(function(menu) {
            menu.style.display = 'none';
        });
        const menu = this.nextElementSibling;
        if (menu) menu.style.display = 'flex';
    });
});
document.addEventListener('click', function() {
    document.querySelectorAll('.product-actions-menu').forEach(function(menu) {
        menu.style.display = 'none';
    });
});

// Evento para el botón Editar
document.querySelectorAll('.menu-edit').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-producto-id');
        if (productos[id]) {
            localStorage.setItem('productoEditar', JSON.stringify(productos[id]));
            window.location.href = 'editar-publicacion.html';
        }
    });
});

//tercer feature

document.querySelectorAll('.menu-stock').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-producto-id');
        if (productos[id]) {
            localStorage.setItem('productoStock', JSON.stringify(productos[id]));
            window.location.href = 'stock.html';
        }
    });
});





//NUEVO
window.guardarStock = function() {
    const data = localStorage.getItem('productoStock');
    if (!data) {
        alert('No se encontró el producto.');
        return;
    }
    const producto = JSON.parse(data);
    const productos = JSON.parse(localStorage.getItem('productos')) || {};

    // Buscar el producto por coincidencia de imagen+descripción+precio+categoría
    let productoId = null;
    for (const id in productos) {
        if (
            productos[id].imagen === producto.imagen &&
            productos[id].descripcion === producto.descripcion &&
            productos[id].precio == producto.precio &&
            productos[id].categoria === producto.categoria
        ) {
            productoId = id;
            break;
        }
    }

    if (!productoId) {
        alert('No se pudo identificar el producto.');
        return;
    }

    // Actualiza los valores
    productos[productoId].vendidos = parseInt(document.getElementById('stockVendidos').value) || 0;
    productos[productoId].stock = parseInt(document.getElementById('stockProducto').value) || 0;

    // Guarda el cambio en localStorage
    localStorage.setItem('productos', JSON.stringify(productos));
    // Actualiza también el productoStock para futuras ediciones rápidas
    localStorage.setItem('productoStock', JSON.stringify(productos[productoId]));

    alert('¡Stock actualizado!');
    window.location.href = 'perfil.html';
};