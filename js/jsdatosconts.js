const nombre=document.querySelector("#nombre");
const email=document.querySelector("#email");
const mensaje=document.querySelector("#mensaje");

let datos={
    emailUser:email,
    mensajeUser:mensaje,
}
const Usuario=JSON.stringify(datos)
localStorage.setItem('Usuario '+nombre, Usuario);
//Convertirlo a objeto nuevamente
const convertirAObj=JSON.parse(Usuario)
console.log()