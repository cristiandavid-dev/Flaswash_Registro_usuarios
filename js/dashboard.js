
// VALIDACION DE SESIÓN (Redirigir si no hay usuario)
if (!localStorage.getItem("usuario")) {
    window.location.href = "index.html";
}

const currentUser = localStorage.getItem("usuario");

// MÓDULO: NAVEGACION Y CONTROL DE VISTAS
function showView(viewId) {
    document.querySelectorAll(".vista").forEach(v => {
        v.classList.remove("active");
    });
    document.getElementById(viewId).classList.add("active");

    document.querySelectorAll("nav a").forEach(a => {
        a.classList.remove("nav-active");
        if (a.dataset.view === viewId) {
            a.classList.add("nav-active");
        }
    });

    
    if (viewId === "vista-citas") renderCitas();
    if (viewId === "vista-promociones") initPromociones();
    if (viewId === "vista-perfil") cargarPerfil();
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

// MÓDULO: GESTIÓN DE CITAS


const servicios = [
    { id: "lavado-sencillo",    nombre: "Lavado Sencillo",     precio: "$25.000", duracion: "30-40 min" },
    { id: "polichado-completo", nombre: "Polichado Completo",  precio: "$45.000", duracion: "50-60 min" },
    { id: "lavado-motor",       nombre: "Lavado de Motor",     precio: "$30.000", duracion: "20 min"    },
    { id: "lavado-interior",    nombre: "Lavado Interior",     precio: "$35.000", duracion: "45 min"    },
    { id: "encerado-premium",   nombre: "Encerado Premium",    precio: "$55.000", duracion: "60-90 min" },
    { id: "lavado-moto",        nombre: "Lavado de Moto",      precio: "$15.000", duracion: "15-20 min" },
];

function getCitas() {
    return JSON.parse(localStorage.getItem("citas_fw") || "[]");
}

function saveCitas(citas) {
    localStorage.setItem("citas_fw", JSON.stringify(citas));
}

function renderCitas() {
    let citas = getCitas();
    const container = document.getElementById("lista-citas");

    if (citas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-symbols-outlined empty-icon">event_busy</span>
                <p class="empty-title">Sin citas agendadas</p>
                <p class="empty-sub">Agenda tu primera cita y mantén tu vehículo impecable.</p>
            </div>`;
        return;
    }

    const estadoClase = {
        "Pendiente":  "badge-pendiente",
        "En proceso": "badge-proceso",
        "Completada": "badge-completada",
        "Cancelada":  "badge-cancelada",
    };

    const estadoIcono = {
        "Pendiente":  "schedule",
        "En proceso": "autorenew",
        "Completada": "check_circle",
        "Cancelada":  "cancel",
    };

    container.innerHTML = citas.slice().reverse().map((c) => {
        const fechaObj = new Date(c.fecha + "T00:00:00");
        const fechaStr = fechaObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
        const iconoServicio = c.servicio.toLowerCase().includes("moto") ? "two_wheeler" : "directions_car";
        
        let actionsHtml = `
            <div class="flex gap-2 w-full">
                <button class="btn-cancelar flex-1 justify-center" style="color: #3b82f6; background: #eff6ff;" onclick="abrirModalEditarCita(${c.id})">
                    <span class="material-symbols-outlined" style="font-size:15px">edit</span> Editar
                </button>
                <button class="btn-cancelar flex-1 justify-center" style="color: #ef4444; background: #fef2f2;" onclick="eliminarCita(${c.id})">
                    <span class="material-symbols-outlined" style="font-size:15px">delete</span> Eliminar
                </button>
            </div>
        `;

        return `
        <div class="cita-card animate-in">
            <div class="cita-header">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span class="material-symbols-outlined">${iconoServicio}</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-base leading-tight">${c.servicio}</h4>
                        <p class="text-[11px] text-gray-500 mt-0.5">Vehículo: <span class="font-semibold text-gray-700">${c.vehiculo}</span></p>
                    </div>
                </div>
                <span class="badge ${estadoClase[c.estado] || ''}">
                    <span class="material-symbols-outlined" style="font-size:14px">${estadoIcono[c.estado] || 'info'}</span>
                    ${c.estado}
                </span>
            </div>
            <div class="cita-body">
                <div class="cita-detail">
                    <span class="material-symbols-outlined" style="font-size:15px;color:#3b82f6">calendar_month</span>
                    <span>${fechaStr}</span>
                </div>
                <div class="cita-detail">
                    <span class="material-symbols-outlined" style="font-size:15px;color:#3b82f6">schedule</span>
                    <span>${c.hora} hrs • ${c.duracion}</span>
                </div>
                <div class="cita-detail">
                    <span class="material-symbols-outlined" style="font-size:15px;color:#3b82f6">payments</span>
                    <span>${c.precio}</span>
                </div>
                ${c.notas ? `<div class="cita-detail"><span class="material-symbols-outlined" style="font-size:15px;color:#3b82f6">notes</span><span>${c.notas}</span></div>` : ""}
            </div>
            <div class="cita-footer">${actionsHtml}</div>
        </div>`;
    }).join("");
}

function eliminarCita(id) {
    if(!confirm("¿Estás seguro de eliminar esta cita?")) return;
    let citas = getCitas();
    citas = citas.filter(c => c.id !== id);
    saveCitas(citas);
    renderCitas();
    mostrarToast("Cita eliminada", "warning");
}

function limpiarCitas() {
    if(!confirm("¿Estás seguro de eliminar TODO el historial de citas?")) return;
    saveCitas([]);
    renderCitas();
    mostrarToast("Historial limpiado", "warning");
}

function abrirModalEditarCita(id) {
    const citas = getCitas();
    const cita = citas.find(c => c.id === id);
    if (!cita) return;
    
    const servicioObj = servicios.find(s => s.nombre === cita.servicio);
    const selectServicio = document.getElementById("edit-cita-servicio");
    if (servicioObj) {
        selectServicio.value = servicioObj.id;
    }

    document.getElementById("edit-cita-id").value = cita.id;
    document.getElementById("edit-cita-fecha").value = cita.fecha;
    document.getElementById("edit-cita-hora").value = cita.hora;
    document.getElementById("edit-cita-vehiculo").value = cita.vehiculo;
    document.getElementById("edit-cita-notas").value = cita.notas || "";
    document.getElementById("edit-cita-estado").value = cita.estado;
    
    document.getElementById("modal-editar-cita").classList.add("active");
}

function cerrarModalEditarCita() {
    document.getElementById("modal-editar-cita").classList.remove("active");
}

function guardarEdicionCita(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById("edit-cita-id").value);
    const servicioId = document.getElementById("edit-cita-servicio").value;
    const servicioObj = servicios.find(s => s.id === servicioId);
    
    const citas = getCitas();
    const idx = citas.findIndex(c => c.id === id);
    if (idx !== -1) {
        citas[idx].servicio = servicioObj.nombre;
        citas[idx].precio = servicioObj.precio;
        citas[idx].duracion = servicioObj.duracion;
        citas[idx].fecha = document.getElementById("edit-cita-fecha").value;
        citas[idx].hora = document.getElementById("edit-cita-hora").value;
        citas[idx].vehiculo = document.getElementById("edit-cita-vehiculo").value.trim();
        citas[idx].notas = document.getElementById("edit-cita-notas").value.trim();
        citas[idx].estado = document.getElementById("edit-cita-estado").value;
        
        saveCitas(citas);
        renderCitas();
        cerrarModalEditarCita();
        mostrarToast("Cita actualizada con éxito!", "success");
    }
}

function agendarCita(e) {
    e.preventDefault();
    const form = e.target;
    
    const servicioId = form.querySelector("#cita-servicio").value;
    const servicioObj = servicios.find(s => s.id === servicioId);
    const fecha      = form.querySelector("#cita-fecha").value;
    const hora       = form.querySelector("#cita-hora").value;
    const vehiculo   = form.querySelector("#cita-vehiculo").value.trim();
    const notas      = form.querySelector("#cita-notas").value.trim();

    if (!vehiculo) {
        mostrarToast("Por favor ingresa la placa del vehículo", "error");
        return;
    }

    const citas = getCitas();

    const nuevaCita = {
        id: Date.now(),
        servicio: servicioObj.nombre,
        precio:   servicioObj.precio,
        duracion: servicioObj.duracion,
        fecha, 
        hora, 
        vehiculo, 
        notas,
        estado: "Pendiente"
    };
    
    citas.push(nuevaCita);
    saveCitas(citas);
    form.reset();
    
    mostrarToast("Cita agendada con éxito!", "success");

    setFechaMinima();
    renderCitas();
    document.getElementById("lista-citas").scrollIntoView({ behavior: "smooth" });
}

function setFechaMinima() {
    const hoy = new Date().toISOString().split("T")[0];
    const inputFecha = document.getElementById("cita-fecha");
    if (inputFecha) inputFecha.min = hoy;
}


// MÓDULO: GESTIÓN DE PROMOCIONES

function getPromociones() {
    return JSON.parse(localStorage.getItem("promociones_fw") || JSON.stringify([
        {
            id: 1,
            titulo: "Lavado Express 2x1",
            descripcion: "Trae tu vehículo y el de un amigo y paga solo uno. Válido de lunes a viernes.",
            descuento: "50%",
            color: "promo-blue",
            icono: "local_car_wash",
            cupon: "FLASH2X1",
            activa: true
        },
        {
            id: 2,
            titulo: "Polichado Premium",
            descripcion: "Tratamiento completo de carrocería con encerado de alta gama. Solo para socios Platinum.",
            descuento: "30%",
            color: "promo-purple",
            icono: "verified",
            cupon: "PLAT30",
            activa: true
        }
    ]));
}

function savePromociones(promos) {
    localStorage.setItem("promociones_fw", JSON.stringify(promos));
}

function initPromociones() {
    renderPromociones();
}

function renderPromociones() {
    const container = document.getElementById("grid-promos");
    const promos = getPromociones();
    container.innerHTML = promos.map(p => `
        <div class="promo-card ${p.color} animate-in ${!p.activa ? 'opacity-60 grayscale' : ''}">
            <div class="flex justify-between items-start mb-2">
                <span class="badge ${p.activa ? 'badge-completada' : 'badge-cancelada'} text-[10px]">
                    ${p.activa ? 'Activa' : 'Inactiva'}
                </span>
                <div class="flex gap-1">
                    <button class="bg-white/20 hover:bg-white/40 p-1.5 rounded-lg transition" onclick="togglePromoStatus(${p.id})" title="${p.activa ? 'Desactivar' : 'Activar'}">
                        <span class="material-symbols-outlined text-sm text-white">${p.activa ? 'visibility_off' : 'visibility'}</span>
                    </button>
                    <button class="bg-white/20 hover:bg-white/40 p-1.5 rounded-lg transition" onclick="abrirModalPromo(${p.id})" title="Editar">
                        <span class="material-symbols-outlined text-sm text-white">edit</span>
                    </button>
                    <button class="bg-red-500/80 hover:bg-red-500 p-1.5 rounded-lg transition" onclick="eliminarPromo(${p.id})" title="Eliminar">
                        <span class="material-symbols-outlined text-sm text-white">delete</span>
                    </button>
                </div>
            </div>
            <div class="promo-icon-wrap">
                <span class="material-symbols-outlined promo-main-icon">${p.icono}</span>
                <div class="promo-descuento">${p.descuento} OFF</div>
            </div>
            <h3 class="promo-titulo mt-2">${p.titulo}</h3>
            <p class="promo-desc mb-4">${p.descripcion}</p>
            
            <div class="promo-cupon-row mt-auto">
                <span class="promo-cupon-label">CUPÓN:</span>
                <span class="promo-cupon-code" id="cupon-${p.id}">${p.cupon}</span>
                <button class="btn-copiar" onclick="copiarCupon('${p.cupon}', ${p.id})">
                    <span class="material-symbols-outlined" style="font-size:15px">content_copy</span>
                </button>
            </div>
        </div>
    `).join("");
}

function eliminarPromo(id) {
    if(!confirm("¿Estás seguro de eliminar esta promoción?")) return;
    let promos = getPromociones();
    promos = promos.filter(p => p.id !== id);
    savePromociones(promos);
    renderPromociones();
    mostrarToast("Promoción eliminada", "warning");
}

function togglePromoStatus(id) {
    let promos = getPromociones();
    const idx = promos.findIndex(p => p.id === id);
    if(idx !== -1) {
        promos[idx].activa = !promos[idx].activa;
        savePromociones(promos);
        renderPromociones();
        mostrarToast(promos[idx].activa ? "Promoción activada" : "Promoción desactivada", "info");
    }
}

function abrirModalPromo(id = null) {
    const modal = document.getElementById("modal-promocion");
    const form = document.getElementById("form-promocion");
    form.reset();
    
    if (id) {
        const promos = getPromociones();
        const p = promos.find(x => x.id === id);
        document.getElementById("promo-id").value = p.id;
        document.getElementById("promo-titulo").value = p.titulo;
        document.getElementById("promo-desc").value = p.descripcion;
        document.getElementById("promo-descuento").value = p.descuento.replace("OFF", "").trim();
        document.getElementById("promo-cupon").value = p.cupon;
        document.getElementById("promo-color").value = p.color;
        document.getElementById("promo-icono").value = p.icono;
        document.getElementById("promo-estado").value = p.activa ? "true" : "false";
    } else {
        document.getElementById("promo-id").value = "";
        document.getElementById("promo-estado").value = "true";
    }
    
    modal.classList.add("active");
}

function cerrarModalPromo() {
    document.getElementById("modal-promocion").classList.remove("active");
}

function guardarPromocion(e) {
    e.preventDefault();
    const id = document.getElementById("promo-id").value;
    const titulo = document.getElementById("promo-titulo").value.trim();
    const descripcion = document.getElementById("promo-desc").value.trim();
    let descuento = document.getElementById("promo-descuento").value.trim();
    if(!descuento.includes("%") && !descuento.includes("$")) descuento += "%";
    
    const cupon = document.getElementById("promo-cupon").value.trim().toUpperCase();
    const color = document.getElementById("promo-color").value;
    const icono = document.getElementById("promo-icono").value;
    const activa = document.getElementById("promo-estado").value === "true";

    let promos = getPromociones();

    if (id) {
        const idx = promos.findIndex(p => p.id == id);
        if(idx !== -1) {
            promos[idx] = { ...promos[idx], titulo, descripcion, descuento, cupon, color, icono, activa };
            mostrarToast("Promoción actualizada", "success");
        }
    } else {
        promos.push({
            id: Date.now(),
            titulo, descripcion, descuento, cupon, color, icono, activa
        });
        mostrarToast("Promoción creada", "success");
    }
    savePromociones(promos);
    cerrarModalPromo();
    renderPromociones();
}

function copiarCupon(cupon, id) {
    navigator.clipboard.writeText(cupon).then(() => {
        const el = document.getElementById(`cupon-${id}`);
        el.textContent = "Copiado!";
        el.style.color = "#22c55e";
        setTimeout(() => { el.textContent = cupon; el.style.color = ""; }, 2000);
        mostrarToast(`Cupón ${cupon} copiado al portapapeles`, "success");
    });
}

function usarPromo(cupon) {
    mostrarToast(`Redirigiendo para usar el cupón ${cupon}...`, "info");
    setTimeout(() => showView("vista-citas"), 1000);
}


// MÓDULO: GESTIÓN DE MI PERFIL

function getVehiculos() {
    return JSON.parse(localStorage.getItem("vehiculos_fw") || JSON.stringify([
        { id: 1, marca: "Toyota",  modelo: "Corolla", placa: "ABC-123", tipo: "Sedán",  color: "Blanco" },
        { id: 2, marca: "Renault", modelo: "Duster",  placa: "XYZ-789", tipo: "SUV",    color: "Gris"   },
    ]));
}

function saveVehiculos(v) {
    localStorage.setItem("vehiculos_fw", JSON.stringify(v));
}

function getPerfil() {
    return JSON.parse(localStorage.getItem("perfil_fw") || JSON.stringify({
        nombre:    "Administrador",
        email:     "admin@mail.com",
        telefono:  "+57 300 123 4567",
        direccion: "Calle 45 #23-10, Bogotá",
        membresia: "Platinum",
    }));
}

function savePerfil(p) {
    localStorage.setItem("perfil_fw", JSON.stringify(p));
}

function cargarPerfil() {
    const perfil = getPerfil();
    document.getElementById("perfil-nombre").value    = perfil.nombre    || "";
    document.getElementById("perfil-email").value     = perfil.email     || "";
    document.getElementById("perfil-telefono").value  = perfil.telefono  || "";
    document.getElementById("perfil-direccion").value = perfil.direccion || "";
    document.getElementById("perfil-membresia").textContent  = perfil.membresia || "Platinum";
    document.getElementById("perfil-avatar-inicial").textContent = (perfil.nombre || "A")[0].toUpperCase();
    document.getElementById("perfil-header-nombre").textContent  = perfil.nombre || "Administrador";
    document.getElementById("perfil-header-email").textContent   = perfil.email  || "admin@mail.com";
    renderVehiculos();
}

function guardarPerfil(e) {
    e.preventDefault();
    const perfil = {
        nombre:    document.getElementById("perfil-nombre").value.trim(),
        email:     document.getElementById("perfil-email").value.trim(),
        telefono:  document.getElementById("perfil-telefono").value.trim(),
        direccion: document.getElementById("perfil-direccion").value.trim(),
        membresia: getPerfil().membresia,
    };
    savePerfil(perfil);
    localStorage.setItem("usuario", perfil.nombre);
    const usuarioEl = document.getElementById("usuario-header");
    if (usuarioEl) usuarioEl.textContent = perfil.nombre;
    document.getElementById("perfil-avatar-inicial").textContent  = perfil.nombre[0].toUpperCase();
    document.getElementById("perfil-header-nombre").textContent   = perfil.nombre;
    document.getElementById("perfil-header-email").textContent    = perfil.email;
    mostrarToast("Perfil actualizado correctamente", "success");
}

function renderVehiculos() {
    const vehiculos = getVehiculos();
    const container = document.getElementById("lista-vehiculos");

    if (vehiculos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-symbols-outlined empty-icon">no_crash</span>
                <p class="empty-title">Sin vehículos registrados</p>
                <p class="empty-sub">Agrega tu primer vehículo para agilizar las citas.</p>
            </div>`;
        return;
    }

    const tipoIcono = { "Sedán": "directions_car", "SUV": "directions_car", "Camioneta": "local_shipping", "Moto": "two_wheeler", "Otro": "garage" };

    container.innerHTML = vehiculos.map(v => `
        <div class="vehiculo-card animate-in">
            <div class="vehiculo-icon-wrap">
                <span class="material-symbols-outlined" style="font-size:26px">${tipoIcono[v.tipo] || "directions_car"}</span>
            </div>
            <div class="vehiculo-info">
                <p class="vehiculo-nombre">${v.marca} ${v.modelo}</p>
                <div class="vehiculo-detalles">
                    <span class="vehiculo-placa">${v.placa}</span>
                    <span class="vehiculo-tag">${v.tipo}</span>
                    <span class="vehiculo-tag" style="background:#f0fdf4;color:#16a34a">${v.color}</span>
                </div>
            </div>
            <button class="btn-eliminar-vehiculo" onclick="eliminarVehiculo(${v.id})" title="Eliminar">
                <span class="material-symbols-outlined" style="font-size:17px">delete</span>
            </button>
        </div>
    `).join("");
}

function agregarVehiculo(e) {
    e.preventDefault();
    const form  = e.target;
    const marca  = form.querySelector("#v-marca").value.trim();
    const modelo = form.querySelector("#v-modelo").value.trim();
    const placa  = form.querySelector("#v-placa").value.trim().toUpperCase();
    const tipo   = form.querySelector("#v-tipo").value;
    const color  = form.querySelector("#v-color").value.trim();

    if (!marca || !modelo || !placa) {
        mostrarToast("Completa todos los campos del vehículo", "error");
        return;
    }

    const vehiculos = getVehiculos();
    vehiculos.push({ id: Date.now(), marca, modelo, placa, tipo, color });
    saveVehiculos(vehiculos);
    form.reset();
    renderVehiculos();
    mostrarToast("Vehículo agregado correctamente", "success");
    document.getElementById("modal-vehiculo").classList.remove("active");
}

function eliminarVehiculo(id) {
    let vehiculos = getVehiculos();
    vehiculos = vehiculos.filter(v => v.id !== id);
    saveVehiculos(vehiculos);
    renderVehiculos();
    mostrarToast("Vehículo eliminado", "warning");
}

function abrirModalVehiculo() {
    document.getElementById("modal-vehiculo").classList.add("active");
}

function cerrarModalVehiculo() {
    document.getElementById("modal-vehiculo").classList.remove("active");
}

// =============================================
// SISTEMA DE NOTIFICACIONES TOAST (Mensajes emergentes)
// =============================================

function mostrarToast(mensaje, tipo = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    const iconos = { success: "check_circle", error: "error", warning: "warning", info: "info" };
    toast.innerHTML = `
        <span class="material-symbols-outlined" style="font-size:17px">${iconos[tipo] || "info"}</span>
        <span>${mensaje}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}


// INICIALIZACIÓN DE LA APLICACIÓN AL CARGAR EL DOM


document.addEventListener("DOMContentLoaded", () => {
    const nombre = localStorage.getItem("usuario") || "Admin";
    const usuarioEl = document.getElementById("usuario-header");
    if (usuarioEl) usuarioEl.textContent = nombre;

    showView("vista-inicio");
    setFechaMinima();

    const citaForm = document.getElementById("form-cita");
    if (citaForm) citaForm.addEventListener("submit", agendarCita);

    const perfilForm = document.getElementById("form-perfil");
    if (perfilForm) perfilForm.addEventListener("submit", guardarPerfil);

    const vehiculoForm = document.getElementById("form-vehiculo");
    if (vehiculoForm) vehiculoForm.addEventListener("submit", agregarVehiculo);

    const formEditarCita = document.getElementById("form-editar-cita");
    if (formEditarCita) formEditarCita.addEventListener("submit", guardarEdicionCita);

    const formPromocion = document.getElementById("form-promocion");
    if (formPromocion) formPromocion.addEventListener("submit", guardarPromocion);

    const modalVehiculo = document.getElementById("modal-vehiculo");
    if (modalVehiculo) modalVehiculo.addEventListener("click", e => { if (e.target === modalVehiculo) cerrarModalVehiculo(); });
    
    const modalEditarCita = document.getElementById("modal-editar-cita");
    if (modalEditarCita) modalEditarCita.addEventListener("click", e => { if (e.target === modalEditarCita) cerrarModalEditarCita(); });

    const modalPromocion = document.getElementById("modal-promocion");
    if (modalPromocion) modalPromocion.addEventListener("click", e => { if (e.target === modalPromocion) cerrarModalPromo(); });
});