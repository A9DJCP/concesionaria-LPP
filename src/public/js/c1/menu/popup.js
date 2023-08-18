window.addEventListener("DOMContentLoaded", (event) => {
	var modal = document.getElementById("myModal");
	var b2 = document.getElementById("b2");
	var btn2 = document.getElementById("openModal2");
	var btn3 = document.getElementById("openModal3");
	var btn4 = document.getElementById("openModal4");
	var btn5 = document.getElementById("openModal5");
	var span = document.getElementsByClassName("close")[0];
	var acceptBtn = document.getElementById("acceptBtn");
	var cancelBtn = document.getElementById("cancelBtn");
	var inputValue = document.getElementById("inputValue");
	var modalMessage = document.getElementById("modal-message");
	var codODCb2 = document.getElementById("codODCb2");

	updateB2codODC = function () {
		modalMessage.textContent = "Ingrese el número de la orden de compra:";
		inputValue.value = ""; 
		inputValue.placeholder = "Número de orden de compra";
		modal.style.display = "block";
		acceptBtn.dataset.linkClass = this.classList[1];
	};

	btn2.onclick = function () {
		modalMessage.textContent = "Ingrese el número del recibo";
		inputValue.value = "";
		inputValue.placeholder = "Número de recibo";
		modal.style.display = "block";
		acceptBtn.dataset.linkClass = this.classList[1];
	};

	btn3.onclick = function () {
		modalMessage.textContent = "Ingrese el número del recibo pago:";
		inputValue.value = "";
		inputValue.placeholder = "Número del recibo de pago";
		modal.style.display = "block";
		acceptBtn.dataset.linkClass = this.classList[1];
	};

	btn4.onclick = function () {
		modalMessage.textContent = "Ingrese el número de la orden de retiro:";
		inputValue.value = "";
		inputValue.placeholder = "Número de orden de retiro";
		modal.style.display = "block";
		acceptBtn.dataset.linkClass = this.classList[1];
	};

	btn5.onclick = function () {
		modalMessage.textContent =
			"Ingrese el código de fábrica de la recepción del automóvil:";
		inputValue.value = "";
		inputValue.placeholder = "Código de fábrica";
		modal.style.display = "block";
		acceptBtn.dataset.linkClass = this.classList[1];
	};

	span.onclick = function () {
		modal.style.display = "none";
	};

	acceptBtn.onclick = async function () {
		var value = inputValue.value;
		var linkClass = this.dataset.linkClass;
		var inputBoxId = "";
		alert(linkClass);
		// Seleccionar la base de datos según la clase
		switch (linkClass) {
			case "btnAcptODC":
				inputBoxId = "codODCb2";
				break;
			case "procesar-pago-senia":
				inputBoxId = "codRb3";
				break;
			case "procesar-plan-pago":
				inputBoxId = "codRb6";
				break;
			case "procesar-orden-retiro":
				inputBoxId = "codRETb7";
				break;
			case "procesar-confeccion-seguro":
				inputBoxId = "codFb9";
				break;
			default:
				alert("Clase no VALIDA");
				modal.style.display = "none";
				return false;
		}

		var inputBoxElement = document.getElementById(inputBoxId);
		inputBoxElement.value = value;
		modal.style.display = "none";
		return true;
	};

	cancelBtn.onclick = function () {
		modal.style.display = "none";
	};

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
});
