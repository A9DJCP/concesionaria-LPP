// Obtener referencias a los elementos del DOM
var btnPopup = document.getElementById("btn-popup");
var popup = document.getElementById("popup");
var btnCerrar = document.getElementById("btn-cerrar");


// Ocultar el pop-up cuando se hace clic en el botón de cerrar
btnCerrar.addEventListener("click", function () {
	popup.style.display = "none";
});
