function guardar() {
    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const mensaje = (document.querySelector("#mensaje").value).trim();
    
    if (nombre === '' || email === '' || mensaje === '') {
        alert("No a completado todos los campos");
    }
    else {
        //Obtenemos todos los datos de la localstorage para ahora convertirlo de json string a objeto o creamos un arreglo vacio si este esta vacio 
        let datosObtenidos = JSON.parse(localStorage.getItem("misdatos")) || [];
        //Agregamos mas elementos a la lista con el metodo push
        datosObtenidos.push(
            {
                nombreUser: nombre,
                emailUser: email,
                mensajeUser: mensaje,
            }
        )
        //Lo regresamos a string
        const datosstorage = JSON.stringify(datosObtenidos)
        localStorage.setItem("misdatos", datosstorage)
        console.log(datosObtenidos);
        alert("Los datos han sido guardados correctamente")
    }
}

function buscarDato() {
     
}
