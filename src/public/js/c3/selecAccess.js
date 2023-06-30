document.addEventListener("DOMContentLoaded", function () {
	// Obtener todos los botones de "Añadir"
	var addButtons = document.getElementsByClassName("add-button");

	// Recorrer los botones y agregar el evento de clic
	for (var i = 0; i < addButtons.length; i++) {
		addButtons[i].addEventListener("click", function (event) {
			// Evitar el comportamiento predeterminado del botón
			event.preventDefault();

			// Obtener la fila correspondiente al botón de "Añadir" clicado
			var row = this.parentNode.parentNode;

			// Obtener los valores de la fila seleccionada
			var codACC = row.cells[0].innerHTML.trim();
			var nombre = row.cells[1].innerHTML.trim();
			var PU = row.cells[2].innerHTML.trim();
			var stock = row.cells[3].innerHTML.trim();

			// Solicitar la cantidad al usuario
			var cantidad = parseInt(
				prompt("Ingrese la cantidad del accesorio buscada:")
			);

			if (isNaN(cantidad) || cantidad < 0 || cantidad > stock) {
				alert(
					"Valor ingresado inválido. La cantidad no puede ser menor a 0 ni mayor al stock existente."
				);
				return;
			}

			// Verificar si el elemento ya existe en la tabla de selecciones
			var elementosExistentes = document.getElementsByClassName("codACC");
			for (var j = 0; j < elementosExistentes.length; j++) {
				var codACCExistente = elementosExistentes[j].innerHTML;
				if (codACCExistente === codACC) {
					alert(
						`El accesorio agregado ya ha sido agregado a la tabla de accesorios seleccionados. Si desea modificar la cantidad, eliminelo primero de la tabla presionando el correspondiente botón de "Eliminar"`
					);
					return;
				}
			}

			// Obtener la tabla de selecciones
			var tablaSeleccionadas = document.getElementById("tabla-seleccionadas");

			// Crear una nueva fila
			var newRow = tablaSeleccionadas.insertRow();

			// Insertar celdas en la nueva fila
			var codACCCell = newRow.insertCell();
			var nombreCell = newRow.insertCell();
			var precioUnitarioCell = newRow.insertCell();
			var cantidadCell = newRow.insertCell();
			var eliminarCell = newRow.insertCell();

			// Establecer el contenido de las celdas
			codACCCell.innerHTML = codACC;
			nombreCell.innerHTML = nombre;
			precioUnitarioCell.innerHTML = PU;
			cantidadCell.innerHTML = cantidad;

			// Agregar una clase al elemento de codRDISP para facilitar la comprobación posterior
			codACCCell.classList.add("codACC");

			// Crear el botón de eliminar
			var eliminarButton = document.createElement("button");
			eliminarButton.textContent = "Eliminar";

			// Agregar el evento de clic al botón de eliminar
			eliminarButton.addEventListener("click", function () {
				// Actualizar el monto
				var sumaPrecioUnitario = parseFloat(
					document.getElementById("suma-precio-unitario").textContent
				);
				var precioUnitario = parseFloat(PU);
				var cantidad = parseInt(cantidadCell.innerHTML);
				document.getElementById("suma-precio-unitario").textContent =
					sumaPrecioUnitario - precioUnitario * cantidad;

				// Eliminar la fila de la tabla de selecciones
				newRow.remove();

				// Actualizar el stock en la tabla original
				var tablaOriginal = document.getElementById("tabla-original");
				var filasOriginales = tablaOriginal.getElementsByTagName("tr");
				for (var k = 1; k < filasOriginales.length; k++) {
					var fila = filasOriginales[k];
					if (fila.cells[0].innerHTML === codACC) {
						var stockOriginal = parseInt(fila.cells[3].innerHTML);
						fila.cells[3].innerHTML = stockOriginal + cantidad;
						break;
					}
				}
			});

			// Agregar el botón de eliminar a la celda correspondiente
			eliminarCell.appendChild(eliminarButton);

			// Añadir al monto actual
			var sumaPrecioUnitario = parseFloat(
				document.getElementById("suma-precio-unitario").textContent
			);
			var precioUnitario = parseFloat(PU);
			document.getElementById("suma-precio-unitario").textContent =
				sumaPrecioUnitario + precioUnitario * cantidad;

			// Actualizar el stock en la tabla original
			var tablaOriginal = document.getElementById("tabla-original");
			var filasOriginales = tablaOriginal.getElementsByTagName("tr");
			for (var k = 1; k < filasOriginales.length; k++) {
				var fila = filasOriginales[k];
				var codACCOriginal = fila.cells[0].innerText.trim();
				if (codACCOriginal === codACC) {
					var stockOriginal = parseInt(fila.cells[3].innerText.trim());
					fila.cells[3].innerText = stockOriginal - cantidad;
					break;
				}
			}

			// Obtener los datos de la tabla seleccionada
			var tablaSeleccionadas = document.getElementById("tabla-seleccionadas");
			var datosAccesorios = [];

			// Recorrer las filas de la tabla
			for (var n = 1; n < tablaSeleccionadas.rows.length; n++) {
				var fila = tablaSeleccionadas.rows[n];
				var codACC = fila.cells[0].innerHTML;
				var nombre = fila.cells[1].innerHTML;
				var PU = fila.cells[2].innerHTML;
				var cant = fila.cells[3].innerHTML;

				// Agregar los datos a la lista
				datosAccesorios.push({ codACC, nombre, PU, cant });
			}
			// Actualizar el campo oculto con los datos de la tabla
			document.getElementById("datos-accesorios").value =
				JSON.stringify(datosAccesorios);
		});
	}
});
