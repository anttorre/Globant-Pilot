   // Función para cargar favoritos desde localStorage
   function loadFavorites() {
	const favoritesContainer = document.getElementById('favorites-images-container');
	favoritesContainer.innerHTML = '';
	const favoriteImages = JSON.parse(localStorage.getItem('favorites')) || [];

	if (favoriteImages.length > 0) {
		favoriteImages.forEach(url => {
			const imageWrapper = document.createElement('div');
			imageWrapper.className = 'favorite-item';

			const img = document.createElement('img');
			img.src = url;
			img.alt = "Imagen favorita";

			const deleteButton = document.createElement('button');
			deleteButton.className = 'delete-button';
			deleteButton.textContent = '🗑️';
			deleteButton.addEventListener('click', () => {
				removeFavorite(url);
			});

			imageWrapper.appendChild(img);
			imageWrapper.appendChild(deleteButton);
			favoritesContainer.appendChild(imageWrapper);
		});
	} else {
		favoritesContainer.innerHTML = '<p>No tienes imágenes favoritas aún.</p>';
	}
}

// Función para eliminar una imagen de favoritos
function removeFavorite(imageUrl) {
	const favoriteImages = JSON.parse(localStorage.getItem('favorites')) || [];
	const updatedFavorites = favoriteImages.filter(url => url !== imageUrl);

	localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
	loadFavorites(); // Recargar la lista visualmente
}

// Inicializar la página de favoritos
document.addEventListener('DOMContentLoaded', () => {
	loadFavorites();

	// Botón de logout
	document.getElementById('logoutButton').addEventListener('click', () => {
		localStorage.removeItem('unsplash_token');
		window.location.href = '/'; // Redirigir al login
	});
});