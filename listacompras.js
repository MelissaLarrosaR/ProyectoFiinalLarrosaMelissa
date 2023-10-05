class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}
class Item {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}
class Compra {
    constructor(id, arrItems, total, fecha, hora) {
        this.id = id;
        this.arrItems = arrItems;
        this.total = total;
        this.fecha = fecha;
        this.hora = hora;
    }
}

//Arrays para guardar los productos, items y compras
let arrProductos = [];
let arrItems = [];
let arrCompras = [];

//Array para guardar los items seleccionados
let itemsSeleccionados = [];

//Variables para guardar los inputs
let select_producto = document.getElementById("select_producto");


//Funcion para ordenar las cargas
function cargar() {
    cargar_productos()
        .then(productos => {
            // Hacer algo con los productos cargados
            cargar_select(productos);
        })
        .catch(error => {
            // Manejar el error si ocurre
            console.error("Error al cargar productos:", error);
        });
    cargar_items()
        .then(items => {
            // Hacer algo con los items cargados
            mostrar_items(items);
        })
        .catch(error => {
            // Manejar el error si ocurre
            console.error("Error al cargar items:", error);
        });
    cargar_compras()
        .then(compras => {
            // Hacer algo con las compras cargadas
            cargar_select_compras(compras);
        })
        .catch(error => {
            // Manejar el error si ocurre
            console.error("Error al cargar compras:", error);
        });
    //Cargo el array itemsSeleccionados desde localStorage
    if (localStorage.getItem("itemsSeleccionados") != null) {
        itemsSeleccionados = JSON.parse(localStorage.getItem("itemsSeleccionados"));
    }
    limpiar_campos();
}

//Cargo los arrays desde localStorage
// Función para cargar los productos de localStorage al array y retorna una promesa
function cargar_productos() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem("arrProductos") != null) {
            arrProductos = JSON.parse(localStorage.getItem("arrProductos"));
            resolve(arrProductos); // Resuelve la promesa con los productos cargados
        } else {
            reject("No hay productos en localStorage"); // Rechaza la promesa con un mensaje de error
        }
    });
}
// Función para cargar los items de localStorage al array y retorna una promesa
function cargar_items() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem("arrItems") != null) {
            arrItems = JSON.parse(localStorage.getItem("arrItems"));
            resolve(arrItems); // Resuelve la promesa con los items cargados
        } else {
            reject("No hay items en localStorage"); // Rechaza la promesa con un mensaje de error
        }
    });
}
// Función para cargar las compras de localStorage al array y retorna una promesa
function cargar_compras() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem("arrCompras") != null) {
            arrCompras = JSON.parse(localStorage.getItem("arrCompras"));
            resolve(arrCompras); // Resuelve la promesa con las compras cargadas
        } else {
            reject("No hay compras en localStorage"); // Rechaza la promesa con un mensaje de error
        }
    });
}

//Funcion para cargar los productos en el select del formulario 
function cargar_select(arrProductosRecibido) {
    //Borro los elementos del select
    select_producto.innerHTML = "";
    //Creo la opcion "Otro" para agregar un producto nuevo y la agrego al select
    let opcion = document.createElement("option");
    opcion.innerHTML = "Otro";
    select_producto.appendChild(opcion);
    //Por cada producto del array creo una opcion y la agrego al select
    for (let producto of arrProductosRecibido) {
        //Creo la opcion y la agrego al select
        let opcion = document.createElement("option");
        opcion.innerHTML = producto.nombre;
        select_producto.appendChild(opcion);
    }
}

//Funcion para cargar el select_compas con las compras realizadas
function cargar_select_compras(arrComprasRecibido) {
    //Obtengo el elemento select select_compas
    let select = document.getElementById("select_compras");
    //Borro los elementos del select
    select.innerHTML = "";
    //Creo la opcion "Seleccionar" para seleccionar una compra y la agrego al select
    let opcion = document.createElement("option");
    opcion.innerHTML = "Seleccionar";
    select.appendChild(opcion);
    //Por cada compra del array creo una opcion y la agrego al select
    for (let compra of arrComprasRecibido) {
        //Creo la opcion y la agrego al select
        let opcion = document.createElement("option");
        opcion.innerHTML = compra.id + " - " + compra.fecha + " - " + compra.hora;
        select.appendChild(opcion);
    }

}

//Funcion para mostrar una compra en un sweetalert2 modal
function mostrar_compra() {
    //Obtengo el valor del select
    let texto = document.getElementById("select_compras").value;
    //Si el select es no es "Seleccionar" se muestra la compra
    if (texto != "Seleccionar") {
        let id = texto.split(" - ")[0];
        console.log(id);
        //Busco la compra en el array
        let compra = arrCompras[buscar_compra_por_id(id)];
        //Creo un string con los items de la compra
        let items = "";
        for (let item of compra.arrItems) {
            items += item + "<br>";
        }
        //Muestro la compra en un sweetalert2 modal
        Swal.fire({
            title: "COMPRA",
            html: `<p>Items:</p> ${items} <p><br>Total: $${compra.total}</p>`,
            icon: "info",
            iconColor: "blue",
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
}

//Funcion para mostrar los items del array
function mostrar_items(arrItemsRecibido) {
    //Obtengo el elemento div donde se muestra la lista
    let lista = document.getElementById("lista");
    //Borro los elementos del div
    lista.innerHTML = "";
    //Por cada item del array creo una carta y la agrego al div
    for (let item of arrItemsRecibido) {
        //Obtengo el precio del producto del item utilizando la funcion buscar_precio
        let precioProducto = buscar_precio(item.producto) * item.cantidad;
        //Creo la carta y la igualo a un nuevo elemento div
        let cartaItem = document.createElement("div");
        //Le agrego las clases a la carta
        cartaItem.className = "cartaItem row centrar col-10 col-sm-6 col-md-4 col-lg-4 col-xl-3";
        //Le agrego el contenido a la carta con un template string y agrego un checkbox para seleccionar el item si ya lo compre que se muestra seleccionado si el item esta en el array itemsSeleccionados
        cartaItem.innerHTML = `<div class="titulo col-12 row">
                                    <p class="producto col-9">${item.producto}</p>
                                    <input class="form-check-input col-1" type="checkbox" value="" id="chkComprado" ${buscar_item_seleccionado(item.producto) != -1 ? "checked" : ""}>
                                </div>
                                <div class="dato col-6"> 
                                    <label for="cantidad">Cantidad:</label>
                                    <input type="number" placeholder="Cantidad" class="form-control form-control-cantidad" value="${item.cantidad}">
                                </div>
                                <div class="dato col-6">
                                    <label for="precio">Total:</label>
                                    <input type="number" class="form-control form-control-precio" value="${precioProducto}" disabled>
                                </div>
                                <div class="botones col-12 row">
                                    <button class="btn col-4 modificar"><i class="bi bi-pencil-square"></i></button>    
                                    <button class="btn col-4 cerrar"><i class="bi bi-trash3-fill"></i></button>
                                </div>`;
        //Agrego la carta al div
        lista.appendChild(cartaItem);
    }

    //Evento para borrar un item del array cuando se hace click en el boton borrar
    let botones_borrar = document.querySelectorAll(".cerrar");
    for (let boton of botones_borrar) {
        boton.addEventListener("click", borrar_item);
    }

    // Evento para modificar un item del array cuando se hace click en el boton modificar
    let botones_modificar = document.querySelectorAll(".modificar");
    for (let boton of botones_modificar) {
        boton.addEventListener("click", modificar_item);
    }

    //Evento para agregar el nombre del pruducto al array itemsSeleccionados cuando se hace click en el checkbox
    let checkboxes = document.querySelectorAll("#chkComprado");
    for (let checkbox of checkboxes) {
        checkbox.addEventListener("click", agregar_item_seleccionado);
    }

}

//Guardar los arrays en localStorage
//Funcion para guardar los productos del array en localStorage
function guardar_productos(producto) {
    //Agrego el producto al array
    arrProductos.push(producto);
    //Guardo el array en localStorage con el nombre "arrProductos" 
    //y lo convierto a string con JSON.stringify
    localStorage.setItem("arrProductos", JSON.stringify(arrProductos));
}
//Funcion para guardar los items del array en localStorage
function guardar_items(item) {
    //Agrego el item al array
    arrItems.push(item);
    //Guardo el array en localStorage con el nombre "arrItems"
    //y lo convierto a string con JSON.stringify
    localStorage.setItem("arrItems", JSON.stringify(arrItems));
}
//Funcion para guardar las compras del array en localStorage
function guardar_compras(compra) {
    //Agrego la compra al array
    arrCompras.push(compra);
    //Guardo el array en localStorage con el nombre "arrCompras"
    //y lo convierto a string con JSON.stringify
    localStorage.setItem("arrCompras", JSON.stringify(arrCompras));
}

//Modificar los arrays en localStorage
//Funcion para modificar los productos del array en localStorage
function modificar_productos(producto) {
    //Busco el indice del producto dentro del array
    let indice = buscar_producto_por_nombre(producto.nombre);
    //Modifico el precio del producto en el array utilizando el indice
    arrProductos[indice].precio = producto.precio;
    //actualizo el localStorage
    localStorage.setItem("arrProductos", JSON.stringify(arrProductos));
    //Muestro mensaje de exito
    Swal.fire({
        title: "EXITO",
        text: "Producto modificado",
        icon: "success",
        iconColor: "blue",
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

//Borrar elementos de los array
//Funcion para borrar un producto del array
function borrar_producto() {
    //Si el select es no es "Otro" se borra el producto
    if (select_producto != "Otro") {
        //Preguntar si se quiere borrar el producto y el item con ese producto utilizando sweetalert2
        //let confirmar = confirm("¿Desea borrar el producto y el item con ese producto?");
        Swal.fire({
            title: "¿Está seguro?",
            text: "¿Desea borrar el producto y el item con ese producto?",
            icon: "warning",
            iconColor: "red",
            color: "black",
            background: "#ffc48ce8",
            showCancelButton: true,
            confirmButtonText: "Si, borrar",
            confirmButtonColor: "#b0b0b0",
            cancelButtonText: "No, cancelar",
            cancelButtonColor: "#b0b0b0",
            showClass: {
                popup: "animate__animated animate__backInLeft"
            },
            hideClass: {
                popup: "animate__animated animate__backOutRight"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                confirmar = true;
                //Busco el indice del producto dentro del array
                let indiceProducto = buscar_producto_por_nombre(select_producto);
                //Borro el producto del array
                arrProductos.splice(indiceProducto, 1);
                //actualizo el localStorage
                localStorage.setItem("arrProductos", JSON.stringify(arrProductos));
                //Busco el indice del item dentro del array
                let indiceItem = buscar_item_por_nombre(nombre);
                //Si el item existe en el array se borra
                if (indiceItem != -1) {
                    //Borro el item del array
                    arrItems.splice(indiceItem, 1);
                    //actualizo el localStorage
                    localStorage.setItem("arrItems", JSON.stringify(arrItems));
                }
                //Muestro mensaje de exito
                Swal.fire({
                    title: "ELIMINADO",
                    text: "El producto se borro correctamente",
                    icon: "error",
                    iconColor: "red",
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
                //actualizo la lista
                cargar();
            } else {
                confirmar = false;

            }
        });
        //Si se confirma se borra el producto y el item con ese producto
        if (confirmar == true) {

        }
    } else {
        //Muestro mensaje de error
        Swal.fire({
            title: "ERROR",
            text: "Debes seleccionar un producto",
            icon: "error",
            iconColor: "red",
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

}

//Funcion para agregar un item al array
function agregar_item() {
    //Obtengo los valores de los inputs
    let select_producto = document.getElementById("select_producto").value;
    let nombre = document.getElementById("nombre").value;
    let precio = document.getElementById("precio").value;
    let cantidad = document.getElementById("cantidad").value;

    //Si en el select se selecciona "Otro" se agrega el producto del input
    if (select_producto == "Otro") {
        //Si el input producto esta vacio se muestra un alert
        if (nombre == "") {
            Swal.fire({
                title: "ERROR",
                text: "Debes ingresar un producto",
                icon: "error",
                iconColor: "red",
                color: "black",
                background: "#ffc48ce8",
                confirmButtonText: "Continuar",
                showClass: {
                    popup: "animate__animated animate__backInLeft"
                },
                hideClass: {
                    popup: "animate__animated animate__backOutRight"
                }
            });
            return;
        }
        //Si el producto ya existe en el array se muestra un alert
        if (buscar_producto_por_nombre(nombre) != -1) {
            Swal.fire({
                title: "ERROR",
                text: "El producto ya existe",
                icon: "error",
                iconColor: "red",
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
            return;
        }
        //Si el precio del producto es 0 se muestra un alert
        if (precio < 0 || precio == "") {
            Swal.fire({
                title: "ERROR",
                text: "El precio del producto no puede ser 0",
                icon: "error",
                iconColor: "red",
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
            return;
        }
        //Si la cantidad es 0 se muestra un alert
        if (cantidad < 0 || cantidad == "") {
            Swal.fire({
                title: "ERROR",
                text: "La cantidad no puede ser 0",
                icon: "error",
                iconColor: "red",
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
            return;
        }
        //Si el producto no existe en el array se agrega
        let nuevo_producto = new Producto(nombre, precio);
        guardar_productos(nuevo_producto);
        //Creo un item con el producto y la cantidad
        let nuevo_item = new Item(nombre, cantidad);
        //Si no existe un item con ese producto se agrega
        if (buscar_item_por_nombre(nombre) == -1) {
            guardar_items(nuevo_item);
        } else {
            Swal.fire({
                title: "ERROR",
                text: "Ya existe un item con ese producto",
                icon: "error",
                iconColor: "red",
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
    } else {
        //Si hay un producto seleccionado en el select se busca en el array
        let producto = arrProductos[buscar_producto_por_nombre(select_producto)];

        //Si el precio del producto es 0 se muestra un alert
        if (precio < 0 || precio == "") {
            Swal.fire({
                title: "ERROR",
                text: "El precio del producto no puede ser 0",
                icon: "error",
                iconColor: "red",
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
            return;
        }

        //Si el precio del producto seleccionado es distinto al precio ingresado se modifica el precio
        if (precio != producto.precio) {
            producto.precio = precio;
            modificar_productos(producto);
            cargar();
            return;
        }

        //Si la cantidad es 0 se muestra un alert
        if (cantidad < 0 || cantidad == "") {
            Swal.fire({
                title: "ERROR",
                text: "La cantidad no puede ser 0",
                icon: "error",
                iconColor: "red",
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
            return;
        }

        //Si el select no es "Otro" se agrega el producto seleccionado
        let nuevo_item = new Item(select_producto, cantidad);
        //Si no existe un item con ese producto se agrega
        if (buscar_item_por_nombre(select_producto) == -1) {
            guardar_items(nuevo_item);
        } else {
            Swal.fire({
                title: "ERROR",
                text: "Ya existe un item con ese producto",
                icon: "error",
                iconColor: "red",
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
    }
    //actualizo todo
    cargar();
}

//Funcion para buscar un producto en el array
function buscar_producto_por_nombre(nombreProducto) {
    nombreProductoMinusculas = nombreProducto.toLowerCase(); // Convertir el nombre proporcionado a minúsculas
    let indice = arrProductos.findIndex(item => item.nombre.toLowerCase().trim() == nombreProductoMinusculas.trim());
    return indice;
}

//Funcion para buscar un item en el array
function buscar_item_por_nombre(nombreItem) {
    nombreItem = nombreItem.toLowerCase(); // Convertir el nombre proporcionado a minúsculas
    // Buscar el índice del item dentro del array de items utilizando el nombre del producto en minúsculas para comparar
    let indice = arrItems.findIndex(item => item.producto.toLowerCase() === nombreItem);
    return indice;
}

//Funcion para buscar una compra en el array
function buscar_compra_por_id(idCompra) {
    // Buscar el índice de la compra dentro del array de compras utilizando el id de la compra para comparar
    let indice = arrCompras.findIndex(compra => compra.id == idCompra);
    return indice;
}

//Funcion que recibe un nombre de producto y devuelve el precio
function buscar_precio(producto) {
    //Busco el indice del producto dentro del array
    let indice = buscar_producto_por_nombre(producto);
    //Obtengo el precio del producto utilizando el indice
    let precio = arrProductos[indice].precio;
    return precio;
}

//Funcion que recibe un nombre de producto y devuelve si esta en el array itemsSeleccionados
function buscar_item_seleccionado(producto) {
    //Busco el indice del producto dentro del array
    let indice = itemsSeleccionados.indexOf(producto);
    return indice;
}

//Funcion para limpiar los campos del formulario
function limpiar_campos() {
    //cambio el valor de los inputs a vacio
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("presupuesto").innerHTML = "";
    document.getElementById("subtotal").innerHTML = "";
    //cambio el valor del select al primer elemento
    document.getElementById("select_compras").selectedIndex = 0;
    //cambio el valor del select al primer elemento
    document.getElementById("select_producto").selectedIndex = 0;
    cambios_en_select();
}

//Funcion para borrar un item del array
function borrar_item(e) {
    // Obtener el elemento div padre del botón que se hizo clic
    let divItem = e.target.closest(".cartaItem");
    // Si se encontró el elemento div
    if (divItem) {
        // Encontrar el elemento <p> con la clase "producto" dentro del div del item
        let productoElement = divItem.querySelector(".producto");
        // Si se encontró el elemento <p>
        if (productoElement) {
            let nombreProducto = productoElement.textContent; // Obtener el nombre del producto
            // Buscar el índice del producto dentro del array
            let indice = buscar_item_por_nombre(nombreProducto);
            // Borrar el producto del array
            arrItems.splice(indice, 1);
            // Actualizar el localStorage
            localStorage.setItem("arrItems", JSON.stringify(arrItems));
            // Muestro mensaje de exito
            Swal.fire({
                title: "ELIMINADO",
                text: "El item se borro correctamente",
                icon: "error",
                iconColor: "red",
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
            // Actualizar la lista
            mostrar_items(arrItems);
        }
    }
}

//Funcion para modificar un item del array
function modificar_item(e) {
    // Obtener el elemento div padre del botón que se hizo clic
    let divItem = e.target.closest(".cartaItem");
    // Si se encontró el elemento div
    if (divItem) {
        // Encontrar el elemento <p> con la clase "producto" dentro del div del item
        let productoElement = divItem.querySelector(".producto");
        // Encontrar el elemento <input> con la clase "cantidad" dentro del div del item
        let cantidadElement = divItem.querySelector(".form-control-cantidad");
        // Si se encontró el elemento <p>
        if (productoElement) {
            let nombreProducto = productoElement.textContent; // Obtener el nombre del producto
            // Buscar el índice del producto dentro del array
            let indice = buscar_item_por_nombre(nombreProducto);
            // Modificar la cantidad del producto en el array utilizando el indice
            arrItems[indice].cantidad = cantidadElement.value;
            // Actualizar el localStorage
            localStorage.setItem("arrItems", JSON.stringify(arrItems));
            // Muestro mensaje de exito
            Swal.fire({
                title: "EXITO",
                text: "Item modificado",
                icon: "success",
                iconColor: "blue",
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
            // Actualizar la lista
            mostrar_items(arrItems);
        }
    }
}

//Funcion para agregar un producto al itemsSeleccionados cuando se hace click en el checkbox
function agregar_item_seleccionado(e) {
    //Obtengo el elemento div padre del checkbox
    let divItem = e.target.closest(".cartaItem");
    //Si el checkbox esta seleccionado se agrega el item al array
    if (e.target.checked == true) {
        //Obtengo el nombre del producto del item
        let nombreElement = divItem.querySelector(".producto");
        //Agrego el producto al array
        itemsSeleccionados.push(nombreElement.textContent);
    } else {
        //Si el checkbox no esta seleccionado se borra el item del array
        //Obtengo el nombre del producto del item
        let nombreElement = divItem.querySelector(".producto");
        //Busco el indice del item dentro del array itemsSeleccionados
        let indice = itemsSeleccionados.indexOf(nombreElement.textContent);
        //Borro el item del array
        itemsSeleccionados.splice(indice, 1);
    }
    //Guardo el array itemsSeleccionados en localStorage
    localStorage.setItem("itemsSeleccionados", JSON.stringify(itemsSeleccionados));
}




//Funcion para cambiar visibilidad del input Producto
function cambios_en_select() {
    let indice = buscar_producto_por_nombre(select_producto.value);
    if (indice == -1) {
        nombre.style.display = "block";
        precio.value = "";
    } else {
        nombre.style.display = "none";
        precio.value = arrProductos[indice].precio;
    }
    cantidad.value = "";
}

//Funcion para calcular el total de los items
function calcular_presupuesto() {
    let total = 0;
    //Obtengo el elemento donde se muestra el total 
    let totalElement = document.getElementById("presupuestos");
    for (let item of arrItems) {
        let precioProducto = buscar_precio(item.producto) * item.cantidad;
        total += precioProducto;
    }
    totalElement.innerHTML = `$${total}`;
}

//Funcion para calcular el subtotal de los items
function calcular_subtotal() {
    //Obtengo el elemento donde se muestra el subtotal 
    let subtotalElement = document.getElementById("subtotal");
    //Creo una variable para guardar el subtotal
    let subtotal = 0;
    //Obtengo todas las cartas de los items
    let cartas = document.querySelectorAll(".cartaItem");
    //Por cada carta obtengo el checkbox y verifico si esta seleccionado
    for (let carta of cartas) {
        let checkbox = carta.querySelector("#chkComprado");
        if (checkbox.checked == true) {
            //Si esta seleccionado obtengo el precio del item y lo sumo al subtotal
            let cantidadElement = carta.querySelector(".form-control-cantidad");
            let nombreElement = carta.querySelector(".producto");
            let precioProducto = buscar_precio(nombreElement.textContent) * cantidadElement.value;
            subtotal += precioProducto;
        }
    }
    //Muestro el subtotal   
    subtotalElement.innerHTML = `$${subtotal}`;
}

//Funcion para terminar la compra
function terminar_compra() {
    //Obtengo todas las cartas de los items
    let cartas = document.querySelectorAll(".cartaItem");
    //Creo un array para guardar los items seleccionados
    let itemsSeleccionados = [];
    //Creo una variable para guardar el subtotal
    let total = 0;
    //Por cada carta obtengo el checkbox y verifico si esta seleccionado
    for (let carta of cartas) {
        let checkbox = carta.querySelector("#chkComprado");
        if (checkbox.checked == true) {
            //Si esta seleccionado obtengo el precio del item y lo sumo al subtotal
            let cantidadElement = carta.querySelector(".form-control-cantidad");
            let nombreElement = carta.querySelector(".producto");
            let precioProducto = buscar_precio(nombreElement.textContent) * cantidadElement.value;
            //Creo un string con el nombre del producto, la cantidad y el precio
            let item = `${nombreElement.textContent} - ${cantidadElement.value} - $${precioProducto}`;
            //Agrego el item al array
            itemsSeleccionados.push(item);
            total += precioProducto;
            //Borro el item del array
            arrItems.splice(buscar_item_por_nombre(nombreElement.textContent), 1);
        }
    }
    //Si el total es 0 se muestra un alert y se termina la funcion
    if (total == 0) {
        Swal.fire({
            title: "ERROR",
            text: "Debe seleccionar al menos un item",
            icon: "error",
            iconColor: "red",
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
        return;
    }
    //actualizo el localStorage con el array de items
    localStorage.setItem("arrItems", JSON.stringify(arrItems));
    //Obtengo la fecha y hora actual
    let fecha = new Date();
    let fechaActual = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
    let horaActual = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    //Creo una compra con los datos obtenidos
    let compra = new Compra(arrCompras.length + 1, itemsSeleccionados, total, fechaActual, horaActual);
    //Guardo la compra en el array
    guardar_compras(compra);
    //Muestro mensaje de exito
    Swal.fire({
        title: "EXITO",
        text: "Compra realizada",
        icon: "success",
        iconColor: "blue",
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
    //actualizo la lista
    cargar();
}

//Funcion para mostrar calculadora.html en un sweetalert2 modal
function mostrar_calculadora() {
    //Muestro la calculadora en un sweetalert2 modal
    Swal.fire({
        html: `<iframe src="calculadora.html" height="340px"></iframe>`,
        color: "black",
        background: "#ffc48ce8",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#b0b0b0",
        showClass: {
            popup: "animate__animated animate__backInLeft"
        },
        hideClass: {
            popup: "animate__animated animate__backOutRight"
        }
    });
}

//EVENTOS
//Evento para cargar al iniciar la pagina
window.addEventListener("load", cargar);
//Evento para agregar un item al array cuando se hace click en el boton agregar
let btnAgregar = document.getElementById("btn_agregar");
btnAgregar.addEventListener("click", agregar_item);
//Evento para eliminar un item del array cuando se hace click en el boton btn_eliminar_producto
let btnEliminar = document.getElementById("btn_eliminar_producto");
btnEliminar.addEventListener("click", borrar_producto);
//Evento para calcular el total de los items cuando se hace click en el boton btn_calcular_presupuesto
let btnCalcularPresupuesto = document.getElementById("btn_calcular_presupuesto");
btnCalcularPresupuesto.addEventListener("click", calcular_presupuesto);
//Evento para calcular el subtotal de los items cuando se hace click en el boton btn_calcular_subtotal
let btnCalcularSubtotal = document.getElementById("btn_calcular_subtotal");
btnCalcularSubtotal.addEventListener("click", calcular_subtotal);
//Evento para terminar la compra cuando se hace click en el boton btn-terminar
let btnTerminar = document.getElementById("btn_terminar");
btnTerminar.addEventListener("click", terminar_compra);

//Evento para cambiar visibilidad del input Producto
select_producto.addEventListener("change", cambios_en_select);
// select_producto.addEventListener("touchstart", cambios_en_select); 

//Evento para mostrar una compra cuando se selecciona una en el select select_compras
let select_compras = document.getElementById("select_compras");
select_compras.addEventListener("change", mostrar_compra);

//Evento para mostrar la calculadora
let btnCalculadora = document.getElementById("btn_calculadora");
btnCalculadora.addEventListener("click", mostrar_calculadora);

