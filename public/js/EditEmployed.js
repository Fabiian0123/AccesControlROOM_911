document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('employees-tbody');
    if (!tbody) return;

    tbody.addEventListener('click', async (event) => {
        const btn = event.target.closest('.btn-edit');
        if (!btn) return;

        const row = btn.closest('tr');
        if (!row) return;

        const employeeId   = row.children[0].textContent.trim(); 
        const firstname    = row.children[1].textContent.trim(); 
        const lastname     = row.children[2].textContent.trim(); 
        const deptNameCell = row.children[3].textContent.trim(); 

        let departments = [];
        try {
            const response = await fetch('/admin/departments');
            if (!response.ok) {
                throw new Error('Error al cargar departamentos');
            }
            departments = await response.json();
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los departamentos para edición.',
            });
            return;
        }

        let departmentOptions = '<option value="">Selecciona un departamento</option>';
        let currentDeptId = '';

        departments.forEach(dep => {
            if (dep.name === deptNameCell) {
                currentDeptId = dep.id;
            }
            departmentOptions += `<option value="${dep.id}">${dep.name}</option>`;
        });

        const { value: formValues } = await Swal.fire({
            html: `
                <div class="tituloPop">
                    <h2>Editar Empleado</h2>
                </div>
                <div class="idEmpleado">
                    <label for="swal-employed-id">ID empleado</label>
                    <input id="swal-employed-id" class="inForm" type="number" value="${employeeId}" disabled>
                </div>
                <div class="name">
                    <label for="swal-first-name">Primer nombre</label>
                    <input id="swal-first-name" class="inForm" value="${firstname}">
                </div>
                <div class="lastname">
                    <label for="swal-last-name">Primer apellido</label>
                    <input id="swal-last-name" class="inForm" value="${lastname}">
                </div>
                <div class="departmen">
                    <label for="swal-department">Departamento</label>
                    <select id="swal-department" class="inForm">
                        ${departmentOptions}
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            confirmButtonColor: 'Green',
            cancelButtonText: 'Cancelar',
            didOpen: () => {
                if (currentDeptId) {
                    const select = document.getElementById('swal-department');
                    if (select) select.value = String(currentDeptId);
                }
            },
            preConfirm: () => {
                const firstName  = document.getElementById('swal-first-name').value.trim();
                const lastName   = document.getElementById('swal-last-name').value.trim();
                const department = document.getElementById('swal-department').value;

                if (!firstName || !lastName || !department) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }

                return {
                    firstname_id: firstName,
                    last_name: lastName,
                    department_id: department,
                };
            }
        });

        if (!formValues) {
            return; 
        }

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');

        try {
            const response = await fetch(`/admin/employees/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el empleado');
            }

            const result = await response.json();
            
            await Swal.fire({
                icon: 'success',
                title: 'Empleado actualizado',
                text: `Se actualizaron los datos de ${result.employee.firstname_id} ${result.employee.last_name}.`,
            });
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el empleado.',
            });
        }
    });
});
