import express from "express";
import fetch from "node-fetch"; // Cambiado a import

const app = express();
const port = 3000;

app.use(express.static('src'));

app.get('/api/search', async (req, res) => {
    const query = req.query.query;
    const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=vilWVaxiGRiWGBnGrM3fFm1CWpdU7uTEog03C87Qxjw`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extraer las URLs de las imágenes
        const images = data.results.map(img => img.urls.regular);

        // Enviar las imágenes al cliente
        res.json({ images });
    } catch (error) {
        console.error("Error al obtener imágenes:", error);
        res.status(500).send("Error al obtener imágenes.");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:3000`);
});
