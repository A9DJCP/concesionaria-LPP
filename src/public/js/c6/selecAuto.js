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
			var marca = row.cells[0].innerHTML.trim();
			var modelo = row.cells[1].innerHTML.trim();
			var precio = row.cells[2].innerHTML.trim();
			var propietario = row.cells[3].innerHTML.trim();
			var documento = row.cells[4].innerHTML.trim();
			var contrato = row.cells[5].innerHTML.trim();
			var color = row.cells[6].innerHTML.trim();

			// Obtener el elemento chosenCar
			var chosenCar = document.getElementById("chosenCar");
			var chosenPropietario = document.getElementById("chosenPropietario");
			chosenCar.textContent = `${marca} ${modelo} (${color}) // Precio: $${precio}`;
			chosenPropietario.textContent = `${propietario} // ${documento}`;

			var hiddenContrato = document.getElementById("hiddenContrato");
			var hiddenPrecio = document.getElementById("hiddenPrecio");

			hiddenPrecio.value = precio;
			hiddenContrato.value = contrato;
		});
	}
});
