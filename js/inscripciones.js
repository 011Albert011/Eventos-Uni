// Variable para identificar el evento seleccionado por el usuario
let idEventoSeleccionado = null;

// Funcion que se activa al dar clic en Inscribirme para capturar el ID
function prepararInscripcion(id) {
    idEventoSeleccionado = id;
    console.log("Evento seleccionado ID:", idEventoSeleccionado);
}

// Escucha el envio del formulario en el modal
document.querySelector('#tarjeta form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la pagina se recargue [cite: 39]

    // Captura de datos de los campos Nombre, Email y Telefono [cite: 19, 36]
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    // Recuperacion de datos de eventos y asistentes del localStorage [cite: 41]
    let eventos = JSON.parse(localStorage.getItem('eventosU'));
    let asistentes = JSON.parse(localStorage.getItem('asistentesU')) || [];

    // Localizacion del evento especifico por su ID
    const evento = eventos.find(ev => ev.id === idEventoSeleccionado);

    // Validacion de disponibilidad de cupo [cite: 43, 68]
    if (evento.cupo <= 0) {
        alert("Lo sentimos, este evento ya no tiene cupos disponibles.");
        return;
    }

    // Validacion para evitar correos duplicados en el mismo evento [cite: 46, 70]
    const yaRegistrado = asistentes.find(as => as.idEvento === idEventoSeleccionado && as.email === email);
    if (yaRegistrado) {
        alert("Este correo ya esta registrado para este evento.");
        return;
    }

    // Creacion del objeto para el nuevo asistente [cite: 45]
    const nuevoAsistente = {
        id: Date.now(),
        idEvento: idEventoSeleccionado,
        nombre: nombre,
        email: email,
        telefono: telefono,
        estado: "Pendiente" // Estado inicial requerido por el sistema [cite: 32, 60]
    };

    // Almacenamiento del asistente y actualizacion del cupo [cite: 45, 47]
    asistentes.push(nuevoAsistente);
    localStorage.setItem('asistentesU', JSON.stringify(asistentes));

    evento.cupo -= 1; // Descuento de un lugar en el cupo 
    localStorage.setItem('eventosU', JSON.stringify(eventos));

    // Confirmacion de exito y limpieza de interfaz [cite: 38]
    alert("Inscripcion exitosa.");
    
    this.reset();
    const modalElement = document.getElementById('tarjeta');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Refresca las tarjetas en el Index para mostrar el nuevo cupo [cite: 16]
    if (typeof renderizarEventos === 'function') {
        renderizarEventos();
    }
});