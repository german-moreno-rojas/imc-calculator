document.getElementById('imcForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cc = document.getElementById('cc').value.trim();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = parseInt(document.getElementById('edad').value);
    const estatura = parseFloat(document.getElementById('estatura').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const genero = document.getElementById('genero').value;

    const res = await fetch('/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cc, nombre, apellido, edad, estatura, peso, genero })
    });

    const data = await res.json();
    if (data.error) {
        document.getElementById('resultado').innerText = data.error;
    } else {
        document.getElementById('resultado').innerText = `Tu IMC es: ${data.imc}`;
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
        `;
        tbody.appendChild(tr);
    });
});
