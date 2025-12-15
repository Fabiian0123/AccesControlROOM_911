<div class="btnCloseSession">
    <form method="POST" action="{{ route('admin.logout') }}">
        @csrf
        <button type="submit" class="btn">Cerrar sesión</button>
    </form>
</div>
