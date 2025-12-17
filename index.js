const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000; // Importante para Render

// CONFIGURACIÓN DE CORS (La llave maestra)
app.use(cors({
    origin: '*', // Permite que cualquier sitio (como Vercel) se conecte
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

const leerBaseDeDatos = () => {
    try {
        const datos = fs.readFileSync('./db.json', 'utf-8');
        return JSON.parse(datos);
    } catch (error) { return []; }
};

const guardarEnBaseDeDatos = (nuevosDatos) => {
    fs.writeFileSync('./db.json', JSON.stringify(nuevosDatos, null, 2));
};

// --- RUTA DE LOGIN CON LOGS ---
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, mensaje: "Contraseña incorrecta" });
    }
});

// --- RESTO DE RUTAS ---
app.get('/api/productos', (req, res) => res.json(leerBaseDeDatos()));

app.post('/api/productos', (req, res) => {
    const { password, ...nuevoP } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).send("No");
    const productos = leerBaseDeDatos();
    const productoFinal = { id: Date.now(), ...nuevoP };
    productos.push(productoFinal);
    guardarEnBaseDeDatos(productos);
    res.json(productoFinal);
});

app.delete('/api/productos/:id', (req, res) => {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).send("No");
    const productos = leerBaseDeDatos().filter(p => p.id != req.params.id);
    guardarEnBaseDeDatos(productos);
    res.json({ msg: "borrado" });
});

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));