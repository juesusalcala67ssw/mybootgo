
    (function() {
        // 1. Bloquear clic derecho
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // 2. Bloquear selección de texto y arrastre
        document.addEventListener('selectstart', function(e) { e.preventDefault(); });
        document.addEventListener('dragstart', function(e) { e.preventDefault(); });
        document.addEventListener('copy', function(e) { e.preventDefault(); });
        document.addEventListener('cut', function(e) { e.preventDefault(); });
        document.addEventListener('paste', function(e) { e.preventDefault(); });

        // 3. Teclas para abrir herramientas de desarrollador
        const keys = {
            'F12': true,
            'Control+Shift+I': true,
            'Control+Shift+J': true,
            'Control+Shift+C': true,
            'Control+Shift+K': true, // Firefox
            'Control+U': true,
            'Control+S': true,
            'Control+E': true,      // Firefox
            'Control+Shift+E': true, // Firefox
            'Control+Shift+U': true, // Firefox
            'Control+Shift+P': true, // Firefox
            'Command+Option+I': true, // Mac
            'Command+Option+J': true, // Mac
            'Command+Option+C': true, // Mac
            'Command+U': true,        // Mac
            'Command+Shift+C': true   // Mac
        };

        document.addEventListener('keydown', function(e) {
            let key = '';
            if (e.ctrlKey) key += 'Control+';
            if (e.shiftKey) key += 'Shift+';
            if (e.altKey) key += 'Alt+';
            if (e.metaKey) key += 'Command+';
            key += e.key === ' ' ? 'Space' : e.key;
            
            // Normalizar nombres de teclas para F12, etc.
            if (e.key === 'F12') key = 'F12';
            if (e.key === 'U' && e.ctrlKey && !e.shiftKey) key = 'Control+U';
            if (e.key === 'S' && e.ctrlKey) key = 'Control+S';
            if (e.key === 'E' && e.ctrlKey) key = 'Control+E';
            if (e.key === 'I' && e.ctrlKey && e.shiftKey) key = 'Control+Shift+I';
            if (e.key === 'J' && e.ctrlKey && e.shiftKey) key = 'Control+Shift+J';
            if (e.key === 'C' && e.ctrlKey && e.shiftKey) key = 'Control+Shift+C';
            if (e.key === 'K' && e.ctrlKey && e.shiftKey) key = 'Control+Shift+K';
            if (e.key === 'U' && e.ctrlKey && e.shiftKey) key = 'Control+Shift+U';

            if (keys[key]) {
                e.preventDefault();
                return false;
            }
        });

        // 4. Detectar herramientas de desarrollador abiertas (timing / dimensiones)
        let devtoolsOpen = false;
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                devtoolsOpen = true;
                throw new Error('DevTools detectado');
            }
        });
        setInterval(function() {
            devtoolsOpen = false;
            console.log(element); // fuerza el getter si consola abierta
            if (devtoolsOpen) {
                // Acción cuando se abren las herramientas
                document.body.innerHTML = '<h1>Acceso denegado</h1><p>Las herramientas de desarrollador están deshabilitadas.</p>';
                setTimeout(() => { window.location.href = 'about:blank'; }, 500);
            }
        }, 1000);

        // 5. Detecta apertura de consola por diferencia de altura (funciona en algunos navegadores)
        function detectDevTools() {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            if (widthThreshold || heightThreshold) {
                document.body.innerHTML = '<h1>Acceso denegado</h1><p>Las herramientas de desarrollador están deshabilitadas.</p>';
                setTimeout(() => { window.location.href = 'about:blank'; }, 500);
            }
        }
        setInterval(detectDevTools, 1500);

        // 6. Prevenir que scripts externos sobreescriban estas protecciones
        if (window.MutationObserver) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.removedNodes.length) {
                        // Reaplicar protecciones si algún script malicioso las elimina
                        document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
                    }
                });
            });
            observer.observe(document.head, { childList: true, subtree: true });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // 7. Evitar que se vea el código fuente por métodos alternativos (view-source:)
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            if (window.location.href.indexOf('view-source:') === 0) {
                window.location.href = window.location.href.replace('view-source:', '');
            }
            // Si intentan poner view-source: manualmente redirigir
            if (document.documentElement.innerHTML.indexOf('view-source') !== -1) {
                window.location.href = window.location.href;
            }
        }

        // 8. Deshabilitar acceso a la consola (sobreescribir métodos comunes)
        if (window.console) {
            const noop = function() {};
            const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count', 'assert', 'profile', 'profileEnd', 'time', 'timeEnd'];
            for (let i = 0; i < methods.length; i++) {
                if (window.console[methods[i]]) {
                    window.console[methods[i]] = noop;
                }
            }
        }

        // 9. Prevenir que se abra el inspector con el botón derecho del ratón (redundante pero seguro)
        window.addEventListener('mousedown', function(e) {
            if (e.button === 2) {
                e.preventDefault();
                return false;
            }
        });

        // 10. Bloquear combinaciones de teclas adicionales (Ctrl+Shift+E, etc.)
        document.onkeydown = function(e) {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'U') || (e.ctrlKey && e.key === 'S') ||
                (e.ctrlKey && e.shiftKey && e.key === 'K') || (e.metaKey && e.shiftKey && e.key === 'C')) {
                e.preventDefault();
                return false;
            }
        };
    })();
