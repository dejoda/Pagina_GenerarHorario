const horarioDiv = document.getElementById("horario");
const horas = [];

// Generar horario cada 15 minutos
for (let h = 7; h <= 23; h++) {
    for (let m = 0; m < 60; m += 15) {
        let horaTexto = (h < 10 ? "0" + h : h) + ":" + (m === 0 ? "00" : (m < 10 ? "0" + m : m));
        horas.push(horaTexto);
    }
}

function generarHorario() {
    horarioDiv.innerHTML = "";
    horarioDiv.innerHTML += `<div></div><div>Lunes</div>
    <div>Martes</div><div>Miercoles</div><div>Jueves</div><div>Viernes</div><div>Sabado</div>`;

    horas.forEach(hora => {
        const esHoraExacta = hora.endsWith(":00");
        // Primera columna: mostrar solo horas exactas
        horarioDiv.innerHTML += `<div class="hora ${esHoraExacta ? '' : 'oculta'}">${hora}</div>`;
        for (let d = 1; d <= 6; d++) {
            horarioDiv.innerHTML += `<div class="celda" data-dia="${d}" data-hora="${hora}"></div>`;
        }
    });
}

function agregarcurso() {
    const curso = document.getElementById("curso").value;
    const dia = document.getElementById("dia").value;
    const inicio = document.getElementById("horaInicio").value;
    const fin = document.getElementById("horaFin").value;
    const profesor = document.getElementById("profesor").value;
    const color = document.getElementById("color").value;

    if (!curso || !inicio || !fin) {
        alert("Completa todos los campos");
        return;
    }

    const [hInicio, mInicio] = inicio.split(":").map(Number);
    const [hFin, mFin] = fin.split(":").map(Number);

    const tInicio = hInicio * 60 + mInicio;
    const tFin = hFin * 60 + mFin;

    if (tInicio >= tFin) {
        alert("La hora de inicio debe ser menor que la de fin");
        return;
    }

    // Debe existir esa marca de 15 min
    if (mInicio % 15 !== 0 || mFin % 15 !== 0) {
        alert("Usa intervalos de 15 minutos (00, 15, 30, 45).");
        return;
    }

    // Celda donde empieza
    const celdaInicio = document.querySelector(
        `[data-dia="${dia}"][data-hora="${inicio}"]`
    );
    if (!celdaInicio) return;

    // Altura REAL de UNA fila de 15 min (gracias a grid-auto-rows = 20px debería ser 20)
    const altoPaso = celdaInicio.offsetHeight;

    // Duración expresada en "bloques" de 15 min
    const bloques = (tFin - tInicio) / 15;

    // Altura total del curso
    const alturaCurso = bloques * altoPaso;

    // Si permites minutos fuera de 15 en el futuro:
    // const offsetDentro = (mInicio % 15) * altoPaso / 15;

    const div = document.createElement("div");
    div.className = "curso";
    div.style.backgroundColor = color;
    div.style.height = alturaCurso + "px";
    div.style.top = "0";     // top dentro de la celda de inicio (ya es la correcta)
    div.style.left = "0";
    div.style.right = "0";

    div.innerHTML = `
        <b>${curso}</b>
        <small>${profesor}</small>
        <small>${inicio}-${fin}</small>
        <button class="eliminar">⛌</button>
    `;

    div.querySelector(".eliminar").addEventListener("click", () => div.remove());

    celdaInicio.appendChild(div);
}

function limpiarHorario() {
    if (confirm("¿Estás seguro de que quieres eliminar todo el horario?")) {
        document.querySelectorAll('.curso').forEach(n => n.remove());
    }
}

function smoothScroll(targetPosition, duration) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Función de aceleración y desaceleración
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Scroll hacia abajo (final de la página)
document.getElementById('scrollDownBtn').addEventListener('click', function () {
    smoothScroll(document.body.scrollHeight, 500); // 500ms = 0.5 segundos
});

// Scroll hacia arriba (inicio)
document.getElementById('scrollUpBtn').addEventListener('click', function () {
    smoothScroll(0, 500);
});

function descargarHorario() {
    const botones = document.querySelectorAll(".acciones, .deslizable");
    botones.forEach(b => b.style.display = "none");

    html2canvas(document.getElementById("horario"), { scale: 2 }).then(canvas => {
        botones.forEach(b => b.style.display = ""); // restaurar
        const enlace = document.createElement("a");
        enlace.href = canvas.toDataURL("image/png");
        enlace.download = "horario.png";
        enlace.click();
    });
}
generarHorario();
