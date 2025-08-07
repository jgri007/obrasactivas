let version = "© 2023 Guti (2023-10-10)";

let dHoy = new Date();
let fDesde = new Date(dHoy.getFullYear(), dHoy.getMonth() - 48, dHoy.getDate() + 1); // > Últimos 48 meses

let obrasFiltradas;

inFechaDesde.valueAsDate = fDesde;
//inFechaHasta.valueAsDate = dHoy;

console.log("Inicio");

function inicio() {
  // Se ejecuta cuando se carga la página porque lo he puesto en <body onload="inicio();">
  // TimeStamp + Nombre de la función (Para depuración)
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name);
  console.log("Página cargada");

}

const spain = { lat: 36.7, lng: -6.9 };
var centroMapa = spain;
var zoomInicial = 6;


// Initialize the map
async function initMap() {
  // TimeStamp + Nombre de la función (Para depuración)
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name);

  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: centroMapa,
    minZoom: 3,
    zoom: zoomInicial,
    clickableIcons: false,
    zoomControl: true,
    fullscreenControl: true,
  });

  filtrarObras();
  initMarkers();
  clusterMarkers();
}


function filtrarObras() {
  // TimeStamp + Nombre de la función (Para depuración)
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name);

  obrasFiltradas = []; // Creo matriz 

  let dHoy = new Date();
  let diasNovedad = 10;
  let fNovedad = new Date(dHoy.getFullYear(), dHoy.getMonth(), dHoy.getDate() - diasNovedad); 
  console.log("Fecha Novedad: ", fNovedad, Number(fNovedad));

  for (let i = 0; i < obras.length; i++) {
    if (parseInt(obras[i].nviviendas) >= inViviendasDesde.value ) {   // Si NumeroDeViviendas > valor
      if (fechaConvert(obras[i].publicacion) >= inFechaDesde.valueAsNumber) { // Y FechaPublicacion > valor
        if (Novedad.checked) {
          if (fechaConvert(obras[i].publicacion) >= Number(fNovedad)) {   
            obras[i].estadooportunidad = "novedad";   
            obrasFiltradas.push(obras[i]); 
          }
        }
        if (Perdida.checked) {
          if (obras[i].estadooportunidad == "Perdida" ) { // Y Perdida
            obrasFiltradas.push(obras[i]); 
          }
        }
        if (Ganada.checked) {
          if (obras[i].estadooportunidad == "Ganada" ) { // O Ganada
            obrasFiltradas.push(obras[i]); 
          }
        }
        if (Pendiente.checked) {
          if (obras[i].estadooportunidad == "Pendiente" || obras[i].estadooportunidad == "- Activa") {  // O Pendiente O Activa
            obrasFiltradas.push(obras[i]); 
          }
        }

      }
    }
  }

  let statusTxt = "Mostradas " + obrasFiltradas.length + " obras de " + obras.length;
  console.log(statusTxt);
  resumen.innerHTML = statusTxt;

  console.log("Se han añadido " + obrasFiltradas.length + " obras al mapa.");
}


function buscar() {
  // TimeStamp + Nombre de la función (Para depuración)
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name);

  console.log("Ganada: " + Ganada.checked);

  zoomInicial = map.getZoom();
  centroMapa = map.getCenter();
  initMap();
}


var markers;



function initMarkers() {
  // TimeStamp + Nombre de la función (Para depuración)
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name);
  console.log("Obras Filtradas: " + obrasFiltradas.length);

  markers = []; // Creo matriz de markers

  for (let i = 0; i < obrasFiltradas.length; i++) {

    const latLng = new google.maps.LatLng(
      obrasFiltradas[i].latitude,
      obrasFiltradas[i].longitude
    );

    switch (obrasFiltradas[i].estadooportunidad.toLowerCase()) {
      case "ganada":
        //icono = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
        icono = "icono-casa-48-verde.png"; //icons8-hunt-48
        break;
      case "perdida":
        //icono = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
        icono = "icono-casa-48-rojo.png";
        break;
      case "novedad":
        icono = "icono-casa-48-violeta.png";
        break;
      default:
        //icono = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
        icono = "icono-casa-48-azul.png";
    }




    var marker = new google.maps.Marker({
      position: latLng,
      title: obrasFiltradas[i].descripcion,
      icon: icono,
      //label: obrasFiltradas[i].idobra,
      map: map,
    });

    markers.push(marker); // añado marker al final de la matriz

    const infowindow = new google.maps.InfoWindow({
      content: contenidoInfowindow(obrasFiltradas[i]),
    });

    var prev_infowindow = false;
    marker.addListener("click", () => {
      if (prev_infowindow) {
        // Cierro la infowindow que pudiera estar abierta
        prev_infowindow.close();
      }
      prev_infowindow = infowindow;
      infowindow.open({
        anchor: markers[i],
        map,
        shouldFocus: true,
      });
    });
  }
}

function clusterMarkers() {
  // TimeStamp + Nombre de la función (Para depuración)
  //console.log(new Date().toLocaleString() + " - " + arguments.callee.name);
  // Add a marker clusterer to manage the markers.
  new MarkerClusterer(map, markers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  });
}

function contenidoInfowindow(obra) {
  // Selecciono el estilo con el que se van a mostrar ciertos campos
  // TimeStamp + Nombre de la función (Para depuración)
  //console.log(new Date().toLocaleString() + " - " + arguments.callee.name);

  switch (obra.estadooportunidad.toLowerCase()) {
    case "ganada":
      estOp = '<span class="resalta ganada">';
      break;
    case "perdida":
      estOp = '<span class="resalta perdida">';
      break;
    case "novedad":
      estOp = '<span class="resalta novedad">';
      break;
    default:
      estOp = '<span class="resalta pendiente">';
  }
  return (
    //'<font face="sans serif">' +
    '<table style="width:100%">' +
    "<tr><th colspan=6><hr><h2>" +
    estOp +
    obra.descripcion +
    "</span>" +
    "</h2><hr></th></tr>" +
    "<tr><td><b>N. Viviendas:</b></td> <td>" +
    obra.nviviendas +
    "</td>" +
    "<td><b>Publicacion:</b></td> <td>" +
    obra.publicacion +
    "</td>" +
    "<td><b>Id:</b></td> <td>" +
    estOp +
    obra.idobra +
    "</span>" +
    "</td></tr>" +
    '<tr> <th colspan="6"><hr></th> </tr>' +
    '<tr><td><b>Direccion:</b></td> <td colspan="5">' +
    obra.direccion +
    "</td></tr>" +
    '<td><b>Localizacion:</b></td> <td colspan="3">' +
    '<a href="https://google.com/maps/place/' +
    obra.latitude +
    "," +
    obra.longitude +
    '">' +
    obra.latitude +
    "," +
    obra.longitude +
    " (" +
    obra.notaslocalizacion +
    " )</td></tr>" +
    '<td><b>Registro visita:</b></td> <td colspan="3">' +
    '<a href="https://docs.google.com/forms/d/e/1FAIpQLSeiHKFBuupwUNDenTAU43OynJFFKuZ_fQyJwUIAW3G0YcYuNw/viewform?usp=pp_url&entry.761727091=' +
    obra.idobra +
    '">Formulario registro obra (' +
    obra.idobra +
    ")</a></td></tr>" +
    '<tr> <th colspan="6"><hr></th> </tr>' +
    '<tr> <td><b>Promotor:</b></td> <td colspan="5">' +
    obra.promotor +
    "</td></tr>" +
    '<tr> <td><b>Arquitectura:</b></td> <td colspan="5">' +
    obra.arquitectura +
    "</td></tr>" +
    '<tr> <td><b>Constructor:</b></td> <td colspan="5">' +
    obra.constructor +
    "</td></tr>" +
    '<tr> <th colspan="6"><hr></th> </tr>' +
    "<tr> <td><b>Presupuesto:</b></td> <td>" +
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(obra.presupuesto) +
    "</td>" +
    "<td><b>Por vivienda:</b></td> <td>" +
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(obra.presupuestoporvivienda) +
    "</td>" +
    '<tr> <th colspan="6"><hr></th> </tr>' +
    "<tr> <td><b>Tipo obra:</b></td> <td>" +
    obra.tipo +
    "</td>" +
    "<td><b>Fecha inicio:</b></td> <td>" +
    obra.inicio +
    "</td></tr>" +
    "<tr> <td><b>Duracion:</b></td> <td>" +
    obra.duracion +
    " meses</td>" +
    "<td><b>Fecha fin prevista:</b></td> <td>" +
    obra.fin +
    "</td></tr>" +
    '<tr> <th colspan="6"><hr></th> </tr>' +
    "<tr> <td><b>Estado oportunidad:</b></td> <td>" +
    estOp +
    obra.estadooportunidad +
    "</span>" +
    "</td>" +
    "<td><b>Marca ganadora:</b></td> <td>" +
    obra.marcaganadora +
    "</td></tr>" +
    "<tr> <td><b>Estado:</b></td> <td colspan=5>" +
    obra.estado +
    " (" +
    obra.ultimoreporte +
    " - " +
    obra.autorestado +
    ")" +
    "</td></tr>" +
    "<tr> <td><b>Nota:</b></td> <td colspan=5>" +
    obra.nota +
    " (" +
    obra.ultimanota +
    " - " +
    obra.autornota +
    ")" +
    "</td></tr>" +
    "<tr> <th colspan=6><hr></th> </tr>" +
    "</table>"
  );
}

function dondeEstoy() {
  // Localiza la posición del navegador y hace un zoom cercano a la zona
  // TimeStamp + Nombre de la función (Para depuración)
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name);
  infoWindow = new google.maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        document.getElementById("resumen").innerHTML =
          "Localizacion encontrada. Coordenadas: " +
          position.coords.latitude.toFixed(4) +
          " , " +
          position.coords.longitude.toFixed(4);

        map.setCenter(pos);
        map.setZoom(20);
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn"t support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function oculta() {
  // TimeStamp + Nombre de la función (Para depuración)
  console.log(new Date().toLocaleString() + " - " + arguments.callee.name);
  document.getElementById("info").style.display = "none";
}

function fechaConvert(f) {
  //Convierte la fecha f en formato dd/mm/aaaa xxxxxxx a formato Date UTC ¡Importante lo de UTC para comparaciones!
  let fe = f.substring(0,10); // Por si aparte de dd/mm/aaaa lleva la hora ....
  var arrFecha = fe.split("/");
  var anno = arrFecha[2];
  var mes = arrFecha[1];
  var dia = arrFecha[0];
  var mydate = Date.UTC(anno, mes - 1, dia);
  //console.log(mydate);

  return mydate;
}
