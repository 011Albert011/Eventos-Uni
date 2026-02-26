document.addEventListener("DOMContentLoaded", () => {
  const formEvento = document.getElementById("form-evento");
  const inputFecha = document.getElementById("fecha");

  // Bloquear fechas pasadas
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  inputFecha.min = hoy.toISOString().slice(0, 16);

  formEvento.addEventListener("submit", function (e) {
    e.preventDefault();

    // 1. Tomamos el valor crudo del input (ej: "2026-03-15T20:00")
    const fechaHoraCruda = document.getElementById("fecha").value;

    // 2. Lo dividimos en un arreglo separando por la letra "T"
    const partesFechaHora = fechaHoraCruda.split("T");

    // partesFechaHora[0] tendrá la fecha: "2026-03-15"
    // partesFechaHora[1] tendrá la hora: "20:00"

    const nuevoEvento = {
      id: Date.now(),
      titulo: document.getElementById("titulo").value,
      tipo: document.getElementById("tipo").value.toLowerCase(),
      fecha: partesFechaHora[0], // Guardamos la fecha sola
      hora: partesFechaHora[1], // Guardamos la hora sola
      sede: document.getElementById("sede").value,
      cupo: parseInt(document.getElementById("cupo").value),
      descripcion: document.getElementById("descripcion").value,
    };

    let listaEventos = JSON.parse(localStorage.getItem("eventosU")) || [];
    listaEventos.push(nuevoEvento);
    localStorage.setItem("eventosU", JSON.stringify(listaEventos));

    alert("¡Evento creado exitosamente!");
    formEvento.reset();
  });
});
