// Función para obtener parámetros de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Intentar recuperar el token desde el Local Storage
let token = localStorage.getItem('unsplash_token');

// Verificar si el token está en la URL (después del login)
const urlToken = getQueryParam('token');
if (urlToken) {
    // Guardar el token en el Local Storage
    localStorage.setItem('unsplash_token', urlToken);
    token = urlToken;

    // Limpiar la URL para eliminar el token
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
}

// Si no hay token, redirigir a la página de login
if (!token) {
    window.location.href = '/';  // Redirige al login.html
} else {
    // Si hay token, mostramos el botón de logout
    document.getElementById('logoutButton').style.display = 'inline-block';  // Mostrar el botón de logout
}

// Evento de logout
document.getElementById('logoutButton').addEventListener('click', () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('unsplash_token');

    // Redirigir al login
    window.location.href = '/';  // Redirige a login.html
});

// Función para gestionar favoritos
// Función para alternar favoritos
function toggleFavorite(imageUrl) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(imageUrl);

    if (index > -1) {
        // Si ya está en favoritos, eliminarla
        favorites.splice(index, 1);
    } else {
        // Si no está en favoritos, añadirla
        favorites.push(imageUrl);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Función para verificar si una imagen es favorita
function isFavorite(imageUrl) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(imageUrl);
}

// Evento para buscar imágenes
document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('query').value;
    if (!query) {
        alert("Por favor, ingresa una palabra clave.");
        return;
    }

    const response = await fetch(`/api/search?query=${query}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    const imagesContainer = document.getElementById('images-container');
    imagesContainer.innerHTML = '';

    if (data.images && data.images.length > 0) {
        data.images.forEach(url => {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'image-wrapper';

            const img = document.createElement('img');
            img.src = url;
            img.alt = query;

            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = isFavorite(url) ? '★' : '☆'; // Estrella llena o vacía
            favoriteButton.className = 'favorite-button';
            favoriteButton.addEventListener('click', () => {
                toggleFavorite(url);
                favoriteButton.textContent = isFavorite(url) ? '★' : '☆';
            });

            imageWrapper.appendChild(img);
            imageWrapper.appendChild(favoriteButton);
            imagesContainer.appendChild(imageWrapper);
        });
    } else {
        imagesContainer.innerHTML = '<p>No se encontraron imágenes.</p>';
    }
});

// Evento para redirigir a la página de favoritos
document.getElementById('favoritesLink').addEventListener('click', () => {
    window.location.href = 'favoritos.html';
});
