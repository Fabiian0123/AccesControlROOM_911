<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>ROOM_911 - Historial de accesos</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111827;
        }
        h1, h2, h3 {
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
        }
        .employee-info {
            margin-bottom: 10px;
        }
        .employee-info p {
            margin: 2px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        th, td {
            border: 1px solid #d1d5db;
            padding: 4px 6px;
            font-size: 11px;
        }
        th {
            background: #f3f4f6;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>ROOM_911</h1>
        <h2>Historial de accesos</h2>
    </div>

    <div class="employee-info">
        <p><strong>Empleado:</strong>
            {{ $employee->firstname_id }} {{ $employee->last_name }}
            (ID: {{ $employee->employed_id }})
        </p>
        <p><strong>Departamento:</strong>
            {{ optional($employee->department)->name ?? $employee->department_id }}
        </p>
        <p><strong>Total accesos registrados:</strong> {{ $employee->total_acces }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Fecha y hora</th>
                <th>Resultado</th>
                <th>Detalle</th>
            </tr>
        </thead>
        <tbody>
            @forelse($logs as $index => $log)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>
                        {{ $log->attempted_at
                            ? $log->attempted_at->format('Y-m-d H:i:s')
                            : 'N/A' }}
                    </td>
                    <td>
                        @if($log->status === 'logout')
                            SALIDA
                        @elseif($log->was_successful)
                            ACCESO CORRECTO
                        @else
                            ACCESO INCORRECTO
                        @endif
                    </td>
                    <td>
                        {{ $log->status ?? '' }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align: center;">
                        No hay registros de acceso para este empleado.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
