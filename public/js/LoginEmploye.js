document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('employee-login-form');
    if (!form) return;

    const inputId = document.getElementById('employee-id');
    const btn = document.getElementById('btn-employee-login');
    const msgBox = document.getElementById('employee-login-message');

    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (msgBox) {
            msgBox.textContent = '';
            msgBox.className = 'login-message';
        }

        const employeeId = inputId.value.trim();
        if (!employeeId) {
            if (msgBox) {
                msgBox.textContent = 'Debe ingresar su Employee ID.';
                msgBox.classList.add('error');
            }
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Verificando...';

        try {
            const response = await fetch('/user/login/attempt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ employee_id: employeeId }),
            });

            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                data = {};
            }

            if (response.ok) {
                if (data.ok) {
                    if (msgBox) {
                        msgBox.textContent = 'Acceso concedido. Redirigiendo...';
                        msgBox.classList.add('success');
                    }
                    window.location.href = '/user/dashboard';
                } else {
                    if (msgBox) {
                        msgBox.textContent = data.message || 'Acceso denegado.';
                        msgBox.classList.add('error');
                    }
                }
            } else {
                let message = data.message;

                if (!message) {
                    if (response.status === 404) {
                        message = 'ID de empleado no registrado.';
                    } else if (response.status === 403) {
                        message = 'Usuario inhabilitado.';
                    } else {
                        message = 'No se pudo validar el acceso.';
                    }
                }

                if (msgBox) {
                    msgBox.textContent = message;
                    msgBox.classList.add('error');
                }
            }
        } catch (err) {
            console.error(err);
            if (msgBox) {
                msgBox.textContent = 'Ocurrió un error al validar el acceso.';
                msgBox.classList.add('error');
            }
        } finally {
            btn.disabled = false;
            btn.textContent = 'Access ROOM_911';
        }
    });
});

