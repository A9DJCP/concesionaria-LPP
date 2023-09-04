document.addEventListener("DOMContentLoaded", function () {
	var addButtons = document.getElementsByClassName("add-button");
	for (var i = 0; i < addButtons.length; i++) {
		addButtons[i].addEventListener("click", function (event) {
			event.preventDefault();
			var row = this.parentNode.parentNode;
			var codPRE = row.cells[0].innerHTML.trim();
			var chosenPrestamo = document.getElementById("chosenPrestamo");
			var chosenPrestamoInput = document.getElementById("chosenPrestamoInput");
			chosenPrestamo.textContent = `${codPRE}`;
			chosenPrestamoInput.value = parseInt(`${codPRE}`);
			document.getElementById("chosenPrestamo").textContent = `${codPRE}`;
		});
	}
});
