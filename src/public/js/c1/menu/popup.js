window.addEventListener("DOMContentLoaded", (event) => {
	var modal = document.getElementById("myModal");
	var btn = document.getElementById("openModal");
	var btn2 = document.getElementById("openModal2");
	var btn3 = document.getElementById("openModal3");
	var btn4 = document.getElementById("openModal4");
	var btn5 = document.getElementById("openModal5");
	var span = document.getElementsByClassName("close")[0];
	var acceptBtn = document.getElementById("acceptBtn");
	var cancelBtn = document.getElementById("cancelBtn");
	var inputValue = document.getElementById("inputValue");
	var modalMessage = document.getElementById("modal-message");

	btn.onclick = function () {
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
		var route = "";
		// Seleccionar la base de datos según la clase
		switch (linkClass) {
			case "aceptar-orden-compra":
				route = "/c1/b2/acptODC";
				break;
			case "procesar-pago-senia":
				route = "/c1/b3/paySign";
				break;
			case "procesar-plan-pago":
				route = "/c1/b6/procPlanDePago";
				break;
			case "procesar-orden-retiro":
				route = "/c1/b7/procOrdenRetiro";
				break;
			case "procesar-confeccion-seguro":
				route = "/c1/b8/confSeguro";
				break;
			default:
				alert("Clase no válida");
				modal.style.display = "none";
				return;
		}
		// Realizar la solicitud POST
		try {
			fetch(route, {
				method: "POST",
				body: JSON.stringify({ cododc: value }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then(function () {
				ruta = response.json();
				alert(ruta);
				window.location.href = ruta; // Redirigir al cliente a la ruta deseada
			});
		} catch (error) {
			alert("Ocurrió un error en la solicitud");
			alert(error);
		}

		modal.style.display = "none";
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
