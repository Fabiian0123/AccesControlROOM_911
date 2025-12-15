document.addEventListener('DOMContentLoaded', () => {
    const btnImport = document.getElementById('btn-import-employees');
    if (!btnImport) return;

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content') || '';

    btnImport.addEventListener('click', async () => {
        let departments = [];
        try {
            const response = await fetch('/admin/departments', {
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Error al cargar departamentos');
            }

            departments = await response.json();
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los departamentos. Intenta nuevamente.',
            });
            return;
        }

        let departmentOptions = '<option value="">Seleccione un departamento</option>';
        departments.forEach(dep => {
            departmentOptions += `<option value="${dep.id}">${dep.name}</option>`;
        });

        let formDataToSend = null;

        const { isConfirmed } = await Swal.fire({
            title: 'Importar empleados (CSV)',
            html: `
                <div style="text-align:left;">
                    <div style="margin-bottom:0.75rem;">
                        <label for="swal-dept" style="display:block; margin-bottom:0.25rem;">
                            Departamento:
                        </label>
                        <select id="swal-dept" class="inForm" style="width:80%;">
                            ${departmentOptions}
                        </select>
                    </div>

                    <div style="margin-bottom:0.75rem;">
                        <input type="file"
                            id="swal-csv"
                            accept=".csv,text/csv"
                        <small style="display:block; margin-top:0.25rem; font-size:0.75rem; color:#6b7280;">
                        </small>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Importar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const select = document.getElementById('swal-dept');
                const fileInput = document.getElementById('swal-csv');

                const departmentId = select.value;
                const file = fileInput.files[0];

                if (!departmentId || !file) {
                    Swal.showValidationMessage(
                        'Debes seleccionar un departamento y un archivo CSV.'
                    );
                    return false;
                }

                const fd = new FormData();
                fd.append('department_id', departmentId);
                fd.append('csv_file', file);
                fd.append('_token', csrfToken);

                formDataToSend = fd;
                return true;
            }
        });

        if (!isConfirmed || !formDataToSend) {
            return;
        }
        try {
            const response = await fetch('/admin/employees/import', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Respuesta no OK al importar CSV:', text);
                throw new Error('Error en el servidor al importar.');
            }

            let payload = {};
            try {
                payload = await response.json();
            } catch (e) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Importación completada',
                    text: 'La importación ha finalizado. Actualiza la tabla para ver los cambios.',
                });
                return;
            }

            await Swal.fire({
                icon: 'success',
                title: 'Importación completada',
                html: `
                    <p>Creados: <strong>${payload.created ?? 'N/A'}</strong></p>
                    <p>Saltados: <strong>${payload.skipped ?? 'N/A'}</strong></p>
                `,
            });
            if (typeof window.refreshEmployees === 'function') {
                window.refreshEmployees();
            } else {
                window.location.reload();
            }

        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo completar la importación.',
            });
        }
    });
});
