// Variables para el control de tiempo del efecto de burbujas en el cursor
let lastTime = 0;

// Evento que genera burbujas decorativas al mover el mouse
document.addEventListener("mousemove", (e) => {

    const now = Date.now();
    if (now - lastTime < 15) return;
    lastTime = now;

    // Generar más de una burbuja por cada movimiento para mayor volumen
    for (let i = 0; i < 2; i++) {
        const bubble = document.createElement("span");

        // Añadir una pequeña variación aleatoria a la posición para que no salgan en línea recta
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        bubble.style.left = (e.clientX + offsetX) + "px";
        bubble.style.top = (e.clientY + offsetY) + "px";

    const size = Math.random() * 20 + 10;
    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    bubble.style.position = "fixed";
    bubble.style.borderRadius = "50%";
    bubble.style.pointerEvents = "none";

    bubble.style.background = "radial-gradient(circle at 30% 30%, #ffffff, rgba(0,150,255,1))";
    bubble.style.boxShadow = "0 0 12px rgba(0,150,255,0.9)";
    // Se elimina el mixBlendMode para que los colores sean totalmente opacos
    bubble.style.filter = "blur(0.5px)";

    document.body.appendChild(bubble);

    // Animación con Web Animations API para desaparecer rápidamente
    bubble.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-60px) scale(0)', opacity: 0 }
    ], {
        duration: 700, // 700ms para desaparecer rápidamente (antes 4000ms)
        easing: 'ease-out',
        fill: 'forwards'
    });

        setTimeout(() => bubble.remove(), 700);
    }
});

// Referencia al formulario de inicio de sesión
const form = document.getElementById("loginForm");

// Lógica de validación al enviar el formulario de login (si existe en la página)
if (form) {
    form.addEventListener("submit", function(e){

        e.preventDefault();

        const correo = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        if(correo === "admin@mail.com" && password === "0000"){

            localStorage.setItem("usuario", "Administrador");

            window.location.href = "dashboard.html";

        }else{

            const mensaje = document.getElementById("mensaje");
            if (mensaje) {
                mensaje.innerText = "Correo o contraseña incorrectos";
            }

        }

    });
}

