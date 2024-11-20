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

// Evento de búsqueda de imágenes
document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('query').value;
    if (!query) {
        alert("Por favor, ingresa una palabra clave.");
        return;
    }

    // Realizar la solicitud a la API de búsqueda de imágenes con el token
    const response = await fetch(`/api/search?query=${query}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Usar el token para autenticación
        },
    });

    const data = await response.json();

    const imagesContainer = document.getElementById('images-container');
    imagesContainer.innerHTML = '';  // Limpiar las imágenes anteriores

    if (data.images && data.images.length > 0) {
        data.images.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = query;
            imagesContainer.appendChild(img);
        });
    } else {
        imagesContainer.innerHTML = '<p>No se encontraron imágenes.</p>';
    }
});
