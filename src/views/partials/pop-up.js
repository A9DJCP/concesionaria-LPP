// Obtener los elementos del DOM
var overlay = document.getElementById("overlay");
var button = document.getElementById("myButton");
var submitBtn = document.getElementById("submitBtn");
var cancelBtn = document.getElementById("cancelBtn");
var textInput = document.getElementById("textInput");

// Agregar evento de clic al botón
button.addEventListener("click", function () {
	overlay.style.display = "flex";
});

// Agregar evento de clic al botón de aceptar
submitBtn.addEventListener("click", function () {
	var enteredText = textInput.value;
	alert("Texto ingresado: " + enteredText);
	overlay.style.display = "none";
});

// Agregar evento de clic al botón de cancelar
cancelBtn.addEventListener("click", function () {
	overlay.style.display = "none";
});
