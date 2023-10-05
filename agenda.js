//Clase Evento
class Evento {
    constructor(id, titulo, fecha_inicio, fecha_fin, tipo, descripcion) {
        this.id = id;
        this.title = titulo;
        this.start = fecha_inicio;
        this.end = fecha_fin;
        //Segun el tipo de evento, se asigna un color usando un switch
        switch (tipo) {
            case "Cumpleaños":
                this.backgroundColor= '#CECEF6';
                this.borderColor = 'darkblue';
                this.textColor = 'black';
                break;
            case "Eventos":
                this.backgroundColor = '#D8F6CE';
                this.borderColor = 'darkred';
                this.textColor = 'black';
                break;
            case "Feriados":
                this.backgroundColor = '#f49aee';
                this.borderColor = 'darkorange';
                this.textColor = 'black';
                break;
        }
        this.extendedProps = {
            descripcion: descripcion,
            tipo: tipo
        };
    }
}

// Array de eventos
let arrEventos = [];

// Variables para manejar las notas
let notas;
let docYVen;
let vacaciones;
let tareas;
let noOlvidar;
let metasYObj;


//Variables para manejar el formulario
let id = document.getElementById("id");
let titulo = document.getElementById("titulo");
let descripcion = document.getElementById("descripcion");
let fecha_inicio = document.getElementById("fecha");
let hora_inicio = document.getElementById("hora");
let fecha_fin = document.getElementById("fecha_fin");
let hora_fin = document.getElementById("hora_fin");
let tipo = document.getElementById("tipo");
let btnGuardar = document.getElementById("btnGuardar");
let btnEliminar = document.getElementById("btnEliminar");
let btnModificar = document.getElementById("btnModificar");
let btnLimpiar = document.getElementById("btnLimpiar");

let txtNotas = document.getElementById("notas");
let txtDocsYVen = document.getElementById("docsYVen");
let txtVacaciones = document.getElementById("vacaciones");
let txtTareas = document.getElementById("tareas");
let txtNoOlvidar = document.getElementById("noOlvidar");
let txtMetasYObj = document.getElementById("metasYObj");


let id_evento = 0;



//Funcion para guardar el array de eventos en el localStorage
function guardar_eventos() {
    //Convierto el array de eventos a un string
    let eventos_string = JSON.stringify(arrEventos);
    //Guardo el string en el localStorage
    localStorage.setItem("eventos", eventos_string);
}

//Funcion para cargar el array de eventos desde el localStorage
function cargar_eventos() {
    //Obtengo el string del localStorage
    let eventos_string = localStorage.getItem("eventos");
    //Si el string no es nulo
    if (eventos_string != null) {
        //Convierto el string a un array de eventos
        arrEventos = JSON.parse(eventos_string);
        //Recargo el calendario
        cargar_calendario(arrEventos);
        //Seteo los botones del formulario
        setear_botones("Guardar");
    } else {
        cargar_calendario(arrEventos);
    }
}

//Funcion para setear los botonos del formulario
function setear_botones(botones) {
    if (botones == "Guardar") {
        btnGuardar.style.display = "inline-block";
        btnEliminar.style.display = "none";
        btnModificar.style.display = "none";
        btnLimpiar.style.display = "none";
    } else {
        btnGuardar.style.display = "none";
        btnEliminar.style.display = "inline-block";
        btnModificar.style.display = "inline-block";
        btnLimpiar.style.display = "inline-block";
    }
}

//Funcion para agregar un evento
function agregar_evento() {
    //Obtengo los datos del formulario
    //id, titulo, fecha_inicio, fecha_fin, tipo, descripcion
    let start_value = fecha_inicio.value + "T" + hora_inicio.value;
    let end_value = fecha_fin.value + "T" + hora_fin.value;
    //Creo el evento
    let evento = new Evento(arrEventos.length + 1, titulo.value, start_value, end_value, tipo.value, descripcion.value);
    //Agrego el evento al array de eventos
    arrEventos.push(evento);
    //Guardo el array de eventos en el localStorage
    guardar_eventos();
    //Recargo el calendario
    cargar_calendario(arrEventos);
    //Informo que se agrego el evento
    Swal.fire({
        title: "EXITO",
        text: "Se agrego el evento correctamente",
        icon: "success",
        iconColor: "white",
        color: "black",
        background: "#ffc48ce8",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#b0b0b0",
        showClass: {
            popup: "animate__animated animate__backInLeft"
        },
        hideClass: {
            popup: "animate__animated animate__backOutRight"
        }
    });

    //Limpio el formulario
    limpiar_formulario();
}

//Funcion que recibe un id y devuelve el indice del evento en el array de eventos
function buscar_evento(id) {
    //Recorro el array de eventos
    for (let i = 0; i < arrEventos.length; i++) {
        //Si el id del evento es igual al id recibido
        if (arrEventos[i].id == id) {
            //Devuelvo el indice del evento
            return i;
        }
    }
    //Si no se encuentra el evento, devuelvo -1
    return -1;
}

//Funcion para eliminar un evento
function eliminar_evento() {
    //Obtengo el indice del evento a eliminar
    let indice = buscar_evento(id_evento);
    //Pregunto si se quiere eliminar el evento
    Swal.fire({
        title: "¿Estas seguro?",
        text: "No podras recuperar el evento luego de eliminarlo",
        icon: "warning",
        iconColor: "red",
        color: "black",
        background: "#ffc48ce8",
        showCancelButton: true,
        confirmButtonColor: "#b0b0b0",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        //Si se confirma la eliminacion
        if (result.isConfirmed) {
            //Elimino el evento del array de eventos
            arrEventos.splice(indice, 1);
            //Guardo el array de eventos en el localStorage
            guardar_eventos();
            //Recargo el calendario
            cargar_calendario(arrEventos);
            //Limpio el formulario
            limpiar_formulario();
            //Seteo los botones del formulario
            setear_botones("Guardar");
            //Informo que se elimino el evento
            Swal.fire({
                title: "EXITO",
                text: "Se elimino el evento correctamente",
                icon: "success",
                iconColor: "white",
                color: "black",
                background: "#ffc48ce8",
                confirmButtonText: "Continuar",
                confirmButtonColor: "#b0b0b0",
                showClass: {
                    popup: "animate__animated animate__backInLeft"
                },
                hideClass: {
                    popup: "animate__animated animate__backOutRight"
                }
            });
        }
    });
}

//Funcion para modificar un evento
function modificar_evento() {
    //Obtengo el indice del evento a modificar
    let indice = buscar_evento(id_evento);
    //Obtengo los datos del formulario
    //id, titulo, fecha_inicio, fecha_fin, tipo, descripcion
    let start_value = fecha_inicio.value + "T" + hora_inicio.value;
    let end_value = fecha_fin.value + "T" + hora_fin.value;
    //Modifico el evento
    arrEventos[indice].title = titulo.value;
    arrEventos[indice].start = start_value;
    arrEventos[indice].end = end_value;
    arrEventos[indice].extendedProps.descripcion = descripcion.value;
    arrEventos[indice].extendedProps.tipo = tipo.value;
    //Actualizo el color del evento
    switch (tipo.value) {
        case "Cumpleaños":
            arrEventos[indice].backgroundColor = '#CECEF6';
            arrEventos[indice].borderColor = 'darkblue';
            arrEventos[indice].textColor = 'black';
            break;
        case "Eventos":
            arrEventos[indice].backgroundColor = '#D8F6CE';
            arrEventos[indice].borderColor = 'darkred';
            arrEventos[indice].textColor = 'black';
            break;
        case "Feriados":
            arrEventos[indice].backgroundColor = '#f49aee';
            arrEventos[indice].borderColor = 'darkorange';
            arrEventos[indice].textColor = 'black';
            break;
    }
    //Guardo el array de eventos en el localStorage
    guardar_eventos();
    //Recargo el calendario
    cargar_calendario(arrEventos);
    //Informo que se modifico el evento
    Swal.fire({
        title: "EXITO",
        text: "Se modifico el evento correctamente",
        icon: "success",
        iconColor: "white",
        color: "black",
        background: "#ffc48ce8",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#b0b0b0",
        showClass: {
            popup: "animate__animated animate__backInLeft"
        },
        hideClass: {
            popup: "animate__animated animate__backOutRight"
        }
    });
    //Limpio el formulario
    limpiar_formulario();
    //Seteo los botones del formulario
    setear_botones("Guardar");
}

//Funcion para limpiar el formulario
function limpiar_formulario() {
    titulo.value = "";
    descripcion.value = "";
    fecha_inicio.value = "";
    hora_inicio.value = "12:00";
    fecha_fin.value = "";
    hora_fin.value = "13:00";
    tipo.value = tipo.options[0].value;
}

//Funcion que recibe un evento y lo carga en el formulario
function cargar_evento(evento) {
    //Cargo los campos del formulario
    id_evento = evento.id;
    titulo.value = evento.title;
    descripcion.value = evento.extendedProps.descripcion;
    let fecha_inicio_completa = evento.start;
    //Obtengo la fecha y hora de inicio separando la fecha completa por el caracter "T"
    let fecha_inicio = fecha_inicio_completa.split("T")[0];
    let hora_inicio = fecha_inicio_completa.split("T")[1];
    //Cargo los campos de fecha y hora de inicio
    fecha.value = fecha_inicio;
    hora.value = hora_inicio;
    let fecha_fin_completa = evento.end;
    //Obtengo la fecha y hora de fin separando la fecha completa por el caracter "T"
    let fecha_fin_traida = fecha_fin_completa.split("T")[0];
    let hora_fin_traida = fecha_fin_completa.split("T")[1];
    //Cargo los campos de fecha y hora de fin
    fecha_fin.value = fecha_fin_traida;
    hora_fin.value = hora_fin_traida;
    tipo.value = evento.extendedProps.tipo;
    //Seteo los botones del formulario
    setear_botones("Modificar");
}

//Funcion para cargar las notas desde el localStorage
function cargar_notas() {
    //Obtengo las notas del localStorage
    if (localStorage.getItem("notas") != null) {
        notas = localStorage.getItem("notas");
        txtNotas.value = notas;
    }
    if (localStorage.getItem("docsYVen") != null) {
        docYVen = localStorage.getItem("docsYVen");
        txtDocsYVen.value = docYVen;
    }
    if (localStorage.getItem("vacaciones") != null) {
        vacaciones = localStorage.getItem("vacaciones");
        txtVacaciones.value = vacaciones;
    }
    if (localStorage.getItem("tareas") != null) {
        tareas = localStorage.getItem("tareas");
        txtTareas.value = tareas;
    }
    if (localStorage.getItem("noOlvidar") != null) {
        noOlvidar = localStorage.getItem("noOlvidar");
        txtNoOlvidar.value = noOlvidar;
    }
    if (localStorage.getItem("metasYObj") != null) {
        metasYObj = localStorage.getItem("metasYObj");
        txtMetasYObj.value = metasYObj;
    }
}

//EVENTOS
// Evento para cargar los eventos del localStorage cuando se carga la pagina
window.addEventListener("load", cargar_eventos);
// Evento para setear los botones del formulario al cargar la pagina
window.addEventListener("load", function () {
    setear_botones("Guardar");
});
// Evento para cargar las notas del localStorage cuando se carga la pagina
window.addEventListener("load", cargar_notas);
// Evento para cuando se hacen cambios en fecha y se coloca la misma en el campo de fecha fin
fecha.addEventListener("change", function () {
    fecha_fin.value = fecha.value;
});
// Evento para cuando se hace click en el boton limpiar se limpia el formulario y se setean los botones en guardar
btnLimpiar.addEventListener("click", function () {
    limpiar_formulario();
    setear_botones("Guardar");
});
// Evento para que cuando se escriba y salaga de un campo de texto se guarde en el localStorage
// Eventos para que 
txtNotas.addEventListener("blur", function () {
    localStorage.setItem("notas", txtNotas.value);
});
txtDocsYVen.addEventListener("blur", function () {
    localStorage.setItem("docsYVen", txtDocsYVen.value);
}
);
txtVacaciones.addEventListener("blur", function () {
    localStorage.setItem("vacaciones", txtVacaciones.value);
}
);
txtTareas.addEventListener("blur", function () {
    localStorage.setItem("tareas", txtTareas.value);
}
);
txtNoOlvidar.addEventListener("blur", function () {
    localStorage.setItem("noOlvidar", txtNoOlvidar.value);
}
);
txtMetasYObj.addEventListener("blur", function () {
    localStorage.setItem("metasYObj", txtMetasYObj.value);
}
);
// Evento para cuando se hace click en el boton modificar
btnModificar.addEventListener("click", modificar_evento);
// Evento para cuando se hacen cambios en hora y se coloca una hora mas en el campo de hora fin
hora_inicio.addEventListener("change", function () {
    // Obtenemos la hora
    let hora = hora_inicio.value;
    // Agregamos una hora
    let hora_fin_value = (parseInt(hora.split(":")[0]) + 1).toString().padStart(2, "0") + ":" + hora.split(":")[1];
    // Cargamos el campo de hora fin
    hora_fin.value = hora_fin_value;
});
// Evento para cuando se hace click en el boton guardar
btnGuardar.addEventListener("click", agregar_evento);
// Evento para cuando se hace click en el boton borrar
btnEliminar.addEventListener("click", eliminar_evento);




// CALENDARIO
// Funcion para cargar el calendario
function cargar_calendario(eventos_recibidos) {
    // Obtengo el elemento donde se muestra el calendario
    let calendarEl = document.getElementById("calendar");
    // Creo el calendario
    let calendar = new FullCalendar.Calendar(calendarEl, {
        // Configuro el calendario
        initialView: "dayGridMonth",
        locale: "es",
        //color de la letra
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        },
        buttonText: {
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            list: "Lista",
        },
        
        events: eventos_recibidos,
        //Funcion para mostrar los eventos
        eventClick: function (info) {
            //Obtengo los datos del evento
            let indice = buscar_evento(info.event.id);
            let evento = arrEventos[indice];
            //Cargo el evento en el formulario
            cargar_evento(evento);

        },
        
    });
    // Muestro el calendario
    calendar.render();
}

// CLIMA
//Evento para cargar el clima al iniciar la pagina
window.addEventListener("load", cargar_clima);
//Funcion para cargar el clima
function cargar_clima() {
    let latitud = 0;
    let longitud = 0;
    let apikey = "fabc27230f0e2cfb02ae6b3e1164b84e";
    //Obtengo lat y lon de la ciudad utilizando el navegador
    navigator.geolocation.getCurrentPosition(function (position) {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
    });

    let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitud + "&lon=" + longitud + "&units=metric&lang=es&appid=" + apikey;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Hacer algo con los datos obtenidos
            mostrar_clima(data);
        })
        .catch(error => {
            // Manejar el error si ocurre
            console.error("Error al cargar clima:", error);
        });
}
//Funcion para mostrar el clima
function mostrar_clima(data) {
    //Obtengo el elemento donde se muestra la imagen del clima
    let imagenElement = document.getElementById("imagen_clima");
    //Muestro la imagen del clima
    imagenElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    //Obtengo el elemento donde se muestra el estado del clima
    let estadoElement = document.getElementById("estado");
    //Muestro el estado del clima
    estadoElement.innerHTML = `${data.weather[0].description}`;
    //Obtengo los elementos donde se muestra el clima
    let temperaturaElement = document.getElementById("temperatura");
    let vientoElement = document.getElementById("viento");
    //Muestro los datos obtenidos
    temperaturaElement.innerHTML = `${data.main.temp} °C`;
    vientoElement.innerHTML = `${data.wind.speed} km/h`;
}
