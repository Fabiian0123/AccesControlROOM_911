<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>ROOM_911 - Employee Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/LoginAdmin.css') }}">
</head>
<body>
    <div class="card">
        <h1>ROOM_911 – Employee Dashboard</h1>

        {{-- Botón pequeño para salir --}}
        <nav style="text-align: right; margin-bottom: 0.5rem;">
            <form method="POST" action="{{ route('employee.logout') }}">
                @csrf
                <button
                    type="submit"
                    style="
                        width: auto;
                        padding: .3rem .7rem;
                        border-radius: 6px;
                        font-size: 0.8rem;
                        background: #ef4444;
                        color: #fff;
                    "
                >
                    Salir
                </button>
            </form>
        </nav>

        @if($employee)
            <p style="margin-top: -10%;">
                Bienvenido,
                <strong>{{ $employee->firstname_id }} {{ $employee->last_name }}</strong><br>
                <small>ID: {{ $employee->employed_id }}</small>
            </p>
        @else
            <p>No se encontró información del empleado en sesión.</p>
        @endif
    </div>
</body>
</html>

