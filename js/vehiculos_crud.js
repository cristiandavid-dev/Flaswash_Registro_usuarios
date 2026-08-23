// Estado inicial (Base de datos simulada en LocalStorage)
let vehiculos = JSON.parse(localStorage.getItem("flashwash_vehiculos")) || [];

const form = document.getElementById("formVehiculo");
const tabla = document.getElementById("tablaVehiculos");
const btnLimpiar = document.getElementById("btnLimpiar");

// Inicializar el modulo
document.addEventListener("DOMContentLoaded", () => {
    validarSesion();
    renderizarTabla(); // C - READ (Consulta)
});

// 1. CREATE / UPDATE (Inserción y Actualización)
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("vehiculoId").value;
    const marcaModelo = document.getElementById("marcaModelo").value;
    const placa = document.getElementById("placa").value.toUpperCase();
    const tipo = document.getElementById("tipoVehiculo").value;

    if (id) {
        // ACTUALIZACIÓN (Update)
        const index = vehiculos.findIndex(v => v.id === id);
        if (index !== -1) {
            vehiculos[index] = { id, marcaModelo, placa, tipo };
            alert("Vehículo actualizado correctamente.");
        }
    } else {
        // INSERCIÓN (Create)
        const nuevoVehiculo = {
            id: Date.now().toString(), // Generar ID único
            marcaModelo,
            placa,
            tipo
        };
        vehiculos.push(nuevoVehiculo);
        alert("Vehículo registrado exitosamente.");
    }

    guardarEnBD();
    limpiarFormulario();
    renderizarTabla();
});

// 2. READ (Consulta)
function renderizarTabla() {
    tabla.innerHTML = "";
    
    if(vehiculos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">No tienes vehículos registrados.</td></tr>`;
        return;
    }

    vehiculos.forEach(v => {
        let icono = v.tipo === "Moto" ? "two_wheeler" : "directions_car";
        
        const tr = document.createElement("tr");
        tr.className = "border-b hover:bg-gray-50";
        tr.innerHTML = `
            <td class="p-3"><span class="material-symbols-outlined text-gray-500">${icono}</span></td>
            <td class="p-3 font-semibold text-gray-800">${v.marcaModelo}</td>
            <td class="p-3 text-gray-500">${v.placa}</td>
            <td class="p-3 text-right">
                <button onclick="cargarParaEditar('${v.id}')" class="text-blue-500 hover:text-blue-700 mx-1" title="Editar">
                    <span class="material-symbols-outlined text-sm">edit</span>
                </button>
                <button onclick="eliminarVehiculo('${v.id}')" class="text-red-500 hover:text-red-700 mx-1" title="Eliminar">
                    <span class="material-symbols-outlined text-sm">delete</span>
                </button>
            </td>
        `;
        tabla.appendChild(tr);
    });
}

// 3. UPDATE (Preparar para actualizar)
window.cargarParaEditar = function(id) {
    const vehiculo = vehiculos.find(v => v.id === id);
    if (vehiculo) {
        document.getElementById("vehiculoId").value = vehiculo.id;
        document.getElementById("marcaModelo").value = vehiculo.marcaModelo;
        document.getElementById("placa").value = vehiculo.placa;
        document.getElementById("tipoVehiculo").value = vehiculo.tipo;
    }
};

// 4. DELETE (Eliminación)
window.eliminarVehiculo = function(id) {
    if (confirm("¿Estás seguro de eliminar este vehículo?")) {
        vehiculos = vehiculos.filter(v => v.id !== id);
        guardarEnBD();
        renderizarTabla();
    }
};

// Utilidades del módulo
function guardarEnBD() {
    localStorage.setItem("flashwash_vehiculos", JSON.stringify(vehiculos));
}

function limpiarFormulario() {
    form.reset();
    document.getElementById("vehiculoId").value = "";
}

btnLimpiar.addEventListener("click", limpiarFormulario);

function validarSesion() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) window.location.href = "index.html";
    
    document.getElementById("btnLogout").addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.href = "index.html";
    });
}