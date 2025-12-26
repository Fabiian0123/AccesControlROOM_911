<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Menú de administración</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/DashboardAdmin.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <div class="dashboard-container">
        <header class="dashboard-header">
            <h1 class="title">Administrative menu</h1>
        </header>
        <div>
            @include('administrative.components.moduleAdmin.components.BtnCloseSession')
        </div>
        <div>
            @include('administrative.components.moduleAdmin.components.Timer')
        </div>
        <div>
            @include('administrative.components.moduleAdmin.components.NameUser')
        </div>
        <div >
            @include('administrative.components.moduleAdmin.components.AddEmployeButton')
        </div>
        
        <div style="margin-top: -2.5rem;">
            @include('administrative.components.moduleAdmin.components.TableEmploye', ['employees' => $employees])
        </div>
        <div>
            @include('administrative.components.moduleAdmin.components.BtnImportEmployees')
        </div>
        <div class="general-history">
            @include('administrative.components.moduleAdmin.components.GlobalHistoryButton')
        </div>
        <div>
            @include('administrative.components.moduleAdmin.components.FilterIdEmploye')
        </div>
        <div>
            @include('administrative.components.moduleAdmin.components.FilterDepartmentEmploye')
        </div>
        <div>
            @include('administrative.components.moduleAdmin.components.FilterAccessDateEmploye')
        </div>
        <div>
            @include('administrative.components.moduleAdmin.components.BtnClearFilter')
        </div>
        
    </div>
    <script src="{{ asset('js/AddEmployed.js') }}"></script>
    <script src="{{ asset('js/EmployeesTable.js') }}"></script>
    <script src="{{ asset('js/EditEmployed.js') }}"></script>
    <script src="{{ asset('js/ToggleEmployeeActive.js') }}"></script>
    <script src="{{ asset('js/DeleteEmployee.js') }}"></script>
    <script src="{{ asset('js/HistoryEmployee.js') }}"></script>
    <script src="{{ asset('js/GlobalHistory.js') }}"></script> 
    <script src="{{ asset('js/ImportEmployees.js') }}"></script>
</body>
</html>


