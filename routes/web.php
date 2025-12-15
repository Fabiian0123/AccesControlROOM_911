<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Employed;
use App\Models\UnauthorizedAccessLog;
use App\Models\AccessLog;
use Barryvdh\DomPDF\Facade\Pdf;


// Ruta al login
Route::get('/admin/login', function () {
    
    if (session()->has('admin_username')) {
        return redirect()->route('admin.dashboard');
    }

    return view('administrative.components.loguinAdmin.Admin-login');
})->name('admin.login');

// Ruta del dashbopard despues de login correcto
Route::get('/admin/dashboard', function () {
    if (!session()->has('admin_username')) {
        return redirect()->route('admin.login');
    }
    $employees = Employed::with('department:id,name')->get();
    return response()
        ->view('administrative.components.moduleAdmin.DashboardAdmin', compact('employees'))
        ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
})->name('admin.dashboard');

// Guardado de la sesion
Route::post('/admin/session/login', function (\Illuminate\Http\Request $request) {
    $username = $request->input('username');

    session([
        'admin_username'   => $username,
        'admin_login_time' => now()->getTimestamp(), 
    ]);

    return response()->json(['ok' => true]);
})->name('admin.session.login');


Route::post('/admin/logout', function (Request $request) {
    // Destruye la sesion
    $request->session()->flush();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->route('admin.login');
})->name('admin.logout');

Route::get('/', function () {
    return redirect()->route('admin.login');
});

//Devuelve los departamentos en json 
Route::get('/admin/departments', function () {
    return Department::select('id', 'name')->orderBy('name')->get();
})->name('admin.departments.index');


//Guardamos lls empleadod
Route::post('/admin/employees', function (Request $request) {
    $data = $request->validate([
        'employed_id'   => 'required|integer',
        'first_name'    => 'required|string|max:100',
        'last_name'     => 'required|string|max:100',
        'department_id' => 'required|integer',
    ]);

    $employee = Employed::create([
        'employed_id'  => $data['employed_id'],
        'firstname_id' => $data['first_name'],
        'last_name'    => $data['last_name'],
        'department_id'   => $data['department_id'],
        'total_acces'  => 0,
    ]);

    return response()->json([
        'ok'       => true,
        'employee' => $employee,
    ]);
})->name('admin.employees.store');


//Ruta del login del empleado
Route::get('/user/login', function () {
    return view('user.components.loginEmployed.Login-Employe');
})->name('employee.login');



//Consulta al employe_id controla accesos correctos, salidas, y empleados inabilitados
Route::post('/user/login/attempt', function (Request $request) {
    $request->validate([
        'employee_id' => 'required|integer',
    ]);

    $employeeId = $request->input('employee_id');
    $employee   = Employed::find($employeeId);

    if (!$employee) {
        UnauthorizedAccessLog::create([
            'attempted_id' => $employeeId,
            'attempted_at' => now(),
        ]);

        return response()->json([
            'ok'      => false,
            'message' => 'ID de empleado no registrado.',
        ], 404);
    }

    if (!$employee->is_active) {
        AccessLog::create([
            'employed_id'    => $employee->employed_id,
            'attempted_at'   => now(),
            'was_successful' => false,
            'status'         => 'user_disabled', 
        ]);

        return response()->json([
            'ok'      => false,
            'message' => 'Usuario inhabilitado.',
        ], 403);
    }

    AccessLog::create([
        'employed_id'    => $employee->employed_id,
        'attempted_at'   => now(),
        'was_successful' => true,
        'status'         => 'login', 
    ]);

    $employee->total_acces = (int) $employee->total_acces + 1;
    $employee->save();

    session(['employee_id' => $employee->employed_id]);

    return response()->json([
        'ok'       => true,
        'employee' => [
            'id'        => $employee->employed_id,
            'firstname' => $employee->firstname_id,
            'lastname'  => $employee->last_name,
        ],
    ]);
})->name('employee.login.attempt');



//Ruta al dashboard del empleado despues de login correcto
Route::get('/user/dashboard', function () {
    if (!session()->has('employee_id')) {
        return redirect()->route('employee.login');
    }
    $employeeId = session('employee_id');
    $employee   = Employed::find($employeeId);
    return response()
        ->view('user.components.dashboardEmploye.DashboardEmploye', compact('employee'))
        ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
})->name('employee.dashboard');



//Ruta cerrar sesion del empleado
Route::post('/user/logout', function (Request $request) {
    $employeeId = $request->session()->get('employee_id');
    if ($employeeId) {
        \App\Models\AccessLog::create([
            'employed_id'    => $employeeId,
            'attempted_at'   => now(),
            'was_successful' => true,
            'status'         => 'logout',
        ]);
    }

    // 👇 Solo cerramos sesión del empleado, no invalidamos todo
    $request->session()->forget('employee_id');

    return redirect()->route('employee.login');
})->name('employee.logout');

//Ruta UX en vivo 
Route::get('/admin/employees/list', function (Request $request) {
    $from = $request->query('from');
    $to   = $request->query('to');
    $query = Employed::with('department:id,name');
    if ($from || $to) {
        $query->whereHas('accessLogs', function ($q) use ($from, $to) {
            if ($from) {
                $q->where('attempted_at', '>=', $from . ' 00:00:00');
            }
            if ($to) {
                $q->where('attempted_at', '<=', $to . ' 23:59:59');
            }
        });
    }
    $employees = $query->get();
    return response()->json($employees);
})->name('admin.employees.list');

//Actualizacion de datos de empleados
Route::put('/admin/employees/{employee}', function (Request $request, Employed $employee) {
    $data = $request->validate([
        'firstname_id'  => 'required|string|max:100',
        'last_name'     => 'required|string|max:100',
        'department_id' => 'required|integer',
    ]);
    $employee->firstname_id  = $data['firstname_id'];
    $employee->last_name     = $data['last_name'];
    $employee->department_id = $data['department_id'];

    $employee->save();
    $employee->load('department:id,name');

    return response()->json([
        'ok'       => true,
        'employee' => $employee,
    ]);
})->name('admin.employees.update');

// switch para el estado del emplado en la bd 0 o 1
Route::patch('/admin/employees/{employee}/toggle-active', function (Request $request, Employed $employee) {
    $employee->is_active = !$employee->is_active;
    $employee->save();

    return response()->json([
        'ok'        => true,
        'is_active' => $employee->is_active,
    ]);
})->name('admin.employees.toggleActive');

//Borrar empleado
Route::delete('/admin/employees/{employee}', function (Employed $employee) {
    $deletedId = $employee->employed_id;
    $employee->delete();
    return response()->json([
        'ok'         => true,
        'deleted_id' => $deletedId,
    ]);
})->name('admin.employees.destroy');

//Historico de cada empleado
Route::get('/admin/employees/{employee}/history', function (Employed $employee) {
    $logs = $employee->accessLogs()
        ->orderByDesc('attempted_at')
        ->limit(50)
        ->get()
        ->map(function ($log) {
            return [
                'attempted_at'   => $log->attempted_at
                    ? $log->attempted_at->format('Y-m-d H:i:s')
                    : null,
                'was_successful' => $log->was_successful,
                'status'         => $log->status,
            ];
        });

    return response()->json($logs);
})->name('admin.employees.history');

//PDF del historico de cada empleado
Route::get('/admin/employees/{employee}/history/pdf', function (Employed $employee) {
    $logs = $employee->accessLogs()
        ->orderByDesc('attempted_at')
        ->get();

    $data = [
        'employee' => $employee,
        'logs'     => $logs,
    ];
    $pdf = Pdf::loadView(
        'administrative.components.moduleAdmin.components.EmployeeHistoryPdf',
        $data
    );
    $fileName = 'ROOM_911_history_employee_' . $employee->employed_id . '.pdf';
    return $pdf->download($fileName);
})->name('admin.employees.history.pdf');


// Ruta para el history general
Route::get('/admin/access-history/unauthorized', function () {
    $logs = UnauthorizedAccessLog::orderByDesc('attempted_at')
        ->limit(100)
        ->get()
        ->map(function ($log) {
            return [
                'attempted_id' => $log->attempted_id,
                'attempted_at' => $log->attempted_at
                    ? $log->attempted_at->format('Y-m-d H:i:s')
                    : null,
            ];
        });
    return response()->json($logs);
})->name('admin.accessHistory.unauthorized');

// importar empleados en csv
Route::post('/admin/employees/import', function (Request $request) {
    if (!session()->has('admin_username')) {
        return response()->json([
            'ok'      => false,
            'message' => 'Sesión de administrador expirada.',
        ], 401);
    }
    $request->validate([
        'department_id' => 'required|exists:departments,id',
        'csv_file'      => 'required|file|mimes:csv,txt',
    ]);
    $departmentId = (int) $request->input('department_id');
    $file = $request->file('csv_file');
    $created = 0;
    $skipped = 0;
    if (($handle = fopen($file->getRealPath(), 'r')) !== false) {
        $header = fgetcsv($handle, 0, ',');

        $header = array_map(function ($h) {
            return strtolower(trim($h));
        }, $header);

        $indexId       = array_search('employed_id', $header);
        $indexName     = array_search('firstname_id', $header);
        $indexLastName = array_search('last_name', $header);

        if ($indexId === false || $indexName === false || $indexLastName === false) {
            fclose($handle);
            return response()->json([
                'ok'      => false,
                'message' => 'El CSV debe contener las columnas: employed_id, firstname_id, last_name.',
            ], 422);
        }

        while (($row = fgetcsv($handle, 0, ',')) !== false) {
            if (count($row) < 3) {
                $skipped++;
                continue;
            }

            $employedId  = trim($row[$indexId] ?? '');
            $firstName   = trim($row[$indexName] ?? '');
            $lastName    = trim($row[$indexLastName] ?? '');

            if ($employedId === '' || $firstName === '' || $lastName === '') {
                $skipped++;
                continue;
            }

            if (Employed::find($employedId)) {
                $skipped++;
                continue;
            }

            Employed::create([
                'employed_id'   => (int) $employedId,
                'firstname_id'  => $firstName,
                'last_name'     => $lastName,
                'department_id' => $departmentId,
                'total_acces'   => 0,
                'is_active'     => true,
            ]);

            $created++;
        }

        fclose($handle);
    }
    return response()->json([
        'ok'      => true,
        'created' => $created,
        'skipped' => $skipped,
    ]);
})->name('admin.employees.import.handle');



