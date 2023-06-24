window.addEventListener("DOMContentLoaded", function () {
	const tablaOriginal = document.getElementById("tabla-original");
	const tablaSeleccionada = document.getElementById("tabla-seleccionada");

	// Agregar evento de clic a las celdas de la tabla original
	tablaOriginal.addEventListener("click", function (event) {
		const celda = event.target;

		// Verificar que se hizo clic en una celda y no en el encabezado
		if (celda.tagName === "TD") {
			const columna = celda.cellIndex;
			const valor = celda.textContent;

			// Agregar la columna seleccionada a la tabla de columnas seleccionadas
			const fila = tablaSeleccionada.insertRow();
			const celdaSeleccionada = fila.insertCell();
			celdaSeleccionada.textContent = valor;
		}
	});
});
