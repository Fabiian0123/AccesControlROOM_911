document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('employees-tbody');
    const filterInputId = document.getElementById('filter-employee-id');
    const filterSelectDept = document.getElementById('filter-department');

    // ✅ IDs correctos según tu HTML
    const filterInitialDate = document.getElementById('filter-start-date');
    const filterFinalDate = document.getElementById('filter-end-date');

    const btnClearFilters = document.getElementById('btn-clear-filters');

    if (!tbody) return;

    let allEmployees = [];
    let isRefreshing = false;
    let currentFilterId = '';
    let currentFilterDept = '';
    let currentInitialDate = '';
    let currentFinalDate = '';

    function renderTable() {
        tbody.innerHTML = '';

        let employeesToShow = allEmployees;

        if (currentFilterId) {
            const term = currentFilterId.toLowerCase();

            employeesToShow = employeesToShow.filter(emp => {
                const idText    = String(emp.employed_id ?? '').toLowerCase();
                const firstText = String(emp.firstname_id ?? '').toLowerCase();
                const lastText  = String(emp.last_name ?? '').toLowerCase();

                return (
                    idText.includes(term) ||
                    firstText.includes(term) ||
                    lastText.includes(term)
                );
            });
        }

        if (currentFilterDept) {
            employeesToShow = employeesToShow.filter(emp =>
                String(emp.department_id) === currentFilterDept
            );
        }

        if (!employeesToShow.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">
                        No hay empleados registrados.
                    </td>
                </tr>
            `;
            return;
        }

        employeesToShow.forEach(emp => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${emp.employed_id}</td>
                <td>${emp.firstname_id ?? ''}</td>
                <td>${emp.last_name ?? ''}</td>
                <td>${emp.department?.name ?? emp.department_id ?? ''}</td>
                <td>${emp.total_acces ?? 0}</td>
                <td>
                    <div class="actions-group">
                        <button type="button" class="btn btn-sm btn-edit">
                            Edit
                        </button>
                        <button type="button" class="btn btn-sm btn-disable">
                            ${emp.is_active ? 'Disable' : 'Activate'}
                        </button>
                        <button type="button" class="btn btn-sm btn-history">
                            History
                        </button>
                        <button type="button" class="btn btn-sm btn-delete">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }

    async function refreshEmployees() {
        if (isRefreshing) return;
        isRefreshing = true;

        try {
            let url = '/admin/employees/list';

            const params = [];
            if (currentInitialDate) {
                params.push(`from=${encodeURIComponent(currentInitialDate)}`);
            }
            if (currentFinalDate) {
                params.push(`to=${encodeURIComponent(currentFinalDate)}`);
            }

            if (params.length > 0) {
                url = `${url}?${params.join('&')}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Error al cargar empleados');
            }

            allEmployees = await response.json();
            renderTable();
        } catch (err) {
            console.error(err);
        } finally {
            isRefreshing = false;
        }
    }

    async function loadDepartmentsIntoFilter() {
        if (!filterSelectDept) return;

        try {
            const response = await fetch('/admin/departments');
            if (!response.ok) {
                throw new Error('Error al cargar departamentos');
            }

            const departments = await response.json();

            filterSelectDept.innerHTML = '<option value="">All departments</option>';

            departments.forEach(dep => {
                const opt = document.createElement('option');
                opt.value = String(dep.id);
                opt.textContent = dep.name;
                filterSelectDept.appendChild(opt);
            });

        } catch (err) {
            console.error('Error cargando departamentos para filtro:', err);
        }
    }

    if (filterInputId) {
        filterInputId.addEventListener('input', () => {
            currentFilterId = filterInputId.value.trim();
            renderTable();
        });
    }

    if (filterSelectDept) {
        filterSelectDept.addEventListener('change', () => {
            currentFilterDept = filterSelectDept.value;
            renderTable();
        });
    }

    if (filterInitialDate) {
        filterInitialDate.addEventListener('change', () => {
            currentInitialDate = filterInitialDate.value;
            refreshEmployees();
        });
    }

    if (filterFinalDate) {
        filterFinalDate.addEventListener('change', () => {
            currentFinalDate = filterFinalDate.value;
            refreshEmployees();
        });
    }

    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
            currentFilterId = '';
            currentFilterDept = '';
            currentInitialDate = '';
            currentFinalDate = '';

            if (filterInputId) filterInputId.value = '';
            if (filterSelectDept) filterSelectDept.value = '';
            if (filterInitialDate) filterInitialDate.value = '';
            if (filterFinalDate) filterFinalDate.value = '';

            refreshEmployees();
        });
    }

    loadDepartmentsIntoFilter();
    refreshEmployees();

    const INTERVAL_MS = 2000;
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            refreshEmployees();
        }
    }, INTERVAL_MS);
});


