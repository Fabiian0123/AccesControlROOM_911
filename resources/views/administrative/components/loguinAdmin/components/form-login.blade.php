<form id="admin-login-form">
    <div style="margin-bottom: 1rem;">
        <label class="usuario" for="username">Usuario</label>
        <input
            type="text"
            id="username"
            name="username"
            required
        >
    </div>

    <div style="margin-bottom: 1rem;">
        <label class="contraseña" for="password">Contraseña</label>
        <input
            type="password"
            id="password"
            name="password"
            required
        >
    </div>

    <button type="submit" id="btn-login">Ingresar</button>

    <button type="button" id="btn-register-admin" style="margin-top: 0.7rem;">
        Registrar admin
    </button>
    <div id="message" class=""></div>
</form>
