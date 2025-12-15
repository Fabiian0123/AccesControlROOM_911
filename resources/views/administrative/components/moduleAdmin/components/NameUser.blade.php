@php
    $username = session('admin_username');
@endphp

@if ($username)
    <div class="welcome-user">
        Welcome: <span>{{ $username }}</span>
    </div>
@endif
