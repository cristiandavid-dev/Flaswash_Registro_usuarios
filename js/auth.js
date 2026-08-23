
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Proteger la ruta: Si ya hay sesión, saltar directo al dashboard
    if (localStorage.getItem("usuario") && window.location.pathname.includes("index.html")) {
        window.location.href = "dashboard.html";
    }

    const loginForm = document.getElementById("loginForm");
    const mensajeError = document.getElementById("mensaje");

    // 2. Lógica de Inicio de Sesión (Crear sesión)
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Capturar datos del formulario [cite: 345, 346]
            const correo = document.getElementById("correo").value;
            const password = document.getElementById("password").value;

            // Verificar usuarios estáticos o usuarios registrados en localStorage
            const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
            const usuarioEncontrado = usuariosRegistrados.find(u => u.correo === correo && u.password === password);

            if ((correo === "cristian.reyes@aunar.edu.co" && password === "0000") || (correo === "admin@mail.com" && password === "0000")) {
                if(mensajeError) mensajeError.innerText = "";
                const nombreUsuario = correo === "admin@mail.com" ? "Administrador" : "Cristian Reyes";
                localStorage.setItem("usuario", nombreUsuario);
                window.location.href = "dashboard.html";
            } else if (usuarioEncontrado) {
                if(mensajeError) mensajeError.innerText = "";
                localStorage.setItem("usuario", usuarioEncontrado.nombre);
                window.location.href = "dashboard.html";
            } else {
                // Mostrar retroalimentación de error
                if(mensajeError) {
                    mensajeError.innerText = "Por favor, ingresa un correo y contraseña válidos.";
                } else {
                    alert("Por favor, ingresa un correo y contraseña válidos.");
                }
            }
        });
    }
});

// Lógica de Cierre de Sesión (Eliminar sesión)
// Se declara en el objeto window para que pueda ser llamada desde los botones "onclick" del HTML
window.cerrarSesion = function () {
    // Eliminar el registro del usuario
    localStorage.removeItem("usuario");
    
    // Devolver a la pantalla de autenticación
    window.location.href = "index.html";
};