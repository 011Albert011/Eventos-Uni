// 1. Datos semilla para el sistema (¡Ahora incluyen hora!)
const eventosBase = [
  {
    id: 1,
    titulo: "Conferencia de IA - BUAP",
    fecha: "2026-03-15",
    hora: "20:00",
    sede: "Auditorio ICC",
    tipo: "conferencia",
    cupo: 50,
  },
  {
    id: 2,
    titulo: "Taller de Bootstrap 5",
    fecha: "2026-03-20",
    hora: "23:00",
    sede: "Laboratorio 3",
    tipo: "taller",
    cupo: 20,
  },
  {
    id: 3,
    titulo: "Congreso de Software",
    fecha: "2026-04-10",
    hora: "02:00",
    sede: "CCU BUAP",
    tipo: "congreso",
    cupo: 100,
  },
];

// 2. Logica para asegurar persistencia en localStorage
function cargarSistema() {
  const datosGuardados = localStorage.getItem("eventosU");
  if (!datosGuardados) {
    localStorage.setItem("eventosU", JSON.stringify(eventosBase));
    console.log("Sistema Inicializado.");
  }
}

// 3. Renderizado de tarjetas en el HTML
function renderizarEventos(listaFiltrada = null) {
  const contenedor = document.getElementById("contenedor-eventos");
  const todosLosEventos = JSON.parse(localStorage.getItem("eventosU"));
  const eventosAMostrar = listaFiltrada || todosLosEventos;

  contenedor.innerHTML = "";

  if (eventosAMostrar.length === 0) {
    contenedor.innerHTML =
      '<p class="text-white text-center">No se encontraron eventos.</p>';
    return;
  }

  eventosAMostrar.forEach((evento) => {
    const cardHTML = `
            <div class="card shadow-sm h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-primary">${evento.titulo}</h5>
                    <p class="card-text">📅 <b>Fecha:</b> ${evento.fecha}</p>
                    <p class="card-text">⏰ <b>Hora:</b> ${evento.hora || "No definida"}</p>
                    <p class="card-text">📍 <b>Sede:</b> ${evento.sede}</p>
                    <p class="card-text">🏷️ <b>Tipo:</b> <span class="badge bg-info text-dark">${evento.tipo}</span></p>
                    <p class="card-text">👥 <b>Cupo restante:</b> ${evento.cupo}</p>
                    <div class="mt-auto text-end">
                        <button class="btn btn-success" 
                                data-bs-toggle="modal" 
                                data-bs-target="#tarjeta"
                                onclick="prepararInscripcion(${evento.id})">
                            Inscribirme
                        </button>
                    </div>
                </div>
            </div>
        `;
    contenedor.innerHTML += cardHTML;
  });
}

// 4. Logica de busqueda y filtros
function aplicarFiltros() {
  const todosLosEventos = JSON.parse(localStorage.getItem("eventosU"));
  const textoBusqueda = document
    .getElementById("input_buscar")
    .value.toLowerCase();
  const tipoSeleccionado = document
    .getElementById("input_filtro")
    .value.toLowerCase();
  const fechaSeleccionada = document.querySelector('input[type="date"]').value;

  const filtrados = todosLosEventos.filter((evento) => {
    const coincideTexto =
      evento.titulo.toLowerCase().includes(textoBusqueda) ||
      evento.sede.toLowerCase().includes(textoBusqueda);
    const coincideTipo =
      tipoSeleccionado === "" || evento.tipo === tipoSeleccionado;
    const coincideFecha =
      fechaSeleccionada === "" || evento.fecha === fechaSeleccionada;
    return coincideTexto && coincideTipo && coincideFecha;
  });

  renderizarEventos(filtrados);
}

// 5. Inicializacion de eventos y listeners
document.addEventListener("DOMContentLoaded", () => {
  cargarSistema();
  renderizarEventos();

  document
    .getElementById("input_buscar")
    .addEventListener("input", aplicarFiltros);
  document
    .getElementById("input_filtro")
    .addEventListener("change", aplicarFiltros);
  document
    .querySelector('input[type="date"]')
    .addEventListener("change", aplicarFiltros);
});
