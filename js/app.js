// 1. PRODUCTOS Y CARRITO
const productos = [
    { id: 1, nombre: 'Audífonos Bluetooth', precio: 45, categoria: 'Audio', imagen: 'imagenes/audifonos.png' },
    { id: 2, nombre: 'Teclado mecánico', precio: 75.50, categoria: 'Periféricos', imagen: 'imagenes/teclado.png' },
    { id: 3, nombre: 'Mouse gamer', precio: 30, categoria: 'Periféricos', imagen: 'imagenes/mouse.png' },
    { id: 4, nombre: 'Base para laptop', precio: 25, categoria: 'Accesorios', imagen: 'imagenes/base.png' }
];
const clave = 'techstore_carrito';
let carrito = [];
// 2. MOSTRAR Y FILTRAR PRODUCTOS
function mostrarProductos() {
    const texto = document.getElementById('busqueda').value.toLowerCase();
    const categoria = document.getElementById('categoria').value; const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto) &&
        (categoria === 'Todas' || p.categoria === categoria));
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = filtrados.map(p => `
<article class="tarjeta">
<img src="${p.imagen}" alt="${p.nombre}">
<div class="detalle"><span class="categoria">${p.categoria}</span>
<h3>${p.nombre}</h3><p class="precio">$${p.precio.toFixed(2)}</p>
<button class="boton" data-agregar="${p.id}">+ Agregar al carrito</button>
</div>
</article>`).join('') || '<p>No se encontraron productos.</p>';
}
// 3. CAMBIAR CANTIDADES Y GUARDAR
function cambiarCantidad(id, cambio) {
    const item = carrito.find(p => p.id === id);
    if (item) item.cantidad += cambio;
    else if (cambio > 0) carrito.push({ id, cantidad: 1 });
    carrito = carrito.filter(p => p.cantidad > 0);
    guardarCarrito();
    mostrarCarrito();
}
function guardarCarrito() {
    try { localStorage.setItem(clave, JSON.stringify(carrito)); }
    catch (error) { document.getElementById('estado').textContent = 'El navegador no permite guardar los datos.'; }
} function cargarCarrito() {
    try {
        const datos = JSON.parse(localStorage.getItem(clave) || '[]');
        if (Array.isArray(datos)) carrito = datos.filter(p =>
            productos.some(producto => producto.id === p.id) &&
            Number.isInteger(p.cantidad) && p.cantidad > 0 && p.cantidad <= 99);
    } catch (error) { carrito = []; }
}
// 4. PINTAR CARRITO Y MOSTRAR JSON / LOCALSTORAGE
function mostrarCarrito() {
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = carrito.map(item => {
        const p = productos.find(producto => producto.id === item.id); return `<div class="fila"><img src="${p.imagen}" alt="">
<div class="info"><strong>${p.nombre}</strong>$${p.precio.toFixed(2)} · ${item.cantidad} unidad(es)</div>
<button data-id="${p.id}" data-cambio="-1" aria-label="Quitar una unidad de ${p.nombre}">−</button>
<button data-id="${p.id}" data-cambio="1" aria-label="Añadir una unidad de ${p.nombre}">+</button></div>`;
    }).join('') || '<p class="vacio">Tu carrito está vacío. ¡Agrega algo!</p>';
    const total = carrito.reduce((suma, item) => {
        const p = productos.find(producto => producto.id === item.id);
        return suma + p.precio * item.cantidad;
    }, 0);
    document.getElementById('total').textContent = total.toFixed(2);
    document.getElementById('contador').textContent = carrito.reduce((n, p) => n + p.cantidad, 0);
    mostrarDatos();
} function mostrarDatos() {
    const ejemplo = carrito.map(item => ({
        producto: productos.find(p => p.id === item.id).nombre,
        cantidad: item.cantidad
    }));
    document.getElementById('vista-arreglo').textContent = JSON.stringify(ejemplo, null, 2);
    document.getElementById('vista-json').textContent = JSON.stringify(carrito, null, 2);
    let guardado = null;
    try { guardado = localStorage.getItem(clave); } catch (error) { /* Sin acceso */ }
    document.getElementById('vista-storage').textContent = guardado === null ? '(vacío)' : guardado;
    document.getElementById('estado').textContent = carrito.length
        ? '\u{2705} El carrito se guarda en el navegador. Recarga con F5 para comprobarlo.'
        : '\u{1F4A1} Prueba: agrega un producto, mira los cuadros y actualiza la página.';
        }// 5. EVENTOS DEL USUARIO
// Un solo evento controla todos los botones de las tarjetas.
document.getElementById('lista-productos').addEventListener('click', evento => {
    const boton = evento.target.closest('[data-agregar]');
    if (boton) cambiarCantidad(Number(boton.dataset.agregar), 1);
});
document.getElementById('lista-carrito').addEventListener('click', evento => {
    const boton = evento.target.closest('[data-cambio]');
    if (boton) cambiarCantidad(Number(boton.dataset.id), Number(boton.dataset.cambio));
});
document.getElementById('busqueda').addEventListener('input', mostrarProductos);
document.getElementById('categoria').addEventListener('change', mostrarProductos);
document.getElementById('vaciar').addEventListener('click', () => {
    carrito = []; guardarCarrito(); mostrarCarrito();
});
document.getElementById('formulario').addEventListener('submit', evento => {
    evento.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const mensaje = document.getElementById('mensaje');
    if (nombre.length < 3) { mensaje.textContent = 'Escribe un nombre válido.'; return; }
    if (carrito.length === 0) { mensaje.textContent = 'Primero agrega un producto.'; return; }
    mensaje.textContent = `¡Gracias, ${nombre}! La compra de prueba fue completada.`;
    carrito = []; guardarCarrito(); mostrarCarrito();
    evento.target.reset();
});
cargarCarrito(); mostrarProductos();
mostrarCarrito();
/* 6. MODO OSCURO: recordar la preferencia sin modificar el carrito */
const botonTema = document.getElementById('cambiar-tema');

function cambiarTema(oscuro) {
    document.body.classList.toggle('oscuro', oscuro);
    botonTema.textContent = oscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';
    botonTema.setAttribute('aria-pressed', String(oscuro));

    try {
        localStorage.setItem('techstore_tema', oscuro ? 'oscuro' : 'claro');
    } catch (error) {
        /* El botón funciona aún aunque el navegador no guarde */
    }
}

let temaInicial = 'claro';

try {
    temaInicial = localStorage.getItem('techstore_tema') || 'claro';
} catch (error) {
    /* Usar tema claro por defecto */
}

cambiarTema(temaInicial === 'oscuro');

botonTema.addEventListener('click', () => {
    cambiarTema(!document.body.classList.contains('oscuro'));
});

