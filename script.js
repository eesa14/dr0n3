document.addEventListener("DOMContentLoaded", function () {
    let preguntas = [];
    let paginaActual = 0;
    const preguntasPorPagina = 25;

    async function cargarPreguntas() {
        try {
            const respuesta = await fetch("preguntas_con_imagenes.json");
            const data = await respuesta.json();
            preguntas = data.filter(p => p.pregunta && p.opciones.length > 0);
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
            if (!pregunta.pregunta || pregunta.opciones.length === 0) return;

            const divPregunta = document.createElement("div");
            divPregunta.classList.add("pregunta");
            divPregunta.setAttribute("data-index", inicio + index);

            const esMultiple = Array.isArray(pregunta.respuestas_correctas) && pregunta.respuestas_correctas.length > 1;
            const opcionesHtml = pregunta.opciones.map((opcion, i) => {
                const letra = opcion.split(".")[0].trim().toLowerCase();
                return `
                    <label>
                        <input type="${esMultiple ? "checkbox" : "radio"}" name="pregunta-${inicio + index}" value="${letra}">
                        ${opcion}
                    </label><br>
                `;
            }).join("");

            divPregunta.innerHTML = `
                <p><strong>${inicio + index + 1}. ${pregunta.pregunta}</strong></p>
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
        const correctas = pregunta.respuestas_correctas.map(rc => rc.trim().toLowerCase());

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
