import express from 'express';
import fetch from 'node-fetch';  // Necesario para hacer solicitudes HTTP
import dotenv from 'dotenv';
import path from 'path';  // Necesario para manejar rutas

dotenv.config();  // Cargar las variables de entorno desde .env

const app = express();
const port = 3000;

// Variables de entorno de la API de Unsplash
const UNSPLASH_CLIENT_ID = process.env.UNSPLASH_CLIENT_ID;
const UNSPLASH_CLIENT_SECRET = process.env.UNSPLASH_CLIENT_SECRET;
const UNSPLASH_REDIRECT_URI = process.env.UNSPLASH_REDIRECT_URI;

// Servir archivos estáticos desde la carpeta 'src'
app.use(express.static('src'));

// Ruta para la página de login
app.get('/', (req, res) => {
    const loginPath = path.resolve('src', 'login.html');  // Usar path.resolve para obtener una ruta absoluta
    res.sendFile(loginPath);  // Asegura que login.html se sirva como la página principal
});

// Ruta para iniciar sesión con Unsplash (redirige al login de Unsplash)
app.get('/auth/login', (req, res) => {
    const authUrl = `https://unsplash.com/oauth/authorize?client_id=${UNSPLASH_CLIENT_ID}&redirect_uri=${encodeURIComponent(UNSPLASH_REDIRECT_URI)}&response_type=code&scope=public`;
    res.redirect(authUrl);  // Redirige al flujo de autenticación de Unsplash
});

// Ruta de callback de OAuth de Unsplash
app.get('/callback', async (req, res) => {
    const code = req.query.code;  // Código de autorización que Unsplash nos envía

    if (!code) {
        return res.status(400).send("Authorization code not found.");
    }

    try {
        // Intercambiar el código de autorización por el token de acceso
        const tokenResponse = await fetch("https://unsplash.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: UNSPLASH_CLIENT_ID,
                client_secret: UNSPLASH_CLIENT_SECRET,
                redirect_uri: UNSPLASH_REDIRECT_URI,
                code,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            return res.status(400).send("Failed to obtain access token.");
        }

        // Redirige a index.html con el token en la URL
        res.redirect(`/main.html?token=${accessToken}`);
    } catch (error) {
        console.error("Error in OAuth callback:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Ruta para realizar búsquedas de imágenes
app.get('/api/search', async (req, res) => {
    const query = req.query.query;
    const accessToken = req.headers.authorization?.split(' ')[1];  // Obtener el token de la cabecera de autorización

    if (!accessToken) {
        return res.status(401).json({ error: "No autorizado. Falta token de acceso." });
    }

    const apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,  // Usar el token en la cabecera
            }
        });

        const data = await response.json();
        const images = data.results.map(img => img.urls.regular);  // Extraer las URLs de las imágenes

        res.json({ images });  // Enviar las imágenes al cliente
    } catch (error) {
        console.error("Error al obtener imágenes:", error);
        res.status(500).send("Error al obtener imágenes.");
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
