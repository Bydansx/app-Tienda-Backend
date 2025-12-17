const express = require('express');
const cors = require('cors');
const fs = require('fs'); // IMPORTANTE: Esta es la librería para leer archivos

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- FUNCIONES AUXILIARES (NUESTRO MOTOR DE BASE DE DATOS) ---

// Función para LEER el archivo
const leerBaseDeDatos = () => {
    try {
        const datos = fs.readFileSync('./db.json', 'utf-8'); // Leemos el texto
        return JSON.parse(datos); // Lo convertimos a Array de JavaScript
    } catch (error) {
        console.error("Error al leer la BD:", error);
        return [];
    }
};

// Función para ESCRIBIR en el archivo
const guardarEnBaseDeDatos = (nuevosDatos) => {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(nuevosDatos, null, 2)); // Lo convertimos a texto y guardamos
    } catch (error) {
        console.error("Error al guardar en la BD:", error);
    }
};

// --- RUTAS ---

app.get('/', (req, res) => {
    res.send('<h1>Backend con Persistencia Activo 💾</h1>');
});

// 1. GET: Ahora lee del archivo, no de la memoria
app.get('/api/productos', (req, res) => {
    const productos = leerBaseDeDatos(); // Leemos el archivo db.json
    res.json(productos);
});

// 2. POST: Ahora guarda en el archivo
app.post('/api/productos', (req, res) => {
    console.log("¡Guardando nuevo producto!", req.body);

    const productos = leerBaseDeDatos(); // 1. Traemos lo que ya existe

    const nuevoProducto = {
        id: productos.length + 1,
        ...req.body
    };

    productos.push(nuevoProducto); // 2. Agregamos el nuevo a la lista

    guardarEnBaseDeDatos(productos); // 3. ¡GUARDAMOS EL ARCHIVO ACTUALIZADO!

    res.json({
        mensaje: "Producto guardado permanentemente",
        producto: nuevoProducto
    });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor (con memoria real) listo en http://localhost:${PORT}`);
});