const verificarCliente = document.getElementById("verifClientBtn");
const ingresarCliente = document.getElementById("ingresarClienteButton");

function getPartialData() {
	// Obtener los valores de los campos del formulario
	const nombre = document.getElementById("nombre");
	const apellido = document.getElementById("apellido");
	const tipoDocumento = document.getElementById("dropdown");
	const numeroDocumento = document.getElementById("documento");
	// Devolver los valores de los campos del formulario
	return {
		nombre: nombre.value,
		apellido: apellido.value,
		tipoDocumento: tipoDocumento.value,
		numeroDocumento: numeroDocumento.value,
	};
}

function getAllData() {
	var client = getPartialData();
	return { client };
}

verificarCliente.addEventListener("click", function () {
	alert("Hola");
	fetch("/comprobarCliente", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(getPartialData()),
	});
});

ingresarCliente.addEventListener("click", function () {
	fetch("/ingresarCliente", {
		method: "POST",

		body: JSON.stringify(getPartialData()),
	});
});
