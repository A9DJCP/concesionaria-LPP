window.addEventListener('DOMContentLoaded', (event) => {
    var modal = document.getElementById('myModal');
    var btn = document.getElementById('openModal');
    var btn2 = document.getElementById('openModal2');
    var btn3 = document.getElementById('openModal3');
    var btn4 = document.getElementById('openModal4');
    var btn5 = document.getElementById('openModal5');
    var span = document.getElementsByClassName('close')[0];
    var acceptBtn = document.getElementById('acceptBtn');
    var cancelBtn = document.getElementById('cancelBtn');
    var inputValue = document.getElementById('inputValue');
    var modalMessage = document.getElementById('modal-message');

    btn.onclick = function() {
        modalMessage.textContent = 'Ingrese el número de la orden de compra:';
        inputValue.value = '';
        inputValue.placeholder = 'Número de orden de compra';
        modal.style.display = 'block';
        acceptBtn.dataset.linkClass = this.classList[1];
    };

    btn2.onclick = function() {
        modalMessage.textContent = 'Ingrese el número del recibo';
        inputValue.value = '';
        inputValue.placeholder = 'Número de recibo';
        modal.style.display = 'block';
        acceptBtn.dataset.linkClass = this.classList[1];
    };

    btn3.onclick = function() {
        modalMessage.textContent = 'Ingrese el número del recibo pago:';
        inputValue.value = '';
        inputValue.placeholder = 'Número del recibo de pago';
        modal.style.display = 'block';
        acceptBtn.dataset.linkClass = this.classList[1];
    };

    btn4.onclick = function() {
        modalMessage.textContent = 'Ingrese el número de la orden de retiro:';
        inputValue.value = '';
        inputValue.placeholder = 'Número de orden de retiro';
        modal.style.display = 'block';
        acceptBtn.dataset.linkClass = this.classList[1];
    };

    btn5.onclick = function() {
        modalMessage.textContent = 'Ingrese el código de fábrica de la recepción del automóvil:';
        inputValue.value = '';
        inputValue.placeholder = 'Código de fábrica';
        modal.style.display = 'block';
        acceptBtn.dataset.linkClass = this.classList[1];
    };

    span.onclick = function() {
        modal.style.display = 'none';
    };

    acceptBtn.onclick = function() {
        var value = inputValue.value;
        var databaseValues;

        // Obtener la clase del elemento <a> clicado
        var linkClass = this.dataset.linkClass;

        // Seleccionar la base de datos según la clase
        switch (linkClass) {
            case 'aceptar-orden-compra':
                databaseValues = ['ABC123', 'DEF456', 'GHI789']; // Valores inventados para la base de datos "aceptar-orden-compra"
                break;
            case 'procesar-pago-senia':
                databaseValues = ['123ABC', '456DEF', '789GHI']; // Valores inventados para la base de datos "procesar-pago-senia"
                break;
            case 'procesar-plan-pago':
                databaseValues = ['XYZ123', 'XYZ456', 'XYZ789']; // Valores inventados para la base de datos "procesar-plan-pago"
                break;
            case 'procesar-orden-retiro':
                databaseValues = ['RET123', 'RET456', 'RET789']; // Valores inventados para la base de datos "procesar-orden-retiro"
                break;
            case 'procesar-confeccion-seguro':
                databaseValues = ['SEG123', 'SEG456', 'SEG789']; // Valores inventados para la base de datos "procesar-confeccion-seguro"
                break;
            default:
                alert('Clase no válida');
                modal.style.display = 'none';
                return;
        }

        if (databaseValues.includes(value)) {
            // Realizar redirección según la clase
            switch (linkClass) {
                case 'aceptar-orden-compra':
                    window.open('../Imprimir Orden/index.html', '_blank');
                    break;
                case 'procesar-pago-senia':
                    window.open('../Generar Recibo/index.html', '_blank');
                    break;
                case 'procesar-plan-pago':
                    window.open('../Generar Factura/index.html', '_blank');
                    break;
                case 'procesar-orden-retiro':
                    window.open('../Generar Retiro/index.html', '_blank');
                    break;
                case 'procesar-confeccion-seguro':
                    window.open('../Imprimir Seguro/index.html', '_blank');
                    break;
                default:
                    alert('Clase no válida');
                    break;
            }
        } else {
            // Mostrar mensaje de error
            alert('No se pudo procesar la solicitud. Valor no encontrado en la base de datos.');
        }

        modal.style.display = 'none';
    };

    cancelBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
