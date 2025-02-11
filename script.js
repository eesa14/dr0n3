document.addEventListener("DOMContentLoaded", function () {
    const contenedorPreguntas = document.getElementById("contenedor-preguntas");
    const btnAnterior = document.getElementById("anterior");
    const btnSiguiente = document.getElementById("siguiente");
    const paginaInfo = document.getElementById("pagina-info");

    let preguntas = [];
    let paginaActual = 1;
    const preguntasPorPagina = 50; // Ahora muestra 50 preguntas por página

    // Cargar el archivo JSON desde GitHub Pages
    fetch("https://eesa14.github.io/dr0n3/preguntas_con_imagenes.json")
        .then(response => response.json())
        .then(data => {
            preguntas = data;
            mostrarPreguntas();
        })
        .catch(error => console.error("Error al cargar las preguntas:", error));

    function mostrarPreguntas() {
        contenedorPreguntas.innerHTML = "";
        const inicio = (paginaActual - 1) * preguntasPorPagina;
        const fin = inicio + preguntasPorPagina;
        const preguntasPagina = preguntas.slice(inicio, fin);

        preguntasPagina.forEach((pregunta, index) => {
            const preguntaDiv = document.createElement("div");
            preguntaDiv.classList.add("pregunta");
            preguntaDiv.innerHTML = `<strong>${inicio + index + 1}.- ${pregunta.pregunta}</strong>`;

            pregunta.opciones.forEach(opcion => {
                const opcionDiv = document.createElement("div");
                opcionDiv.classList.add("opcion");
                opcionDiv.innerHTML = `<input type="checkbox" name="pregunta${inicio + index}" value="${opcion}"> ${opcion}`;
                preguntaDiv.appendChild(opcionDiv);
            });

            contenedorPreguntas.appendChild(preguntaDiv);
        });

        paginaInfo.textContent = `Página ${paginaActual} de ${Math.ceil(preguntas.length / preguntasPorPagina)}`;

        btnAnterior.disabled = paginaActual === 1;
        btnSiguiente.disabled = paginaActual === Math.ceil(preguntas.length / preguntasPorPagina);
    }

    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPreguntas();
        }
    });

    btnSiguiente.addEventListener("click", () => {
        if (paginaActual < Math.ceil(preguntas.length / preguntasPorPagina)) {
            paginaActual++;
            mostrarPreguntas();
        }
    });
});
