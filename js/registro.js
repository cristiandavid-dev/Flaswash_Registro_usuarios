document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.getElementById("registroForm");
    const mensaje = document.getElementById("mensaje");

    if (registroForm) {
        registroForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Capturar datos del formulario
            const nombre = document.getElementById("nombre").value.trim();
            const usuario = document.getElementById("usuario").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            const password = document.getElementById("password").value;

            // Validacion de campos
            if (!nombre || !usuario || !correo || !telefono || !password) {
                if (mensaje) {
                    mensaje.className = "text-red-500 text-center mt-3 text-sm font-medium animate-in";
                    mensaje.innerText = "Por favor, completa todos los campos requeridos.";
                }
                return;
            }

            try {
                // Peticion POST al Backend de Node.js (MySQL / phpMyAdmin)
                const response = await fetch("http://localhost:3000/api/usuarios", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre: nombre,
                        usuario: usuario,
                        email: correo,
                        telefono: telefono,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar sesion en el navegador
                    localStorage.setItem("usuario", nombre);

                    // Mostrar mensaje de éxito
                    if (mensaje) {
                        mensaje.className = "text-green-600 text-center mt-3 text-sm font-bold animate-in";
                        mensaje.innerText = "¡Registro exitoso! Redirigiendo al panel...";
                    }

                    // Redirección al Dashboard
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1500);

                } else {
                    if (mensaje) {
                        mensaje.className = "text-red-500 text-center mt-3 text-sm font-medium animate-in";
                        mensaje.innerText = data.mensaje || "El correo electrónico o usuario ya se encuentra registrado.";
                    }
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                if (mensaje) {
                    mensaje.className = "text-red-500 text-center mt-3 text-sm font-medium animate-in";
                    mensaje.innerText = "No se pudo conectar con el servidor. Revisa que el backend esté ejecutándose.";
                }
            }
        });
    }
});
