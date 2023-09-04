document.addEventListener("DOMContentLoaded", function () {
	var addButtons = document.getElementsByClassName("add-button");
	for (var i = 0; i < addButtons.length; i++) {
		addButtons[i].addEventListener("click", function (event) {
			event.preventDefault();
			var row = this.parentNode.parentNode;
			var nroC = row.cells[0].innerHTML.trim();
			var chosenCuota = document.getElementById("chosenCuota");
			var chosenCuotaInput = document.getElementById("chosenCuotaInput");
			chosenCuota.textContent = `${nroC}`;
			chosenCuotaInput.value = parseInt(`${nroC}`);
			document.getElementById("chosenCuota").textContent = `${nroC}`;
		});
	}
});
