function validarFormulario(cc, nombre, apellido, edad, estatura, peso, genero) {
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

document.getElementById('imcForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cc = document.getElementById('cc').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const estatura = parseFloat(document.getElementById('estatura').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const genero = document.getElementById('genero').value.trim();

    const error = validarFormulario(cc, nombre, apellido, edad, estatura, peso, genero);
    if (error) {
        document.getElementById('resultado').innerText = error;
        return;
    }

    const res = await fetch('/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cc, nombre, apellido, edad, estatura, peso, genero })
    });

    const data = await res.json();
    if (data.error) {
        document.getElementById('resultado').innerText = data.error;
    } else {
        document.getElementById('resultado').innerText =
            `Tu IMC es: ${data.imc}`;
    }
});

document.getElementById('cargarBtn').addEventListener('click', async () => {
    const res = await fetch('/registros');
    const data = await res.json();
    const tbody = document.getElementById('tablaRegistros');
    tbody.innerHTML = '';
    data.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.cc}</td>
            <td>${r.nombre}</td>
            <td>${r.apellido}</td>
            <td>${r.edad}</td>
            <td>${r.genero}</td>
            <td>${new Date(r.fecha).toLocaleString()}</td>
            <td>${r.estatura}</td>
            <td>${r.peso}</td>
            <td>${r.imc}</td>
            <td>${r.clasificacion}</td>
        `;
        tbody.appendChild(tr);
    });
});
