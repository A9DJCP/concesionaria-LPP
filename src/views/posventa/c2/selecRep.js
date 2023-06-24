function addRep(i) {
	// Obtener la fila seleccionada
	let filaSeleccionada = document.querySelectorAll("#tabla-original tr")[i + 1]; // Se suma 1 para omitir la fila de encabezado

	// Crear una nueva fila en la tabla de selecciones
	let tablaSeleccionadas = document.getElementById("tabla-seleccionadas");
	let nuevaFila = document.createElement("tr");

	// Clonar las celdas de la fila seleccionada y añadirlas a la nueva fila
	let celdasSeleccionadas = filaSeleccionada.querySelectorAll("td");
	celdasSeleccionadas.forEach(function (celda) {
		let nuevaCelda = document.createElement("td");
		nuevaCelda.innerHTML = celda.innerHTML;
		nuevaFila.appendChild(nuevaCelda);
	});

	// Añadir la nueva fila a la tabla de selecciones
	tablaSeleccionadas.appendChild(nuevaFila);
}
