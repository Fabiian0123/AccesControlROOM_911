document.addEventListener('DOMContentLoaded', () => {
    const btnAddEmployee = document.getElementById('btn-add-employee');

    if (!btnAddEmployee) return;

    btnAddEmployee.addEventListener('click', async () => {
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
                text: 'No se pudieron cargar los departamentos. Intenta nuevamente.',
            });
            return;
        }

        let departmentOptions = '<option value="">Selecciona un departamento</option>';
        departments.forEach(dep => {
            departmentOptions += `<option value="${dep.id}">${dep.name}</option>`;
        });

        const { value: formValues } = await Swal.fire({
            html: `
                <div class="tituloPop">
                    <h2>Agregar Empleado</h2>
                </div>
                <div class="idEmpleado">
                    <label for="swal-employed-id">ID empleado</label>
                    <input id="swal-employed-id" class="inForm" type="number">
                </div>
                <div class="name">
                    <label for="swal-first-name">Primer nombre</label>
                    <input id="swal-first-name" class="inForm">
                </div>
                <div class="lastname">
                    <label for="swal-last-name">Primer apellido</label>
                    <input id="swal-last-name" class="inForm">
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
            confirmButtonText: 'Guardar',
            confirmButtonColor: 'Green',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const employedId = document.getElementById('swal-employed-id').value.trim();
                const firstName  = document.getElementById('swal-first-name').value.trim();
                const lastName   = document.getElementById('swal-last-name').value.trim();
                const department = document.getElementById('swal-department').value;

                if (!employedId || !firstName || !lastName || !department) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }

                return {
                    employed_id: employedId,
                    first_name: firstName,
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
            const response = await fetch('/admin/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el empleado');
            }

            const result = await response.json();

            await Swal.fire({
                icon: 'success',
                title: 'Empleado guardado',
            });


        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar el empleado.',
            });
        }
    });
});

