// 1. Datos semilla para el sistema
const eventosBase = [
    { id: 1, titulo: "Conferencia de IA - BUAP", fecha: "2026-03-15", sede: "Auditorio ICC", tipo: "conferencia", cupo: 50 },
    { id: 2, titulo: "Taller de Bootstrap 5", fecha: "2026-03-20", sede: "Laboratorio 3", tipo: "taller", cupo: 20 },
    { id: 3, titulo: "Congreso de Software", fecha: "2026-04-10", sede: "CCU BUAP", tipo: "congreso", cupo: 100 }
];

// 2. Logica para asegurar persistencia en localStorage
function cargarSistema() {
    const datosGuardados = localStorage.getItem('eventosU');
    if (!datosGuardados) {
        localStorage.setItem('eventosU', JSON.stringify(eventosBase));
        console.log("Sistema Inicializado.");
    }
}

// 3. Renderizado de tarjetas en el HTML
function renderizarEventos(listaFiltrada = null) {
    const contenedor = document.getElementById('contenedor-eventos');
    const todosLosEventos = JSON.parse(localStorage.getItem('eventosU'));
    const eventosAMostrar = listaFiltrada || todosLosEventos;

    contenedor.innerHTML = '';

    if (eventosAMostrar.length === 0) {
        contenedor.innerHTML = '<p class="text-white text-center">No se encontraron eventos.</p>';
        return;
    }

    eventosAMostrar.forEach(evento => {
        const cardHTML = `
            <div class="card shadow-sm h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-primary">${evento.titulo}</h5>
                    <p class="card-text">📅 <b>Fecha:</b> ${evento.fecha}</p>
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
    const todosLosEventos = JSON.parse(localStorage.getItem('eventosU'));
    const textoBusqueda = document.getElementById('input_buscar').value.toLowerCase();
    const tipoSeleccionado = document.getElementById('input_filtro').value.toLowerCase();
    const fechaSeleccionada = document.querySelector('input[type="date"]').value;

    const filtrados = todosLosEventos.filter(evento => {
        const coincideTexto = evento.titulo.toLowerCase().includes(textoBusqueda) || 
                              evento.sede.toLowerCase().includes(textoBusqueda);
        const coincideTipo = tipoSeleccionado === "" || evento.tipo === tipoSeleccionado;
        const coincideFecha = fechaSeleccionada === "" || evento.fecha === fechaSeleccionada;
        return coincideTexto && coincideTipo && coincideFecha;
    });

    renderizarEventos(filtrados);
}

// 5. Inicializacion de eventos y listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarSistema();
    renderizarEventos();

    document.getElementById('input_buscar').addEventListener('input', aplicarFiltros);
    document.getElementById('input_filtro').addEventListener('change', aplicarFiltros);
    document.querySelector('input[type="date"]').addEventListener('change', aplicarFiltros);
});

// Variable para el control del evento seleccionado
let idEventoSeleccionado = null;

// Captura el ID del evento al abrir el modal
function prepararInscripcion(id) {
    idEventoSeleccionado = id;
    console.log("Evento seleccionado ID:", idEventoSeleccionado);
}

// Registro de asistentes y validaciones
document.querySelector('#tarjeta form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    let eventos = JSON.parse(localStorage.getItem('eventosU'));
    let asistentes = JSON.parse(localStorage.getItem('asistentesU')) || [];
    const evento = eventos.find(ev => ev.id === idEventoSeleccionado);

    // Validacion de cupo disponible
    if (evento.cupo <= 0) {
        alert("Lo sentimos, este evento ya no tiene cupos disponibles.");
        return;
    }

    // Validacion de correo duplicado en el mismo evento
    const yaRegistrado = asistentes.find(as => as.idEvento === idEventoSeleccionado && as.email === email);
    if (yaRegistrado) {
        alert("Este correo ya esta registrado para este evento.");
        return;
    }

    // Guardado de nuevo asistente
    const nuevoAsistente = {
        id: Date.now(),
        idEvento: idEventoSeleccionado,
        nombre: nombre,
        email: email,
        telefono: telefono,
        estado: "Pendiente"
    };

    asistentes.push(nuevoAsistente);
    localStorage.setItem('asistentesU', JSON.stringify(asistentes));

    // Actualizacion de cupo en el evento
    evento.cupo -= 1;
    localStorage.setItem('eventosU', JSON.stringify(eventos));

    alert("Inscripcion exitosa.");
    
    this.reset();
    const modalElement = document.getElementById('tarjeta');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Refrescar cards para mostrar cupo actualizado
    renderizarEventos();
});