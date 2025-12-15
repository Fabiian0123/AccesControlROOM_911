<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>ROOM_911 – Importar empleados desde CSV</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/DashboardAdmin.css') }}">
</head>
<body>
    <div class="dashboard-container">
        <header class="dashboard-header">
            <h1 class="title">Importar empleados (CSV)</h1>
        </header>
        @if (session('import_result'))
            @php $result = session('import_result'); @endphp
            <div style="margin-bottom: 1rem; padding: 0.75rem; border-radius: 8px; background:#ecfdf5; color:#166534;">
                <strong>Importación completada:</strong><br>
                Creados: {{ $result['created'] }}<br>
                Saltados (duplicados o inválidos): {{ $result['skipped'] }}
            </div>
        @endif

        @if ($errors->any())
            <div style="margin-bottom: 1rem; padding: 0.75rem; border-radius: 8px; background:#fef2f2; color:#b91c1c;">
                <strong>Errores:</strong>
                <ul style="margin:0; padding-left: 1.2rem;">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST"
              action="{{ route('admin.employees.import.handle') }}"
              enctype="multipart/form-data"
              style="max-width: 480px;">
            @csrf

            <div style="margin-bottom: 1rem;">
                <label for="department_id" style="display:block; margin-bottom:0.25rem;">
                    Departamento al que se asignarán los empleados:
                </label>
                <select id="department_id"
                        name="department_id"
                        required
                        style="width:100%; padding:0.5rem; border-radius:8px; border:1px solid #d1d5db;">
                    <option value="">Seleccione un departamento</option>
                    @foreach($departments as $dep)
                        <option value="{{ $dep->id }}">{{ $dep->name }}</option>
                    @endforeach
                </select>
            </div>

            <div style="margin-bottom: 1rem;">
                <label for="csv_file" style="display:block; margin-bottom:0.25rem;">
                    Archivo CSV de empleados
                </label>
                <input type="file"
                       id="csv_file"
                       name="csv_file"
                       accept=".csv,text/csv"
                       required
                       style="width:100%;"/>
                <small style="display:block; margin-top:0.25rem; font-size:0.8rem; color:#6b7280;">
                    Formato esperado (con encabezado):<br>
                    <code>employed_id,firstname_id,last_name</code>
                </small>
            </div>

            <button type="submit" class="btn btn-sm">
                Importar empleados
            </button>
        </form>
    </div>
</body>
</html>
