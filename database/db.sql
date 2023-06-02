/*--------------------------------------------------------------------------------BASE DE DATOS CONCESIONARIA LPP--------------------------------------------------------------------------------*/

drop database if exists concesionariaLPP;
Create database concesionariaLPP;
use concesionariaLPP;


Create table Persona(
codPer int auto_increment primary key,
tipodoc varchar(100),
nrodoc varchar(30),
nom varchar(100),
ape varchar(100),
direc varchar(150),
tel varchar(30),
mail varchar(150),
borrado boolean
)Engine=InnoDB;

Create table Cliente
(codCL int auto_increment primary key,
codPer int,
requisitos boolean,
borrado boolean,
constraint fk_cliente_persona foreign key (codPer) references Persona (codPer)
)Engine=InnoDB;


create table Propietario (
codP int primary key auto_increment,
codPer int,
borrado boolean,
constraint fk_propietario_persona foreign key (codPer) references persona(codPer)
)Engine=InnoDB;



create table AutoDisponible0km
(
codAD0KM int auto_increment primary key,
marca varchar(20),
modelo varchar(50),
precio float,
color varchar(20),
borrado boolean
)Engine=InnoDB;

Create table FormaPago(
codFP int primary key auto_increment,
descripcion varchar(20)
)Engine=InnoDB;


Create table ordendecompra
(
codODC int auto_increment primary key,
codCL int,
codAD0KM int,
codFP int,
fechapedido date,
vigente boolean, /*vigente=[True=Vigente|False=Anulado]*/
constraint fk_orden_cliente foreign key (codCL) references cliente(codCL),
constraint fk_orden_autodisponible foreign key (codAD0KM) references AutoDisponible0KM(codAD0KM),
constraint fk_orden_formapago foreign key (codFP) references FormaPago(codFP)
)Engine=InnoDB;


Create table Factura(
codF int auto_increment primary key,
codODC int,
total float,
femision date,
estado varchar(30), /*Estado=[Pendiente|Pagada]*/
constraint fk_factura_orden foreign key (codODC) references ordendecompra(codODC)
)Engine=InnoDB;


Create table Recibo(
codREC int auto_increment primary key,
total float,
codODC int,
femision date,
estado varchar(30), /*Estado=[Pendiente|Pagado]*/
constraint fk_recibo_orden foreign key (codODC) references ordendecompra(codODC)
);


Create table DocFabricacion
(codDF int auto_increment primary key,
codODC int,
femision date, /*Fecha de Emisión de la documentación*/
fentrega date,
constraint fk_docfabricacion_orden foreign key (codODC) references ordendecompra(codODC)
)Engine=InnoDB;


Create table DocAuto0km(
codDA0KM int auto_increment primary key,
marca varchar(20),
modelo varchar(50),
matricula varchar(10),
uso varchar(100),
chasis varchar(100),
motor varchar(100),
titular varchar(50),
tipodoctitular varchar(20),
doctitular varchar(15),
domiciliotitular varchar(50),
fvto date,
aniofabricacion year,
color varchar(30),
codDF int,
codigodefabrica varchar(20),
constraint fk_docauto0km_docfabricacion foreign key (codDF) references DocFabricacion (codDF)
)Engine=InnoDB;


Create table Auto0km
(
codA0KM int auto_increment primary key,
codAD0KM int,
fingreso date,
codDA0KM int,
codCL int,
constraint fk_auto0km_autodisponible foreign key (codAD0KM) references AutoDisponible0km (codAD0KM),
constraint fk_auto0km_docauto foreign key (codDA0KM) references DocAuto0km (codDA0KM),
constraint fk_auto0km_cliente foreign key (codCL) references cliente (codCL)
);


Create Table prestamo(
codPRE int auto_increment primary key,
codODC int,
cantcuotas int,
precioXcuota float,
finicial date,
pagado boolean,
cancelado boolean,
constraint fk_prestamo_ordencompra foreign key (codODC) references ordendecompra (codODC)
)Engine=InnoDB;

Create table Cuota(
codCUOTA int auto_increment primary key,
codPRE int,
nrocuota int,
pagada boolean,
fcobro date,
fvto date,
constraint fk_cuota_prestamo foreign key (codPRE) references prestamo(codPRE)
);

Create table RetiroAuto0KM (
codRA0KM int auto_increment primary key,
codODC int,
fechaemision date,
fvto date,
retirado boolean,
constraint fk_retiro0km_orden foreign key (codODC) references ordendecompra(codODC)
)Engine=InnoDB;

Create table condicion(
codCOND int auto_increment primary key,
descripcion varchar(100)
)Engine=InnoDB;


Create table TipoSeguro(
codTS int auto_increment primary key,
nombre varchar(50),
explicacion varchar(500)
);


Create table CondicionTipoSeguro(
codCTS int auto_increment primary key,
codCOND int,
codTS int,
constraint fk_condiciontiposeguro_condicion foreign key (codCOND) references condicion(codCOND),
constraint fk_condiciontiposeguro_tiposeguro foreign key (codTS) references tiposeguro(codTS)
)Engine=InnoDB;


Create Table Seguro0KM(
codS0KM int auto_increment primary key,
codTS int,
codA0KM int,
femision date,
fecfin date,
valorasegurado float,
estado varchar(20),
constraint fk_seguro0km_tiposeguro foreign key (codTS) references tiposeguro(codTS),
constraint fk_seguro0km_auto0km foreign key (codA0KM) references auto0km(codA0KM)
)Engine=InnoDB;


create table AnalisisAuto0Km(
codAA0KM int auto_increment primary key,
codA0KM int,
fechaingreso date,
estado varchar(20),
constraint FK_AnalisisAuto0KM_Auto0KM foreign key (codA0KM) references Auto0Km (codA0KM)
)Engine=InnoDB;

create table TempSelectReparacion(
codTSR int auto_increment primary key,
nombre varchar(20),
PU float,
detalles varchar(200)
)Engine=InnoDB;

create table ReparacionDisponible(
codRDISP int auto_increment primary key,
nombre varchar(20),
PU float,
detalles varchar(200),
borrado boolean
)Engine=InnoDB;

create table DocReparacion0KM(
codDR int auto_increment primary key,
codA0KM int,
fechareparacion date,
fechafin date,
monto float,
retirado boolean,
constraint fk_docreparacion0km_auto0km foreign key (codA0KM) references auto0km(codA0KM)
)Engine=InnoDB;

create table DetalleReparacion0KM(
codDR0KM int auto_increment primary key,
codDR int,
codRDISP int,
PU float,
constraint fk_detallereparacion0km_docreparacion0km foreign key (codDR) references docreparacion0km (codDR),
constraint fk_detallereparacion0km_reparaciondisponible0km foreign key (codRDISP) references reparaciondisponible (codRDISP)
)Engine=InnoDB;

create table Accesorio(
codACC int auto_increment primary key,
nombre varchar(20),
PU float,
stock int,
borrado boolean
)Engine=InnoDB;

create table TempSelectAccesorio(
codTSA int auto_increment primary key,
nombre varchar(20),
PU float,
cant int
)Engine=InnoDB;

create table PresupuestoAccesorio(
codPAA int auto_increment primary key,
fechapedido date,
fechaentrega date,
codA0KM int,
monto float,
estado varchar(10), /*estado=[Pendiente|Aceptado|Rechazado|Finalizado]*/
constraint fk_presupuesto_auto0km foreign key (codA0KM) references Auto0km(codA0KM)
)Engine=InnoDB;

create table DetallePresupuestoAccesorio
(
codDPA int auto_increment primary key,
codPAA int,
codACC int,
cant int,
PU float,
constraint fk_detpresacces_accesorio foreign key (codACC) references Accesorio(codACC),
constraint fk_detpresacces_presupuesto foreign key (codPAA) references PresupuestoAccesorio(codPAA)
)Engine=InnoDB;

create table FacturaAccesorio(
codFACC int auto_increment primary key,
codPAA int,
fechaemision date,
monto float,
constraint fk_factura_accesorio foreign key (codPAA) references PresupuestoAccesorio(codPAA)
)Engine=InnoDB;


create table AnalisisReparacionAuto(
codARA int auto_increment primary key,
codA0KM int,
fechaingreso date,
estado varchar(20),
constraint FK_AnalisisReparacionAuto_Auto0KM foreign key (codA0KM) references Auto0Km (codA0KM)
)Engine=InnoDB;

create table PresupuestoReparacion(
codPREP int auto_increment primary key,
codA0KM int,
fechaemision date,
fechaentrega date,
monto float,
estado varchar(10),/*estado=[Pendiente|Aceptado|Rechazado|Finalizado]*/
constraint fk_presupuestoreparacion_auto0km foreign key (codA0KM) references Auto0KM(codA0KM)
)Engine=InnoDB;

create table DetallePresupuestoReparacion (
codDPR int auto_increment primary key,
codPREP int,
codRDISP int,
PU float,
constraint fk_detallepresupuestoreparacion_presupuesto foreign key (codPREP) references PresupuestoReparacion (codPREP),
constraint fk_detallepresupuestoreparacion_reparaciondisponible foreign key (codRDISP) references ReparacionDisponible(codRDISP)
);

create table FacturaReparacion(
codFREP int auto_increment primary key,
codPREP int,
fechaemision date,
monto float,
constraint fk_facturareparacion_presupuestoreparacion foreign key (codPREP) references PresupuestoReparacion(codPREP)
)Engine=InnoDB;

create table AutoUsado(
codAU int primary key auto_increment,
matricula varchar(10),
marca varchar(100),
modelo varchar(100),
precioventa float,
fechafabricacion date,
codP int,
uso varchar(100),
chasis varchar(100),
motor varchar(100),
sinvigencia boolean,
checkeado boolean,
borrado boolean,
color varchar(30),
constraint fk_autousado_propietario foreign key (codP) references propietario(codP)
) Engine=InnoDB;

create table contrato
(
codC int auto_increment primary key,
codAU int,
femision date,
fvto date,
firmado boolean,
estado varchar(20), /*estado=[Abierto|Cerrado con éxito | Cerrado sin éxito]*/
condiciones varchar(1000),
porcGanLPP float,
constraint fk_contrato_autousado foreign key (codAU) references autousado(codAU)
)Engine=InnoDB;

/*
create table color(
codCOLOR int auto_increment primary key,
descripcion varchar(10),
borrado boolean
)Engine=InnoDB;

create table ColorAutoUsado(
codCOLAU int auto_increment primary key,
codCOLOR int,
codAU int,
constraint fk_ColorAutoUsado_Color foreign key (codCOLOR) references Color(codCOLOR),
constraint fk_ColorAutoUsado_AutoUsado foreign key (codAU) references AutoUsado(codAU)
)Engine=InnoDB;
Se eliminarán las tablas de COLOR y COLORAUTOUSADO por no considerarse relevantes.
En su lugar, se colocará el color principal directamente en el auto.*/

create table PresupuestoAutoUsado(
codPAUS int primary key auto_increment,
codCL int, 
codC int,
fechaemision date,
monto float,
estado varchar(20),
constraint fk_pedidoautousado_cliente foreign key (codCL) references cliente (codCL),
constraint fk_pedidoautousado_contrato foreign key (codC) references contrato (codC)
)Engine=InnoDB;


create table facturacompraautousado(
codFCAU int primary key auto_increment,
codPAUS int,
total float,
estado varchar(10),
fechapago date,
constraint fk_facturacompraautousado_pedidoautousado foreign key (codPAUS) references PresupuestoAutousado (codPAUS)
)Engine=InnoDB;

create table retiro(
codR int auto_increment primary key,
codC int,
codCL int,
motivoretiro varchar(20),
estado varchar(10),
fvto date,
femision date,
constraint fk_retiro_contrato foreign key (codC) references contrato (codC),
constraint fk_retiro_cliente foreign key (codCL) references cliente (codCL)
)Engine=InnoDB;


create table ordenpago(
codORPAG int auto_increment primary key,
codC int,
total float,
fvto date,
fechacobro date,
estado varchar(10),
constraint fk_ordenpago_contrato foreign key (codC) references contrato (codC)
)Engine=InnoDB;

Create table moroso(
codMOR int auto_increment primary key,
codCL int,
codPRE int,
fecdeclaracmoroso date,
borrado boolean,
constraint fk_moroso_cliente foreign key (codCL) references cliente (codCL),
constraint fk_moroso_prestamo foreign key (codPRE) references prestamo (codPRE)
)Engine=InnoDB;

create table Porcentaje(
codPORC int auto_increment primary key,
descripcion varchar(30),
porcentaje float
)Engine=InnoDB;

create table Usuario(
codUsuario int auto_increment primary key,
username varchar(30),
password varchar(30),
PermisoAdmin boolean,
ABM boolean,
Compras boolean,
Posventa boolean,
Contratos boolean
)Engine=InnoDB;

Create table RevisionPrestamoTemporal(
codRPT int auto_increment primary key,
codPRE int,
cant int,
monto float,
tipo varchar(30)
)Engine=InnoDB;


Insert into Usuario VALUES
('',"Administrador","1234",TRUE,TRUE,TRUE,TRUE,TRUE),
('',"Usuario","",FALSE,FALSE,FALSE,FALSE,FALSE);