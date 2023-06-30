function addRep(codRDISP, nombre, PU, detalles) {
	// Obtener la referencia a la tabla de selecciones
	var tablaSeleccionadas = document.getElementById("tabla-seleccionadas");

	// Verificar si el elemento ya existe en la tabla
	var elementosExistentes =
		tablaSeleccionadas.getElementsByClassName("codRDISP");
	for (var i = 0; i < elementosExistentes.length; i++) {
		var codRDISPExistente = elementosExistentes[i].innerHTML;
		if (codRDISPExistente === codRDISP) {
			// El elemento ya existe en la tabla, no se agrega nuevamente
			return;
		}
	}

	// Crear una nueva fila
	var newRow = tablaSeleccionadas.insertRow();

	// Insertar celdas en la nueva fila
	var codRDISPCell = newRow.insertCell();
	var nombreCell = newRow.insertCell();
	var precioUnitarioCell = newRow.insertCell();
	var detallesCell = newRow.insertCell();
	var eliminarCell = newRow.insertCell();

	// Establecer el contenido de las celdas
	codRDISPCell.innerHTML = codRDISP;
	nombreCell.innerHTML = nombre;
	precioUnitarioCell.innerHTML = PU;
	detallesCell.innerHTML = detalles;

	// Agregar una clase al elemento de codRDISP para facilitar la comprobación posterior
	codRDISPCell.classList.add("codRDISP");

	// Crear el botón de eliminar
	var eliminarButton = document.createElement("button");
	eliminarButton.textContent = "Eliminar";

	// Agregar el evento de clic al botón de eliminar
	eliminarButton.addEventListener("click", function () {
		//Actualizar el monto
		var sumaPrecioUnitario = parseFloat(
			document.getElementById("suma-precio-unitario").textContent
		);

		// Obtener la referencia al elemento donde se mostrará la suma
		var sumaElemento = document.getElementById("suma-precio-unitario");

		// Actualizar el contenido de la suma
		sumaElemento.textContent = parseFloat(sumaPrecioUnitario) - parseFloat(PU);

		// Obtener la fila actual y eliminarla
		var filaActual = this.parentNode.parentNode;
		filaActual.parentNode.removeChild(filaActual);
	});

	// Agregar el botón de eliminar a la celda correspondiente
	eliminarCell.appendChild(eliminarButton);

	//Añadir al monto actual
	var sumaPrecioUnitario = parseFloat(
		document.getElementById("suma-precio-unitario").textContent
	);
	// Obtener la referencia al elemento donde se mostrará la suma
	var sumaElemento = document.getElementById("suma-precio-unitario");

	// Actualizar el contenido de la suma
	sumaElemento.textContent = parseFloat(sumaPrecioUnitario) + parseFloat(PU);
	// Obtener los datos de la tabla seleccionada
	var tablaSeleccionadas = document.getElementById("tabla-seleccionadas");
	var datosReparaciones = [];

	// Recorrer las filas de la tabla
	for (var i = 1; i < tablaSeleccionadas.rows.length; i++) {
		var fila = tablaSeleccionadas.rows[i];
		var codRDISP = fila.cells[0].innerHTML;
		var nombre = fila.cells[1].innerHTML;
		var PU = fila.cells[2].innerHTML;
		var detalles = fila.cells[3].innerHTML;

		// Agregar los datos a la lista
		datosReparaciones.push({ codRDISP, nombre, PU, detalles });
	}

	// Actualizar el campo oculto con los datos de la tabla
	document.getElementById("datos-reparaciones").value =
		JSON.stringify(datosReparaciones);
		
}
