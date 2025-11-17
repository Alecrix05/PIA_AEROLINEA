function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    const navItems = document.querySelectorAll('.list-group-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink && activeLink.classList.contains('list-group-item')) {
        activeLink.classList.add('active');
    }

    if (sectionId === 'dashboard') {
        loadDashboardData();
    } else if (sectionId === 'clientes') {
        loadClientes();
    } else if (sectionId === 'pasajeros') {
        loadPasajeros();
    } else if (sectionId === 'reservas') {
        loadReservas();
    } else if (sectionId === 'boletos') {
        loadBoletos();
    } else if (sectionId === 'vuelos') {
        loadVuelos();
    } else if (sectionId === 'instancias') {
        loadInstancias();
    } else if (sectionId === 'ventas') {
        loadVentas();
    }
}

async function loadDashboardData() {
    try {
        const clientes = await fetchAPI(ENDPOINTS.clientes);
        const reservas = await fetchAPI(ENDPOINTS.reservas);
        const boletos = await fetchAPI(ENDPOINTS.boletos);
        const instanciasVuelo = await fetchAPI(ENDPOINTS.instanciasVuelo);

        document.getElementById('totalClientes').textContent = clientes.length;
        document.getElementById('totalReservas').textContent = reservas.length;
        document.getElementById('totalBoletos').textContent = boletos.length;
        document.getElementById('totalVuelos').textContent = instanciasVuelo.length;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
    loadClientes();
});
