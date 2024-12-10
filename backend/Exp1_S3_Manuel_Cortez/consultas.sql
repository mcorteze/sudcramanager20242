-- ---------------------------------------
-- Caso 1: Gestión de inventario y pedidos
-- ---------------------------------------

-- 1. Lista el nombre de cada producto agrupado por categoría y ordenado por precio de mayor a menor
SELECT categoria, LISTAGG(nombre, ', ') WITHIN GROUP (ORDER BY precio DESC) AS productos
FROM productos
GROUP BY categoria
ORDER BY MAX(precio) DESC;


-- 2. Calcula el promedio de ventas mensuales y muestra el mes y año con mayores ventas
SELECT TO_CHAR(fecha_venta, 'YYYY-MM') AS mes_anio, SUM(cantidad) AS total_vendido
FROM ventas
GROUP BY TO_CHAR(fecha_venta, 'YYYY-MM')
ORDER BY total_vendido DESC
FETCH FIRST 1 ROW ONLY;

-- 3. Encuentra el ID del cliente que ha gastado más dinero en compras durante el último año considerando clientes registrados hace menos de un año
SELECT id_cliente
FROM ventas v
JOIN clientes c ON v.id_cliente = c.id_cliente
WHERE c.fecha_registro >= ADD_MONTHS(SYSDATE, -12)
  AND v.fecha_venta >= ADD_MONTHS(SYSDATE, -12)
GROUP BY v.id_cliente
ORDER BY SUM(v.total_venta) DESC
FETCH FIRST 1 ROW ONLY;

-- ---------------------------------------
-- Caso 2: Gestión de Recursos Humanos
-- ---------------------------------------

-- 1. Determina el salario promedio, máximo y mínimo por departamento
SELECT departamento, AVG(salario) AS salario_promedio,
       MAX(salario) AS salario_maximo,
       MIN(salario) AS salario_minimo
FROM empleados
GROUP BY departamento;

-- 2. Encuentra el salario más alto en cada departamento
SELECT departamento, MAX(salario) AS salario_mas_alto
FROM empleados
GROUP BY departamento;

-- 3. Calcula la antigüedad en años de cada empleado y muestra aquellos con más de 10 años en la empresa
SELECT nombre, apellido, TRUNC(MONTHS_BETWEEN(SYSDATE, fecha_registro) / 12) AS antiguedad
FROM empleados
WHERE TRUNC(MONTHS_BETWEEN(SYSDATE, fecha_registro) / 12) > 10;


-- -------------------------------------
--            Poblar la BBDD
-- -------------------------------------
-- Poblamiento de Clientes
BEGIN
    INSERT INTO clientes (id_cliente, nombre, apellido, fecha_registro, correo, telefono, ciudad) VALUES (cliente_seq.NEXTVAL, 'Juan', 'Pérez', TO_DATE('2023-01-15', 'YYYY-MM-DD'), 'juan.perez@example.com', '555-1234', 'Madrid');
    INSERT INTO clientes (id_cliente, nombre, apellido, fecha_registro, correo, telefono, ciudad) VALUES (cliente_seq.NEXTVAL, 'Ana', 'Gómez', TO_DATE('2022-05-22', 'YYYY-MM-DD'), 'ana.gomez@example.com', '555-5678', 'Barcelona');
    INSERT INTO clientes (id_cliente, nombre, apellido, fecha_registro, correo, telefono, ciudad) VALUES (cliente_seq.NEXTVAL, 'Luis', 'Fernández', TO_DATE('2023-03-10', 'YYYY-MM-DD'), 'luis.fernandez@example.com', '555-8765', 'Valencia');
    INSERT INTO clientes (id_cliente, nombre, apellido, fecha_registro, correo, telefono, ciudad) VALUES (cliente_seq.NEXTVAL, 'María', 'López', TO_DATE('2023-02-18', 'YYYY-MM-DD'), 'maria.lopez@example.com', '555-4321', 'Sevilla');
END;
/

-- Poblamiento de Productos
BEGIN
    INSERT INTO productos (id_producto, nombre, categoria, precio, stock) VALUES (producto_seq.NEXTVAL, 'Laptop', 'Electrónica', 1200.00, 50);
    INSERT INTO productos (id_producto, nombre, categoria, precio, stock) VALUES (producto_seq.NEXTVAL, 'Teléfono', 'Electrónica', 600.00, 100);
    INSERT INTO productos (id_producto, nombre, categoria, precio, stock) VALUES (producto_seq.NEXTVAL, 'Mesa', 'Muebles', 300.00, 20);
    INSERT INTO productos (id_producto, nombre, categoria, precio, stock) VALUES (producto_seq.NEXTVAL, 'Silla', 'Muebles', 150.00, 30);
END;
/

-- Poblamiento de Personal de Ventas
BEGIN
    INSERT INTO personal_ventas (id_personal, nombre, apellido, correo, telefono) VALUES (personal_seq.NEXTVAL, 'Carlos', 'Torres', 'carlos.torres@example.com', '555-9876');
    INSERT INTO personal_ventas (id_personal, nombre, apellido, correo, telefono) VALUES (personal_seq.NEXTVAL, 'Elena', 'Martínez', 'elena.martinez@example.com', '555-6543');
END;
/

-- Poblamiento de Ventas
BEGIN
    INSERT INTO ventas (id_venta, id_cliente, id_producto, cantidad, fecha_venta, total_venta, id_personal) VALUES (venta_seq.NEXTVAL, 1, 1, 1, TO_DATE('2023-05-15', 'YYYY-MM-DD'), 1200.00, 1);
    INSERT INTO ventas (id_venta, id_cliente, id_producto, cantidad, fecha_venta, total_venta, id_personal) VALUES (venta_seq.NEXTVAL, 2, 2, 2, TO_DATE('2023-06-18', 'YYYY-MM-DD'), 1200.00, 1);
    INSERT INTO ventas (id_venta, id_cliente, id_producto, cantidad, fecha_venta, total_venta, id_personal) VALUES (venta_seq.NEXTVAL, 3, 3, 1, TO_DATE('2023-07-22', 'YYYY-MM-DD'), 300.00, 2);
    INSERT INTO ventas (id_venta, id_cliente, id_producto, cantidad, fecha_venta, total_venta, id_personal) VALUES (venta_seq.NEXTVAL, 4, 4, 3, TO_DATE('2023-08-30', 'YYYY-MM-DD'), 450.00, 2);
END;
/
