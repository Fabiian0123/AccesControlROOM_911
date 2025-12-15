document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('employees-tbody');
    if (!tbody) return;

    tbody.addEventListener('click', async (event) => {
        const btn = event.target.closest('.btn-delete');
        if (!btn) return;

        const row = btn.closest('tr');
        if (!row) return;

        const employeeId = row.children[0].textContent.trim(); 

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Eliminar empleado',
            text: `¿Está seguro de eliminar el empleado ${employeeId}?`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            return;
        }

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');

        try {
            const response = await fetch(`/admin/employees/${employeeId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el empleado');
            }

            const data = await response.json();

            await Swal.fire({
                icon: 'success',
                title: 'Empleado eliminado',
                text: `El empleado ${data.deleted_id} fue eliminado correctamente.`,
            });

        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el empleado.',
            });
        }
    });
});
