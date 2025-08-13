const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const pool = new Pool({
    user: 'postgres',   
    host: 'localhost',
    database: 'imc_app',
    password: '1234',
    port: 5432,
});

app.post('/calcular', async (req, res) => {
    const { cc, nombre, apellido, edad, estatura, peso, genero } = req.body;

    // Validaciones básicas
    if (!cc || !nombre || !apellido || !edad || !estatura || !peso || !genero) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO imc_registros (cc, nombre, apellido, edad, estatura, peso, genero)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING imc`,
            [cc, nombre, apellido, edad, estatura, peso, genero]
        );

        res.json({ imc: result.rows[0].imc });
    } catch (err) {
    console.error('Error en /calcular:', err); 
    res.status(500).json({ error: err.message, detalle: err.stack });
    }
});

app.get('/registros', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM imc_registros ORDER BY fecha DESC LIMIT 10'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
