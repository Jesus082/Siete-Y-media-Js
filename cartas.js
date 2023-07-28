"use strict";
/*evento que esperara que se carge toda la pagina*/
window.addEventListener("load", function () {
  /*Variables para los objetos */
  let baraja;
  let cartas = [];
  /*los puntos del jugador y de la banca*/
  let puntsJugador = 0;
  let puntsBanca = 0;
  /*todos los elementos que recojo del html*/
  let cartasSacadas = document.getElementById("cartasSacadas");
  let cartasSacadasBanca = document.getElementById("cartasSacadasBanca");
  let contadorEmpieza = document.getElementById("contadorEmpieza");
  let jugadores = document.getElementById("jugadores");
  let puntosEscribir = document.getElementById("puntosJugador");
  let puntosEscribirBanca = document.getElementById("puntosBanca");
  let mensajeFinal = document.getElementById("mensajeFinal");
  let mensajeEsperaBanca = document.getElementById("bancaEspera");
  let quedanSegundos = document.getElementById("quedanSegundos");
  let nombreJugador = document.getElementById("playerJugador");
  let volverAjugar = document.getElementById("volverAjugar");
  let volverAtras = document.getElementById("volverAtras");
  let jugar = document.getElementById("jugar");
  let plantar = document.getElementById("plantar");

  /*variables booleanas que uso para saber si se ha plantado o nos hemos pasado de puntos*/
  let seHaPlantado = false;
  let pasadoPuntos = false;
  /*variable que se usara en el contador de empezar el juego*/
  let juegoEmpiezaEn = 3;
  let victorias = 0;
  let derrotas = 0;
  /*Aqui miro si existe algun nombre guardado en el sessionStorage, si existe el nombre del jugador sera ese, si no el nombre por defecto
    sera Jugador1*/
  if (sessionStorage.getItem("nombreJugador") !== undefined && sessionStorage.getItem("nombreJugador")) {
    nombreJugador.innerHTML = sessionStorage.getItem("nombreJugador");
  } else {
    nombreJugador.innerHTML = "Jugador1";
  }

  /*variable segundos que se usara en el contador de tiempo para escoger carta*/
  let segundos;
  /*Aqui comprobamos si existe algun valor de dificultad(segundos que puedo tardar en cojer carta)
    si existe se lo asignaremos a la variable segundos, si no los segundos por defecto seran 5*/
  if (sessionStorage.getItem("dificultad") !== undefined && sessionStorage.getItem("dificultad")) {
    segundos = sessionStorage.getItem("dificultad");
  } else {
    segundos = 5;
  }
  /*botones de jugar y plantarse*/
  jugar.addEventListener("click", jugando);
  plantar.addEventListener("click", plantarse);
  volverAjugar.style.visibility = "hidden";
  volverAtras.style.visibility = "hidden";
  volverAjugar.addEventListener("click", volverAjugarfn);
  volverAtras.addEventListener("click", volverAtrasfn);

  /*ponemos esto en invisible y cuando llamemos a la funcion partidaEmpieza y esta termine se pondran visibles de nuevo*/
  mensajeFinal.style.visibility = "hidden";
  jugadores.style.visibility = "hidden";
  mensajeEsperaBanca.style.color = "white";

  partidaEmpieza();

  /*clase carta*/
  class Carta {
    constructor(palo, num) {
      this.palo = palo;
      this.num = num;
    }
  }

  /*Clase baraja*/
  class Baraja {
    constructor() {
      this.mazo = [] = this.mazo = [];
    }
    /*funcion sacarCarta*/
    sacarCarta() {
      return this.mazo.pop();
    }
    /*funcion inicializar que lo que hara es crear los objetos carta e introducirlos en un array para luego trabajar con ello */
    inicializar() {
      const palos = ["Oros", "Copas", "Espadas", "Bastos"];
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 11; j++) {
          cartas.push(new Carta(palos[i], j));
        }
      }
    }
    /*funcion barajar lo que hara es introducir en el mazo que hay en la clase baraja las cartas que hemos creado anteriormente de forma aleatoria*/
    barajar() {
      while (cartas.length >= 1) {
        let cartaRandom = Math.floor(Math.random() * cartas.length);
        this.mazo.push(cartas[cartaRandom]);
        cartas.splice(cartaRandom, 1);
      }
    }
  }
  /*creamos un nuevo objeto baraja, la inicializamo(creamos las cartas) y las barajamos*/
  baraja = new Baraja();
  baraja.inicializar();
  baraja.barajar();

  /*esta funcion se ejecutara cada vez que pulsemos sacar carta*/
  function jugando() {
    /*primero sacara una carta y la pasara por la funcion de valor(nos dira cuantos puntos vale la carta)*/
    let cartaSacada = baraja.sacarCarta();
    let valor = valorCarta(cartaSacada.num);
    /*vamos sumando los puntos que vamos obteniendo*/
    puntsJugador = puntsJugador + valor;
    /*si los puntos superan 7.5 mostramos un mnesaje y ponemos la variable pasadoPuntos en true*/
    if (puntsJugador > 7.5) {
      mensajeFinalNoTime("PIERDES te has pasado de puntos", "red");
      pasadoPuntos = true;
    }
    /*Aqui lo que haremos es ir mostrando en pantalla los puntos que vamos obteniendo y las cartas que vamos obteniendo*/
    puntosEscribir.innerHTML = "tus puntos: " + puntsJugador;
    cartasSacadas.innerHTML += "<img id='carta_jugador' alt='' src='imagenes/" +cartaSacada.num +cartaSacada.palo +".jpg' style='height: 167px; width: 106px; margin-top: 10px; margin-left: 4px;' />";
    /*ponemos los segundos a lo que haya en el storage o en 5 para que el contador que tenemos se reinicie*/
    if (
      sessionStorage.getItem("dificultad") !== undefined &&
      sessionStorage.getItem("dificultad")
    ) {
      segundos = sessionStorage.getItem("dificultad");
    } else {
      segundos = 5;
    }
  }

  /*La funcion plantarse deshabilitara los botones de jugar y pondra la variable seHaPlantado en true, en la funcion actualizar(contador de 5 segundos para cojer carta) explico el porque de estas variables*/
  function plantarse() {
    seHaPlantado = true;
    jugar.disabled = "true";
    plantar.disabled = "true";
  }

  /*funcion banca. Aqui es donde jugara la banca*/
  function banca() {
    /*Quitamos el mensaje que tenemos de que la banca esta esperando*/
    mensajeEsperaBanca.remove();
    /*Aqui decimos que si los puntos de la banca son menores a 7.5 y menores a los puntos del jugador que siga sacando cartas
        al final del if introduzco un setTimeOut de 1 segundo para que vuelva a llamar a la funcion, de esta manera se mostraran las cartas poco a poco
        si la condicion del if no se cumple no se volvera a llamar*/
    if (puntsBanca < 7.5 && puntsBanca < puntsJugador) {
      let cartaSacadasBanca = baraja.sacarCarta();
      let valorCartBanca = valorCarta(cartaSacadasBanca.num);
      puntsBanca = puntsBanca + valorCartBanca;
      puntosEscribirBanca.innerHTML = "Puntos de la banca: " + puntsBanca;
      cartasSacadasBanca.innerHTML +="<img id='carta_banca' alt='' src='imagenes/" + cartaSacadasBanca.num + cartaSacadasBanca.palo + ".jpg' style='height: 167px; width: 106px; margin-top: 10px; margin-left: 4px;' />";
      setTimeout(banca, 1E3);
    } else {
      /*cuando el if termine diremos que si los puntos de la banca son mayores o igual a los del jugador y menores o igual que 7.5 ganara la banca, si no ganara el jugador*/
      if (puntsBanca >= puntsJugador && puntsBanca <= 7.5) {
        mensajeFinalNoTime("HA GANADO LA BANCA", "red");        
      } else {
        mensajeFinalNoTime("HAS GANADO", "LIGHTGREEN");
      }
    }
  }

  /*con esta funcion valorCarta sacaremos el valor que tienen las cartas que un numero de 8, 9 y 10*/
  function valorCarta(valor) {
    switch (valor) {
      case 8:
        valor = 0.5;
        break;
      case 9:
        valor = 0.5;
        break;
      case 10:
        valor = 0.5;
        break;
    }
    return valor;
  }

  /*la funcion mensajeFinalNoTime la uso para mostrar un mensaje final en medio de la pantalla que no desaparecera
    le paso por parametro el mensaje y el color de fondo del mismo
    cada vez que la llamo deshabilito los botones de jugar*/
  function mensajeFinalNoTime(mensaje2, color2) {
    jugar.disabled = "true";
    plantar.disabled = "true";
    mensajeFinal.style.visibility = "visible";
    volverAjugar.style.visibility = "visible";
    volverAtras.style.visibility = "visible";
    mensajeFinal.style.backgroundColor = color2;
    mensajeFinal.innerHTML = mensaje2;
    mensajeEsperaBanca.remove();
    quedanSegundos.remove();
  }
  /*esta funcion de mensajeTimer es como la funcion de arriba pero este mensaje desaparecera al segundo*/
  function mensajeTimer(mensaje, color) {
    mensajeFinal.style.visibility = "visible";
    mensajeFinal.style.backgroundColor = color;
    mensajeFinal.innerHTML = mensaje;
    setTimeout(() => {
      mensajeFinal.style.visibility = "hidden";
    }, 1000);
  }
  /*esta funcion sirve para cuando iniciamos el programa que nos da un mensaje de el juego empieza en... y un contador de 3 segundos*/
  function partidaEmpieza() {
    contadorEmpieza.innerHTML = "El juego empieza en... " + juegoEmpiezaEn;
    if (juegoEmpiezaEn == 0) {
      /*cuando el contador llege a 0 ponemos los jugadores en visible, eliminamos el mensaje de este contador y llamamos a la funcion actualizar(la que se encarga de darnos 5 segundos para escoger carta)*/
      jugadores.style.visibility = "visible";
      contadorEmpieza.remove();
      mensajeTimer("Empiezas jugando tu!!", "red");
      tiempoCojerCarta();
    } else {
      /*si los segundos no son 0 restaremos 1 a los segundos y volveremos a llamar a la funcion cada segundo*/
      juegoEmpiezaEn--;
      setTimeout(partidaEmpieza, 1e3);
    }
  }
  /*esta funcion sirve para darnos 5 segundos para escoger carta*/
  function tiempoCojerCarta() {
    /*le decimos que si los segundos llegan a 0 o la variable seHaPlantado es true que muestre el mensaje, elimine el mensaje de los segundos y llame a la banca para que juege*/
    if (segundos == 0 || seHaPlantado) {
      if (puntsJugador == 0) {
        mensajeFinalNoTime("HAS PERDIDO", "red");
        return;
      }
      mensajeTimer("TE HAS PLANTADO");
      quedanSegundos.remove();
      banca();
      /*si lo que ha pasado es que me he pasado de puntos se saldra de la funcion con un return; para que no se siga ejecutando nada mas*/
    } else if (pasadoPuntos) {
      return;
    } else {
    /*si no es ninguna seguira restando segundos y llamando a la funcion cada segundo*/
      quedanSegundos.innerHTML = "quedan " + segundos + " segundos";
      segundos = segundos - 1;
      setTimeout(tiempoCojerCarta, 1e3);
    }
  }
  /*funcion para recargar la pagina al darle al boton de volver a jugar*/
  function volverAjugarfn() {
    location.reload();
  }

  /*funcion que cuando pulsemos el boton de volver atras nos mandara al index*/
  function volverAtrasfn() {
    window.location.href = "Index.html";
  }
});
