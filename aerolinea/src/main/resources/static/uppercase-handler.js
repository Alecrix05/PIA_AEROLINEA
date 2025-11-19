// Manejador global para convertir automáticamente a mayúsculas
(function() {
    'use strict';
    
    function initializeUppercaseInputs() {
        // Seleccionar todos los inputs de texto excepto los excluidos
        const inputs = document.querySelectorAll(`
            input[type="text"]:not([data-no-uppercase]):not([type="url"]):not([type="password"]),
            input[type="email"]:not([data-no-uppercase]),
            textarea:not([data-no-uppercase])
        `);
        
        inputs.forEach(input => {
            // Evitar agregar múltiples listeners
            if (input.hasAttribute('data-uppercase-initialized')) {
                return;
            }
            
            input.setAttribute('data-uppercase-initialized', 'true');
            
            input.addEventListener('input', function(e) {
                const cursorPosition = e.target.selectionStart;
                const value = e.target.value.toUpperCase();
                e.target.value = value;
                e.target.setSelectionRange(cursorPosition, cursorPosition);
            });
            
            // También convertir el valor inicial si existe
            if (input.value) {
                input.value = input.value.toUpperCase();
            }
        });
    }
    
    // Inicializar cuando se carga la página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUppercaseInputs);
    } else {
        initializeUppercaseInputs();
    }
    
    // Observar cambios en el DOM para inputs dinámicos
    const observer = new MutationObserver(function(mutations) {
        let shouldReinitialize = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || 
                            node.querySelector && node.querySelector('input, textarea')) {
                            shouldReinitialize = true;
                        }
                    }
                });
            }
        });
        
        if (shouldReinitialize) {
            setTimeout(initializeUppercaseInputs, 100);
        }
    });
    
    // Observar cambios en el DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('Uppercase handler initialized');
})();