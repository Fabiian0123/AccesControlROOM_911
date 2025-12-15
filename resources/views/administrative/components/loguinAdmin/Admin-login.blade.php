<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="{{ asset('css/LoginAdmin.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <title>ROOM_911 - Admin Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div class="card">
        <h1>ROOM_911 Admin</h1>
        @include('administrative.components.loguinAdmin.components.form-login')
    </div>
    <script>
        window.APP_CONFIG = {
            supabaseUrl: @json(config('services.supabase.url')),
            supabaseAnonKey: @json(config('services.supabase.anon_key')),
            adminDashboardUrl: @json(route('admin.dashboard')),
        };
    </script>
    <script src="{{ asset('js/LoginAdmin.js') }}"></script>
</body>
</html>


