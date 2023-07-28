'use strict';

window.addEventListener("load", function () {
  /*elementos del html*/
  let irJuego = document.getElementById("empezar");
  let mensajeNombre = document.getElementById("mensajeNombre");
  let preguntaNombre = document.getElementById("preguntaNombre");
  let confirmarUsuario = document.getElementById("confirmarUsuario");
  let guardarDatos = document.getElementsByName("guardar");
  let nombreGuardado;
  /*eventos para clickar en soy yo cuando pregunte si soy el usuario
    y evento de empezar a jugar*/
  confirmarUsuario.addEventListener("click", soyYo);
  irJuego.addEventListener("click", RecogerDatos);

  /*en esta funcion recogemos los datos del nombre y la dificultad
    si el usuario no se ha rellenado saltara un mensaje de error
    cuando se rellene miraremos si hemos decidido guardar el usuario, si es asi lo guardaremos en el local storage
    pasaremos el usuario y la dificultad por el web storage para mostrarlos en la pagina del juego 
    */
  function RecogerDatos() {
    let nombreJugador = document.getElementById("nombre").value;
    let dificultad = document.getElementById("dificultad").value;
    if (nombreJugador == "") {
      mensajeNombre.innerHTML = "Tienes que poner un nombre de usuario";
      mensajeNombre.style.color = "red";
    } else {
      let selected = Array.from(guardarDatos).find((radio) => radio.checked);
      if (selected.value == "si") {
        localStorage.setItem("nombreJugador", nombreJugador);
      } else if (selected.value == "no") {
        localStorage.clear();
      }
      sessionStorage.setItem("nombreJugador", nombreJugador);
      sessionStorage.setItem("dificultad", dificultad);
      window.location.href = "cartas.html";
    }
  }
  /*En este if decimos que si el nombreJugador esta guardado en el local storage
    lo mostraremos y le preguntaremos al usuario si es el
    */
  if (
    localStorage.getItem("nombreJugador") !== undefined &&
    localStorage.getItem("nombreJugador")
  ) {
    nombreGuardado = localStorage.getItem("nombreJugador");
    nombreGuardado;
    preguntaNombre.innerHTML = " eres " + nombreGuardado + "?";
  } else {
    confirmarUsuario.style.visibility = "hidden";
  }
  /*esta funcion es cuando le damos al boton de confirmar que eres ese usuario
    lo que hara es pasar por el websotrage el nombre y la dificultad*/
  function soyYo() {
    sessionStorage.setItem("nombreJugador", nombreGuardado);
    let dificultad = document.getElementById("dificultad").value;
    sessionStorage.setItem("dificultad", dificultad);
    window.location.href = "cartas.html";
  }
});
