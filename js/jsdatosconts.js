// Funcion para procesar el formulario de contacto
function guardar() {
    // Captura de valores por ID
    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const mensaje = document.querySelector("#mensaje").value.trim();
    
    // Expresion regular para verificar formato de correo 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificacion de campos obligatorios
    if (nombre === '' || email === '' || mensaje === '') {
        alert("Todos los campos son obligatorios");
        return;
    }

    // Verificacion de email valido 
    if (!emailRegex.test(email)) {
        alert("Ingrese un correo electronico valido");
        return;
    }

    // Guardado opcional en localStorage para persistencia 
    let mensajesPrevios = JSON.parse(localStorage.getItem("mensajes_contacto")) || [];
    mensajesPrevios.push({
        usuario: nombre,
        correo: email,
        texto: mensaje,
        fecha: new Date().toISOString()
    });
    
    localStorage.setItem("mensajes_contacto", JSON.stringify(mensajesPrevios));

    // Confirmacion de envio exitoso 
    alert("Mensaje enviado con exito");
    
    // Limpieza del formulario tras el envio
    document.querySelector("form").reset();
}