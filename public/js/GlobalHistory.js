document.addEventListener('DOMContentLoaded', () => {
    const btnGlobalHistory = document.getElementById('btn-global-history');
    if (!btnGlobalHistory) return;

    btnGlobalHistory.addEventListener('click', async () => {
        try {
            const response = await fetch('/admin/access-history/unauthorized', {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar historial general');
            }

            const logs = await response.json();

            if (!logs.length) {
                await Swal.fire({
                    icon: 'info',
                    title: 'Historial vacío',
                    text: 'No hay intentos de acceso no autorizados registrados.',
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
                        return `[${log.attempted_at}] - INTENTO DE ACCESO NO AUTORIZADO (ID: ${log.attempted_id})`;
                    }).join('<br>')}
                </div>
            `;

            await Swal.fire({
                icon: 'warning',
                title: 'Historial general de intentos no autorizados',
                html,
                width: 650,
            });

        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar el historial general.',
            });
        }
    });
});
