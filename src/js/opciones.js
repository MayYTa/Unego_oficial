document.querySelectorAll('.top-right-actions .fa-ellipsis-h').forEach(function(icon) {
    icon.addEventListener('click', function(e) {
        e.stopPropagation();
        // Cierra otros menús
        document.querySelectorAll('.product-actions-menu').forEach(function(menu) {
            menu.style.display = 'none';
        });
        // Abre el menú de este producto
        const menu = this.nextElementSibling;
        if (menu) menu.style.display = 'flex';
    });
});
// Cierra el menú si se hace clic fuera
document.addEventListener('click', function() {
    document.querySelectorAll('.product-actions-menu').forEach(function(menu) {
        menu.style.display = 'none';
    });
});

//opciones nuevas para edicion de publicacion
// Datos de ejemplo, puedes agregar más productos
const productos = {
    "polo-negro-1": {
        imagen: "assets/img/polo.png",
        descripcion: "Polo negro de algodón, talla M, poco uso.",
        precio: 12.00,
        categoria: "Ropa",
        stock: 5
    },
    "mochila-1": {
        imagen: "assets/img/mochila.png",
        descripcion: "Mochila resistente, color azul, varios bolsillos.",
        precio: 35.00,
        categoria: "Accesorios",
        stock: 2
    }
};

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