@php
    $loginTimestamp = session('admin_login_time');
@endphp

@if ($loginTimestamp)
    <div id="session-timer" data-start="{{ $loginTimestamp }}">
        <strong>Session time:</strong>
        <span id="session-timer-display">00:00:00</span>
    </div>

    <script>
        (function () {
            const container = document.getElementById('session-timer');
            if (!container) return;

            const display = document.getElementById('session-timer-display');
            const startSeconds = parseInt(container.dataset.start, 10);
            if (!startSeconds || isNaN(startSeconds)) return;

            const startMs = startSeconds * 1000;

            function formatTime(totalSeconds) {
                const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
                const seconds = String(totalSeconds % 60).padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            }

            function updateTimer() {
                const nowMs = Date.now();
                const diffSeconds = Math.max(0, Math.floor((nowMs - startMs) / 1000));
                display.textContent = formatTime(diffSeconds);
            }

            updateTimer();
            setInterval(updateTimer, 1000);
        })();
    </script>
@endif

