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

function validarDatos({ cc, nombre, apellido, edad, estatura, peso, genero }) {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros = /^[0-9]+$/;
    const soloGenero = /^(masculino|femenino)$/i;

    if (!cc || !soloNumeros.test(cc)) return 'La cédula debe ser solo números';
    if (!nombre || !soloLetras.test(nombre)) return 'El nombre solo debe contener letras';
    if (!apellido || !soloLetras.test(apellido)) return 'El apellido solo debe contener letras';
    if (!edad || edad <= 0) return 'La edad debe ser mayor que cero';
    if (!estatura || estatura <= 0) return 'La estatura debe ser mayor que cero';
    if (!peso || peso <= 0) return 'El peso debe ser mayor que cero';
    if (!genero || !soloGenero.test(genero)) return 'El género debe ser "masculino" o "femenino"';
    return null;
}

app.post('/calcular', async (req, res) => {
    let { cc, nombre, apellido, edad, estatura, peso, genero } = req.body;

    estatura = parseFloat(estatura);
    peso = parseFloat(peso);
    edad = parseInt(edad);

    const errorValidacion = validarDatos({ cc, nombre, apellido, edad, estatura, peso, genero });
    if (errorValidacion) {
        return res.status(400).json({ error: errorValidacion });
    }

    try {
        const result = await pool.query(
            `INSERT INTO imc_registros (cc, nombre, apellido, edad, estatura, peso, genero)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING imc, clasificacion`,
            [cc, nombre, apellido, edad, estatura, peso, genero]
        );

        res.json({
            imc: result.rows[0]?.imc ?? 0,
            clasificacion: result.rows[0]?.clasificacion || 'No calculado'
        });
    } catch (err) {
        console.error('Error en /calcular:', err);
        res.status(500).json({ error: err.message });
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
