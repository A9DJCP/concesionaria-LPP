//En este archivo relacionamos las diferentes estructuras de datos (relaciones entre las "tablas")
import Cliente from "./cliente";
import Persona from "./persona";
import Propietario from "./propietario";
import AutoDisponible0KM from "./autodisponible0km";
import FormaPago from "./formapago";
import OrdenDeCompra from "./ordendecompra";

Cliente.belongsTo(Persona);
Persona.hasOne(Cliente);

Propietario.belongsTo(Persona);
Persona.hasOne(Propietario);

/*Un usuario tiene un permiso de usuario. Relación 1N donde Usuario N -------- 1 Permiso*/

Usuario.belongsTo(Permiso);
Permiso.hasMany(Usuario);

export default {
	Cliente,
	Persona,
	Propietario,
	AutoDisponible0KM,
	FormaPago,
	OrdenDeCompra,
};
