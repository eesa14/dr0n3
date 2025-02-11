let preguntas = [];
let preguntaActual = 0;

fetch('preguntas_con_imagenes.json')
    .then(response => response.json())
    .then(data => {
        preguntas = data;
        mostrarPregunta();
    })
    .catch(error => console.error('Error cargando JSON:', error));

function mostrarPregunta() {
    const contenedor = document.getElementById('contenedor-preguntas');
    contenedor.innerHTML = '';
    
    if (preguntaActual >= preguntas.length) {
        contenedor.innerHTML = "<h3>Examen completado</h3>";
        return;
    }
    
    let pregunta = preguntas[preguntaActual];
    let preguntaHTML = `<div class='pregunta'><h3>${pregunta.pregunta}</h3>`;
    
    pregunta.opciones.forEach((opcion, index) => {
        preguntaHTML += `<div class='opcion' onclick='seleccionarRespuesta(this, ${index})'>${opcion}</div>`;
    });
    
    preguntaHTML += `</div><button onclick='comprobarRespuesta()'>Comprobar</button><div id='resultado'></div>`;
    contenedor.innerHTML = preguntaHTML;
    document.getElementById('pagina-info').innerText = `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;
}

function seleccionarRespuesta(elemento, index) {
    let opciones = document.querySelectorAll('.opcion');
    opciones.forEach(opcion => opcion.classList.remove('seleccionada', 'respuesta-correcta', 'respuesta-incorrecta'));
    elemento.classList.add('seleccionada');
    elemento.dataset.index = index;
}

function comprobarRespuesta() {
    let seleccion = document.querySelector('.opcion.seleccionada');
    if (!seleccion) {
        alert('Por favor selecciona una respuesta.');
        return;
    }
    
    let indexSeleccionado = parseInt(seleccion.dataset.index);
    let opcionSeleccionada = preguntas[preguntaActual].opciones[indexSeleccionado].trim().toLowerCase();
    let respuestasCorrectas = preguntas[preguntaActual].respuestas_correctas.map(res => res.trim().toLowerCase());
    
    if (respuestasCorrectas.includes(opcionSeleccionada)) {
        seleccion.classList.add('respuesta-correcta');
        document.getElementById('resultado').innerHTML = "<span style='color:green; font-weight:bold;'>Correcto</span>";
    } else {
        seleccion.classList.add('respuesta-incorrecta');
        document.getElementById('resultado').innerHTML = "<span style='color:red; font-weight:bold;'>Incorrecto</span>";
    }
}

document.getElementById('anterior').addEventListener('click', () => {
    if (preguntaActual > 0) {
        preguntaActual--;
        mostrarPregunta();
    }
    actualizarBotones();
});

document.getElementById('siguiente').addEventListener('click', () => {
    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        mostrarPregunta();
    }
    actualizarBotones();
});

function actualizarBotones() {
    document.getElementById('anterior').disabled = preguntaActual === 0;
    document.getElementById('siguiente').disabled = preguntaActual === preguntas.length - 1;
}
