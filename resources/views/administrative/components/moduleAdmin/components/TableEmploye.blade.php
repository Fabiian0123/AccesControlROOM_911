<table class="employees-table">
    <thead>
        <tr>
            <th>Employee ID</th>
            <th>Firstname_id</th>
            <th>Lastname</th>
            <th>Department</th>
            <th>Total acces</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody id="employees-tbody">
        @forelse ($employees as $employee)
            <tr>
                <td>{{ $employee->employed_id }}</td>
                <td>{{ $employee->firstname_id }}</td>
                <td>{{ $employee->last_name }}</td>
                <td>{{ $employee->department?->name ?? $employee->department_id }}</td>
                <td>{{ $employee->total_acces }}</td>
                <td>
                    <div class="actions-group">
                        <button type="button" class="btn btn-sm btn-edit">
                            Edit
                        </button>
                        <button type="button" class="btn btn-sm btn-disable">
                            Disable
                        </button>
                        <button type="button" class="btn btn-sm btn-history">
                            History
                        </button>
                        <button type="button" class="btn btn-sm btn-delete">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="6" style="text-align: center;">
                    No hay empleados registrados.
                </td>
            </tr>
        @endforelse
        
    </tbody>
</table>
