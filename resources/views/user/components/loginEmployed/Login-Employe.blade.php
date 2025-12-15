<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>ROOM_911 - Employee Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/LoginEmploye.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <div class="card">
        <h1>Access ROOM_911</h1>
        @include('user.components.loginEmployed.components.FormLoginEmploye')
    </div>
    <script src="{{ asset('js/LoginEmploye.js') }}"></script>
</body>
</html>

