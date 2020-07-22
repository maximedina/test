var turno = "J1";

window.onload = function () {
  var test = new Date;
  //  alert(test);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function seleccionarJugadores() {
  (document.formulario.opcionPartida.value == "nueva") ? nuevaPartida() : partidasGuardadas()
}

function nuevaPartida() {
  document.getElementById("guardadas").style.display = "none";
  document.getElementById("nueva").style.display = "block";
  inicializarTablero(document.formulario.cantJugadores.value);
  if (document.formulario.cantJugadores.value == 3) {
    document.getElementById("nombreJ3").style.display = "block";
    document.getElementById("jugador3").style.display = "block";
  }
  else {
    document.getElementById("nombreJ3").style.display = "none";
    document.getElementById("jugador3").style.display = "none";
  }
}

function inicializarTablero(cantJugadores) {
  turno = "J1";
  document.getElementById("jugador1").style.borderColor = document.formulario.colorJugador1.value;
  document.getElementById("jugador2").style.borderColor = "transparent";
  document.getElementById("jugador3").style.borderColor = "transparent";

  var m = (cantJugadores == 2) ? 6 : 9;
  var n = (cantJugadores == 2) ? 7 : 10;
  var encabezado = document.getElementById("flechas");
  var cuerpo = document.getElementById("tablero");
  var fila = document.createElement("tr");
  var celda, contenido, i, j;
  vaciar(encabezado);
  vaciar(cuerpo);
  for (j = 1; j <= n; j++) {
    celda = document.createElement("th");
    contenido = document.createElement("div");
    contenido.className = "flecha";
    contenido.id = "columna" + j;
    contenido.addEventListener("click", function (e) { insertarFicha(e) });
    celda.appendChild(contenido);
    fila.appendChild(celda);
    // agrega la fila al cuerpo de la tabla
    encabezado.appendChild(fila);
  }
  for (i = 1; i <= m; i++) {
    fila = document.createElement("tr");
    for (j = 1; j <= n; j++) {
      celda = document.createElement("td");
      contenido = document.createElement("div");
      contenido.className = "hueco";
      contenido.id = "celda" + i + j;
      contenido.innerText = i + "-" + j;
      celda.appendChild(contenido);
      fila.appendChild(celda);
      // agrega la fila al cuerpo de la tabla
      cuerpo.appendChild(fila);
    }
  }
}

function vaciar(elemento) {
  while (elemento.childNodes.length > 0)
    elemento.childNodes[0].remove();
}

function partidasGuardadas() {
  inicializarTablero();
  var partidas;
  document.getElementById("guardadas").style.display = "block";
  document.getElementById("nueva").style.display = "none";

  var columnas = document.getElementById('columnas');
  vaciar(columnas);
  var fila = document.createElement('tr');
  var celda = document.createElement('th');
  celda.innerText = "Fecha";
  fila.appendChild(celda);
  celda = document.createElement('th');
  celda.innerText = "Jugador 1";
  fila.appendChild(celda);
  celda = document.createElement('th');
  celda.innerText = "Jugador 2";
  fila.appendChild(celda);
  if (document.formulario.cantJugadores.value == 3) {
    celda = document.createElement('th');
    celda.innerText = "Jugador 3";
    fila.appendChild(celda);
  }
  celda = document.createElement('th');
  celda.innerText = "Turno";
  fila.appendChild(celda);
  columnas.appendChild(fila);

  //condiciones iniciales de fichas azules
  // inicializarFichas
  partidas = localStorage.getItem("partidas" + document.formulario.cantJugadores.value);
  partidas = JSON.parse(partidas);
  //obtengo el cuerpo de la tabla
  var cuerpo = document.getElementById('detalle');
  vaciar(cuerpo);
  // recorro la lista de empleados, creo una fila de tabla por cada registro y una celda por cada atributo del json
  partidas.forEach(partida => {
    var fila = document.createElement('tr');
    fila.onclick = onclickHandler;
    fila.className = (cuerpo.childNodes.length % 2) ? '' : 'alt';
    var celda = document.createElement('td');
    celda.appendChild(document.createTextNode(partida.fecha));
    fila.appendChild(celda);
    celda = document.createElement('td');
    celda.appendChild(document.createTextNode(partida.jugador1));
    fila.appendChild(celda);
    celda = document.createElement('td');
    celda.appendChild(document.createTextNode(partida.jugador2));
    fila.appendChild(celda);
    if (document.formulario.cantJugadores.value == 3) {
      celda = document.createElement('td');
      celda.appendChild(document.createTextNode(partida.jugador3));
      fila.appendChild(celda);
    }
    celda = document.createElement('td');
    celda.appendChild(document.createTextNode(partida.turno));
    fila.appendChild(celda);
    // agrega la fila al cuerpo de la tabla
    cuerpo.appendChild(fila);
  })
}

function guardarPartida() {
  var partidas = [];
  var partida = new Object;
  partida.fecha = new Date;
  partida.jugador1 = document.formulario.nombreJugador1.value;
  partida.jugador2 = document.formulario.nombreJugador2.value;
  partida.tiempoJugador1 = document.getElementById("tiempoJ1").innerText;
  partida.tiempoJugador2 = document.getElementById("tiempoJ2").innerText;
  partida.colorJugador1 = document.formulario.colorJugador1.value;
  partida.colorJugador2 = document.formulario.colorJugador2.value;
  partida.turno = turno;
  partida.jugadasJugador1 = obtenerFichas("J1");
  partida.jugadasJugador2 = obtenerFichas("J2");
  if (document.formulario.cantJugadores.value == 3) {
    partida.jugador3 = document.formulario.nombreJugador3.value;
    partida.tiempoJugador3 = document.getElementById("tiempoJ3").innerText;
    partida.colorJugador3 = document.formulario.colorJugador3.value;
    partida.jugadasJugador3 = obtenerFichas("J3");
  }
  partidas = (localStorage.getItem("partidas" + document.formulario.cantJugadores.value) ? JSON.parse(localStorage.getItem("partidas" + document.formulario.cantJugadores.value)) : []);
  alert(partidas);
  partidas.push(partida);
  localStorage.setItem("partidas" + document.formulario.cantJugadores.value, JSON.stringify(partidas));
}

function obtenerFichas(jugador) {
  var jugadas = document.getElementsByClassName(jugador);
  var fichasJugador = [];
  for (ficha of jugadas) {
    fichasJugador.push(ficha.id)
  }
  return fichasJugador;
}

function ocultarTablero() {
  document.getElementById("tablero").style.visibility = "collapse";
}
function mostrarTablero() {
  document.getElementById("tablero").style.visibility = "";
}

function insertarFicha(e) {
  if (document.getElementById("resultado").innerHTML == "") {
    var columna = e.target.id.substring(e.target.id.length - 1);
    var hueco, celda;
    var i = (document.formulario.cantJugadores.value == 2) ? 6 : 9;
    //verificar en toda la columna la posicion y el color a ocupar 
    for (i; i > 0; i--) {
      var celda = "celda" + i + columna;
      var hueco = document.getElementById(celda);
      if (hueco.className == "hueco") {
        hueco.className = turno;
        //verifico si termino el juego con ganador o empate
        var finHorizontal = false;//verificar(1, i, "horizontal");
        var finVertical = false;//verificar(columna, 1, "vertical");
        /* var finDiagonalAbajo=verificar(columna,i,"diagonalAbajo");
        var finDiagonalArriba=verificar(columna,i,"diagonalArriba"); */
        if (finHorizontal == "azul" || finVertical == "azul" || finHorizontal == "amarillo" || finVertical == "amarillo") {
          document.getElementById("resultado").innerHTML = "GAN&Oacute;!";
          break;
        }
        var huecos = document.getElementsByClassName("hueco");
        if (huecos.length == 0) {
          document.getElementById("resultado").innerHTML = "EMPATE";
          break;
        }
        //cambio el turno y guardo el avance en localstorage
        asignarTurno(turno);
        break;
      }
    }
  }
}

function asignarTurno(t) {
  if (t == "J1") {
    turno = "J2";
    document.getElementById("jugador1").style.borderColor = "transparent";
    document.getElementById("jugador2").style.borderColor = document.formulario.colorJugador2.value;
    document.getElementById("jugador3").style.borderColor = "transparent";
  }
  else if ((t == "J2" && document.formulario.cantJugadores.value == 2) || t == "J3") {
    turno = "J1";
    document.getElementById("jugador1").style.borderColor = document.formulario.colorJugador1.value;
    document.getElementById("jugador2").style.borderColor = "transparent";
    document.getElementById("jugador3").style.borderColor = "transparent";
  }
  else {
    turno = "J3";
    document.getElementById("jugador1").style.borderColor = "transparent";
    document.getElementById("jugador2").style.borderColor = "transparent";
    document.getElementById("jugador3").style.borderColor = document.formulario.colorJugador3.value;
  }
}

function verificar(columna, fila, sentido) {
  var azul = 0;
  var amarillo = 0;
  var celda;
  var cantidad;
  if (sentido == "vertical") {
    cantidad = 6;
  }
  else {
    cantidad = 7;
  }
  for (var i = 1; i <= cantidad; i++) {
    switch (sentido) {
      case "horizontal":
        celda = "celda" + i + fila;
        break;
      case "vertical":
        celda = "celda" + columna + i;
        break;
      case "diagonalAbajo":
        celda = "celda" + (parseInt(columna) + i - 1) + (parseInt(fila) + i - 1);
        break;
      case "diagonalArriba":

        break;
    }
    if (document.getElementById(celda).className != "hueco") {
      if (document.getElementById(celda).className == "fichaAzul") {
        amarillo = 0;
        azul++;
        if (azul == 4) break;
      }
      else {
        azul = 0;
        amarillo++;
        if (amarillo == 4) break;
      }
    }
    else {
      amarillo = 0;
      azul = 0;
    }
  }
  if (azul == 4) {
    return "azul";
  }
  else if (amarillo == 4) {
    return "amarillo";
  }
  else {
    return "ninguno"
  }
}



function reiniciar() {
  /*   for (var i = 1; i <= 7; i++) {
      for (var j = 1; j <= 6; j++) {
        document.getElementById("celda" + i + j).className = "hueco";
      }
    }
    document.getElementById("resultado").innerHTML = "";
    localStorage.clear(); */
}

function iniciarJuego() {
  incrementarCronometro();
}

function incrementarCronometro() {
  if (turno == "fichaAzul") {
    alert(Date.parse(document.getElementById("cronoAzul").innerText) + 1);
    document.getElementById("cronoAzul").innerText = Date.parse(document.getElementById("cronoAzul").innerText) + 1;
  }
  timeout = setTimeout("incrementarCronometro()", 1000);
}

var seleccionado = null;            //contiene la fila seleccionada

function onclickHandler() {
  if (seleccionado == this) {
    this.style.backgroundColor = "transparent";
    seleccionado = null;
  }
  else {
    if (seleccionado != null)
      seleccionado.style.backgroundColor = "transparent";
    this.style.backgroundColor = "rgb(231, 129, 129)";
    seleccionado = this;
  }
  inicializarTablero();
  //alert(this.childNodes[0].innerText);
  // inicializarFichas
  partidas = localStorage.getItem("partidas" + document.formulario.cantJugadores.value);
  partidas = JSON.parse(partidas);
  //obtengo el cuerpo de la tabla
  if (partidas != null) {
    partidas.forEach(partida => {
      if (partida.fecha == this.childNodes[0].innerText) {
        document.getElementById("nombreJugador1").value = partida.nombreJugador1;
        document.getElementById("nombreJugador2").value = partida.nombreJugador2;
        document.getElementById("tiempoJ1").innerText = partida.tiempoJugador1;
        document.getElementById("tiempoJ2").innerText = partida.tiempoJugador1;
        document.getElementById("colorJugador1").value = partida.colorJugador1;
        document.getElementById("colorJugador2").value = partida.colorJugador2;
        if (document.formulario.cantJugadores.value == 3) {
          document.getElementById("nombreJugador3").value = partida.nombreJugador3;
          document.getElementById("tiempoJ3").innerText = partida.tiempoJugador3;
          document.getElementById("colorJugador3").value = partida.colorJugador3;
          asignarTurno(partida.turno);
          for (celda of partida.jugadasJugador3) {
            document.getElementById(celda).className = "J3";
          }
        }
        for (celda of partida.jugadasJugador1) {
          document.getElementById(celda).className = "J1";
        }
        for (celda of partida.jugadasJugador2) {
          document.getElementById(celda).className = "J2";
        }
      }
    })
  }
}


/* function anadir() {
    var tr=document.createElement("TR");
    var celdas=["Curso","Asignatura","Convocatoria","Nota","Número Créditos"];
    for( var i in celdas ) {
        var td=document.createElement("TD");
        var txt=document.createTextNode( window.prompt(celdas[i],"a") );
        td.appendChild(txt);
        tr.appendChild(td);
    }
    tr.onclick=onclickHandler;
    document.getElementById("tabla").appendChild(tr);
}

function eliminar() {
    if(seleccionado==null) return alert("Seleccione una fila haciendo click sobre ella");
    seleccionado.parentNode.removeChild(seleccionado);
} */