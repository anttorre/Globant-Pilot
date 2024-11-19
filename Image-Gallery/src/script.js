document.getElementById('searchButton').addEventListener('click', async () => {
	const query = document.getElementById('query').value;
	if (!query) {
		alert("Por favor, ingresa una palabra clave.");
		return;
	}

	const response = await fetch(`/api/search?query=${query}`);
	const data = await response.json();

	const imagesContainer = document.getElementById('images-container');
	imagesContainer.innerHTML = ''; // Limpia las imágenes anteriores

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