// Variable para el ID del evento
let idEventoSeleccionado = null;

// Captura el ID al dar clic en el boton de la card
function prepararInscripcion(id) {
    idEventoSeleccionado = id;
    console.log("ID guardado:", idEventoSeleccionado);
}

// Escucha el envio del formulario
document.querySelector('#tarjeta form').addEventListener('submit', function(e) {
    e.preventDefault(); 

    // Captura valores y limpia espacios en blanco
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    // Validacion: Si falta algun dato, se detiene aqui
    if (!nombre || !email || !telefono) {
        alert("Por favor, llena todos los campos antes de enviar.");
        return; 
    }

    // Validacion: Verifica que el telefono tenga 10 digitos
    if (telefono.length !== 10 || isNaN(telefono)) {
        alert("El telefono debe tener 10 numeros.");
        return;
    }

    // Obtiene datos del almacenamiento local
    let eventos = JSON.parse(localStorage.getItem('eventosU')) || [];
    let asistentes = JSON.parse(localStorage.getItem('asistentesU')) || [];

    // Busca el evento seleccionado
    const evento = eventos.find(ev => ev.id === idEventoSeleccionado);

    // Revisa si todavia hay lugares
    if (!evento || evento.cupo <= 0) {
        alert("Ya no hay cupos para este evento.");
        return;
    }

    // Revisa si el correo ya existe en este evento
    const duplicado = asistentes.find(as => as.idEvento === idEventoSeleccionado && as.email === email);
    if (duplicado) {
        alert("Este correo ya esta registrado aqui.");
        return;
    }

    // Crea el objeto del nuevo asistente
    const nuevoAsistente = {
        id: Date.now(),
        idEvento: idEventoSeleccionado,
        nombre: nombre,
        email: email,
        telefono: telefono,
        estado: "Pendiente" 
    };

    // Guarda al asistente y actualiza el cupo
    asistentes.push(nuevoAsistente);
    localStorage.setItem('asistentesU', JSON.stringify(asistentes));

    evento.cupo -= 1; 
    localStorage.setItem('eventosU', JSON.stringify(eventos));

    alert("¡Inscripcion exitosa!");
    
    // Limpia el formulario y cierra el modal
    this.reset();
    const modalElement = document.getElementById('tarjeta');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    // Actualiza las cards en el index
    if (typeof renderizarEventos === 'function') {
        renderizarEventos();
    }
});