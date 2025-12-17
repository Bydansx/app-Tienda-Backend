const express = require('express');
const cors = require("cors");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN CORS BLINDADA Y CORREGIDA ---
app.use(cors({
    origin: [
        "http://localhost:5173", // Tu local
        "https://app-tienda-frontend-bydansxs-projects.vercel.app", // Tu producción
        "https://app-tienda-frontend-git-main-bydansxs-projects.vercel.app" // ¡ESTA ERA LA QUE FALTABA EN TU ERROR!
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Esto responde automáticamente a las preguntas de seguridad del navegador
app.options('*', cors());

app.use(express.json());

// --- BASE DE DATOS ---
const leerBaseDeDatos = () => {
    try {
        const datos = fs.readFileSync('./db.json', 'utf-8');
        return JSON.parse(datos);
    } catch (error) { return []; }
};

const guardarEnBaseDeDatos = (nuevosDatos) => {
    fs.writeFileSync('./db.json', JSON.stringify(nuevosDatos, null, 2));
};

// --- RUTAS ---
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get('/api/productos', (req, res) => {
    res.json(leerBaseDeDatos());
});

app.post('/api/productos', (req, res) => {
    const { password, ...nuevoP } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({msg: "Clave mal"});

    const productos = leerBaseDeDatos();
    const productoFinal = { id: Date.now(), ...nuevoP };
    productos.push(productoFinal);
    guardarEnBaseDeDatos(productos);
    res.json(productoFinal);
});

// RUTA PUT (EDITAR)
app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { password, ...datos } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({msg: "Clave mal"});

    let productos = leerBaseDeDatos();
    const index = productos.findIndex(p => p.id == id);

    if (index !== -1) {
        productos[index] = { ...productos[index], ...datos };
        guardarEnBaseDeDatos(productos);
        res.json({ msg: "Actualizado" });
    } else {
        res.status(404).json({ msg: "No encontrado" });
    }
});

app.delete('/api/productos/:id', (req, res) => {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({msg: "Clave mal"});

    const productos = leerBaseDeDatos().filter(p => p.id != req.params.id);
    guardarEnBaseDeDatos(productos);
    res.json({ msg: "Borrado" });
});

// Mensaje cambiado para forzar detección de Git en WebStorm
app.listen(PORT, () => console.log(`Servidor ACTUALIZADO corriendo en puerto ${PORT}`));