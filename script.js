document.addEventListener("DOMContentLoaded", function () {
    let preguntas = [];
    let paginaActual = 0;
    const preguntasPorPagina = 50;

    async function cargarPreguntas() {
        try {
            const respuesta = await fetch("preguntas_con_imagenes.json");
            const data = await respuesta.json();
            preguntas = data.filter(p => p.pregunta && p.opciones.length > 0); // Filtrar preguntas vacías
            mostrarPagina(paginaActual);
        } catch (error) {
            console.error("Error cargando las preguntas:", error);
        }
    }

    function mostrarPagina(pagina) {
        const contenedor = document.getElementById("contenedor-preguntas");
        contenedor.innerHTML = "";

        const inicio = pagina * preguntasPorPagina;
        const fin = Math.min(inicio + preguntasPorPagina, preguntas.length);
        const preguntasPagina = preguntas.slice(inicio, fin);

        preguntasPagina.forEach((pregunta, index) => {
            if (!pregunta.pregunta || pregunta.opciones.length === 0) return; // Saltar preguntas vacías

            const divPregunta = document.createElement("div");
            divPregunta.classList.add("pregunta");

            const esMultiple = Array.isArray(pregunta.respuestas_correctas);
            const opcionesHtml = pregunta.opciones.map((opcion, i) => `
                <label>
                    <input type="${esMultiple ? "checkbox" : "radio"}" name="pregunta-${inicio + index}" value="${opcion[0]}">
                    ${opcion}
                </label><br>
            `).join("");

            // Mostrar imágenes asociadas a las respuestas
            let imagenesHtml = "";
            if (pregunta.imagenes && pregunta.imagenes.length > 0) {
                imagenesHtml = pregunta.imagenes.map(imagen => {
                    return `
                        <div class="imagen-respuesta">
                            <label>${imagen.respuesta}</label>
                            <img src="${imagen.url}" alt="Imagen de la respuesta ${imagen.respuesta}" style="max-width: 100%; height: auto; margin-top: 10px;">
                        </div>
                    `;
                }).join("");
            }

            divPregunta.innerHTML = `
                <p><strong>${pregunta.pregunta}</strong></p>
                ${imagenesHtml}  <!-- Aquí se insertan las imágenes asociadas -->
                ${opcionesHtml}
                <button onclick="verificarRespuesta(${inicio + index})">Comprobar</button>
                <p id="resultado-${inicio + index}" class="resultado"></p>
            `;

            contenedor.appendChild(divPregunta);
        });

        document.getElementById("pagina-info").innerText = `Página ${pagina + 1} de ${Math.ceil(preguntas.length / preguntasPorPagina)}`;
        document.getElementById("anterior").disabled = pagina === 0;
        document.getElementById("siguiente").disabled = fin >= preguntas.length;
    }

    window.verificarRespuesta = function (preguntaIndex) {
        const inputs = document.querySelectorAll(`input[name="pregunta-${preguntaIndex}"]:checked`);
        const seleccionadas = Array.from(inputs).map(input => input.value);
        const resultado = document.getElementById(`resultado-${preguntaIndex}`);

        const pregunta = preguntas[preguntaIndex];
        const correctas = Array.isArray(pregunta.respuestas_correctas) ? pregunta.respuestas_correctas : [pregunta.respuestas_correctas];

        if (arraysIguales(seleccionadas, correctas)) {
            resultado.innerText = "¡Correcto!";
            resultado.className = "respuesta-correcta";
        } else {
            resultado.innerText = "Incorrecto.";
            resultado.className = "respuesta-incorrecta";
        }
    };

    function arraysIguales(arr1, arr2) {
        return arr1.length === arr2.length && arr1.sort().join(",") === arr2.sort().join(",");
    }

    document.getElementById("anterior").addEventListener("click", () => {
        if (paginaActual > 0) {
            paginaActual--;
            mostrarPagina(paginaActual);
        }
    });

    document.getElementById("siguiente").addEventListener("click", () => {
        if ((paginaActual + 1) * preguntasPorPagina < preguntas.length) {
            paginaActual++;
            mostrarPagina(paginaActual);
        }
    });

    cargarPreguntas();
});
