const { createClient } = supabase;

const supabaseClient = createClient(
    window.APP_CONFIG.supabaseUrl,
    window.APP_CONFIG.supabaseAnonKey
);

const form             = document.getElementById('admin-login-form');
const btn              = document.getElementById('btn-login');
const msgBox           = document.getElementById('message');
const btnRegisterAdmin = document.getElementById('btn-register-admin');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgBox.textContent = '';
        msgBox.className = '';

        const rawInput = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!rawInput || !password) {
            msgBox.textContent = 'Usuario y contraseña son obligatorios.';
            msgBox.className = 'error';
            return;
        }

        const username = rawInput;
        const supabaseEmail = rawInput.includes('@')
            ? rawInput
            : `${rawInput}@room911.com`;

        btn.disabled = true;
        btn.textContent = 'Ingresando...';

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: supabaseEmail,
                password,
            });

            if (error) {
                console.error(error);
                msgBox.textContent = error.message || 'Error al iniciar sesión';
                msgBox.className = 'error';
            } else {
                msgBox.textContent = 'Login exitoso, redirigiendo...';
                msgBox.className = 'success';

                await fetch('/admin/session/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute('content'),
                    },
                    body: JSON.stringify({ username }),
                });

                window.location.href = window.APP_CONFIG.adminDashboardUrl;
            }
        } catch (err) {
            console.error(err);
            msgBox.textContent = 'Ocurrió un error inesperado.';
            msgBox.className = 'error';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Ingresar';
        }
    });
}

if (btnRegisterAdmin) {
    btnRegisterAdmin.addEventListener('click', async () => {
        msgBox.textContent = '';
        msgBox.className = '';

        const username = prompt('Ingresa el USUARIO administrador (ej: admin_room_911):');
        if (!username) {
            return; 
        }

        const password = prompt('Ingresa la CONTRASEÑA del administrador:');
        if (!password) {
            return;
        }

        const supabaseEmail = username.includes('@')
            ? username
            : `${username}@room911.com`;

        try {
            msgBox.textContent = 'Creando administrador en Supabase...';
            msgBox.className = '';

            const { data, error } = await supabaseClient.auth.signUp({
                email: supabaseEmail,
                password,
                options: {
                    data: {
                        username: username,
                        role: 'admin_room_911',
                    },
                },
            });

            if (error) {
                console.error(error);
                msgBox.textContent = error.message || 'Error al registrar administrador.';
                msgBox.className = 'error';
            } else {
                console.log('Nuevo admin:', data);
                msgBox.textContent = `Administrador "${username}" registrado correctamente.`;
                msgBox.className = 'success';
                alert(`Administrador registrado correctamente:\nUsuario: ${username}`);
            }
        } catch (err) {
            console.error(err);
            msgBox.textContent = 'Ocurrió un error al registrar el administrador.';
            msgBox.className = 'error';
        }
    });
}




