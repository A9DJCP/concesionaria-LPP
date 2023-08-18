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
			var color = row.cells[3].innerHTML.trim();

			// Obtener el elemento chosenCar
			var chosenCar = document.getElementById("chosenCar");
			chosenCar.textContent = `${marca} ${modelo} (${color}) // Precio: $${precio}`;

			var hiddenMarca = document.getElementById("hiddenMarca");
			var hiddenModelo = document.getElementById("hiddenModelo");
			var hiddenPrecio = document.getElementById("hiddenPrecio");
			var hiddenColor = document.getElementById("hiddenColor");

			hiddenMarca.value = marca;
			hiddenModelo.value = modelo;
			hiddenPrecio.value = precio;
			hiddenColor.value = color;
		});
	}
});
