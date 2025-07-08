document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const notificationIcon = document.getElementById('notification-icon');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');
    const clearButton = document.getElementById('clear-notifications');
    
    // Cargar notificaciones desde localStorage
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // Función para renderizar notificaciones
    function renderNotifications() {
        notificationList.innerHTML = '';
        
        // Contar notificaciones no leídas
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
        
        // Mostrar "No hay notificaciones" si está vacío
        if (notifications.length === 0) {
            notificationList.innerHTML = '<div class="notification-item">No hay notificaciones</div>';
            return;
        }
        
        // Mostrar cada notificación
        notifications.forEach(notif => {
            const notifElement = document.createElement('div');
            notifElement.className = `notification-item ${notif.read ? '' : 'unread'}`;
            
            // Formatear fecha relativa (ej: "Hace 2 horas")
            const timeAgo = formatTimeAgo(new Date(notif.timestamp));
            
            notifElement.innerHTML = `
                <p>${notif.message}</p>
                <span class="notification-time">${timeAgo}</span>
            `;
            
            notificationList.appendChild(notifElement);
        });
    }
    
    // Función para formatear fecha relativa
    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return "Hace unos segundos";
        if (seconds < 3600) return `Hace ${Math.floor(seconds/60)} minutos`;
        if (seconds < 86400) return `Hace ${Math.floor(seconds/3600)} horas`;
        return `Hace ${Math.floor(seconds/86400)} días`;
    }
    
    // Abrir/cerrar dropdown
    notificationIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
        
        // Marcar como leídas al abrir
        if (notificationDropdown.classList.contains('show')) {
            notifications = notifications.map(n => ({...n, read: true}));
            localStorage.setItem('notifications', JSON.stringify(notifications));
            renderNotifications();
        }
    });
    
    // Cerrar al hacer clic fuera - CORRECCIÓN AQUÍ
    document.addEventListener('click', function(e) {
        if (!notificationDropdown.contains(e.target) && !notificationIcon.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
    
    // Limpiar notificaciones
    clearButton.addEventListener('click', function() {
        notifications = [];
        localStorage.setItem('notifications', JSON.stringify(notifications));
        renderNotifications();
    });
    
    // Función global para agregar notificaciones
    window.addNotification = function(message) {
        const newNotification = {
            id: Date.now(),
            message: message,
            timestamp: new Date().toISOString(),
            read: false
        };
        notifications.unshift(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        renderNotifications();
    }
    
    // Inicializar
    renderNotifications();
});

// Ejemplo de notificaciones (eliminar en producción)
setTimeout(() => {
    window.addNotification("El producto 'Polo negro en diferentes tallas' ha bajado de precio a S/.12");
}, 2000);

setTimeout(() => {
    window.addNotification("Nuevo stock disponible para 'Pastel de Chocolate'");
}, 4000);