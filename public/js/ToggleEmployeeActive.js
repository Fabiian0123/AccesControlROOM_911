document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('employees-tbody');
    if (!tbody) return;

    tbody.addEventListener('click', async (event) => {
        const btn = event.target.closest('.btn-disable');
        if (!btn) return;

        const row = btn.closest('tr');
        if (!row) return;

        const employeeId = row.children[0].textContent.trim();
        const currentStatus = btn.getAttribute('data-active');
        const isActive = currentStatus === '1';

        const actionText = isActive ? 'deshabilitar' : 'activar';
        const actionTitle = isActive ? 'Deshabilitar empleado' : 'Activar empleado';
        const confirmButtonText = isActive ? 'Sí, deshabilitar' : 'Sí, activar';
        const result = await Swal.fire({
            icon: 'warning',
            title: actionTitle,
            text: `¿Está seguro de ${actionText} este empleado (ID: ${employeeId})?`,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            return;
        }

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');

        try {
            const response = await fetch(`/admin/employees/${employeeId}/toggle-active`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el estado del empleado');
            }

            const data = await response.json();

            await Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: data.is_active
                    ? 'El empleado ha sido activado nuevamente.'
                    : 'El empleado ha sido deshabilitado.',
            });

        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estado del empleado.',
            });
        }
    });
});
