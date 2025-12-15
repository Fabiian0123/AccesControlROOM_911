document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('employees-tbody');
    if (!tbody) return;

    tbody.addEventListener('click', async (event) => {
        const btn = event.target.closest('.btn-history');
        if (!btn) return;

        const row = btn.closest('tr');
        if (!row) return;

        const employeeId = row.children[0].textContent.trim();
        const firstName  = row.children[1].textContent.trim();
        const lastName   = row.children[2].textContent.trim();
        const employeeName = `${firstName} ${lastName}`.trim();

        try {
            const response = await fetch(`/admin/employees/${employeeId}/history`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar historial');
            }

            const logs = await response.json();

            if (!logs.length) {
                await Swal.fire({
                    icon: 'info',
                    title: 'Historial vacío',
                    text: 'Este empleado no tiene registros de acceso.',
                });
                return;
            }

            const html = `
                <div style="
                    text-align:left;
                    max-height:300px;
                    overflow:auto;
                    font-family:monospace;
                    font-size:0.8rem;
                ">
                    ${logs.map(log => {
                        const statusText =
                            log.status === 'logout'
                                ? 'SALIDA'
                                : (log.was_successful
                                    ? 'ACCESO CORRECTO'
                                    : 'ACCESO INCORRECTO');

                        const extra = log.status ? ` (${log.status})` : '';

                        return `[${log.attempted_at}] - ${statusText}${extra}`;
                    }).join('<br>')}
                </div>
            `;

            const result = await Swal.fire({
                icon: 'info',
                title: `Historial de ${employeeName} (ID ${employeeId})`,
                html,
                width: 600,
                showCancelButton: true,
                confirmButtonText: 'Download PDF',
                cancelButtonText: 'Cerrar',
            });

            if (result.isConfirmed) {
                window.open(`/admin/employees/${employeeId}/history/pdf`, '_blank');
            }

        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar el historial de accesos.',
            });
        }
    });
});



