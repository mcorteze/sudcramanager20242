-- Creamos la secuencia para clientes
CREATE SEQUENCE cliente_seq START WITH 1 INCREMENT BY 1;

-- Tabla Clientes
CREATE TABLE clientes (
    id_cliente    INTEGER NOT NULL,
    nombre        VARCHAR2(30) NOT NULL,
    apellido      VARCHAR2(30) NOT NULL,
    fecha_registro DATE NOT NULL,
    correo        VARCHAR2(50) NOT NULL,
    telefono      VARCHAR2(20),
    ciudad        VARCHAR2(50),
    CONSTRAINT pk_cliente PRIMARY KEY (id_cliente)
);

-- Creamos la secuencia para productos
CREATE SEQUENCE producto_seq START WITH 1 INCREMENT BY 1;

-- Tabla Productos
CREATE TABLE productos (
    id_producto   INTEGER NOT NULL,
    nombre        VARCHAR2(50) NOT NULL,
    categoria     VARCHAR2(50),
    precio        NUMBER(11, 2) NOT NULL,
    stock         INTEGER NOT NULL,
    CONSTRAINT pk_producto PRIMARY KEY (id_producto)
);

-- Creamos la secuencia para ventas
CREATE SEQUENCE venta_seq START WITH 1 INCREMENT BY 1;

-- Tabla Ventas
CREATE TABLE ventas (
    id_venta      INTEGER NOT NULL,
    id_cliente    INTEGER NOT NULL,
    id_producto   INTEGER NOT NULL,
    cantidad      INTEGER NOT NULL,
    fecha_venta   DATE NOT NULL,
    total_venta   NUMBER(13, 2) NOT NULL,
    id_personal   INTEGER NOT NULL,
    CONSTRAINT pk_venta PRIMARY KEY (id_venta),
    CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente),
    CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
);

-- Creamos la secuencia para personal de ventas
CREATE SEQUENCE personal_seq START WITH 1 INCREMENT BY 1;

-- Tabla Personal de Ventas
CREATE TABLE personal_ventas (
    id_personal   INTEGER NOT NULL,
    nombre        VARCHAR2(30) NOT NULL,
    apellido      VARCHAR2(30) NOT NULL,
    correo        VARCHAR2(50) NOT NULL,
    telefono      VARCHAR2(20),
    CONSTRAINT pk_personal PRIMARY KEY (id_personal)
);
