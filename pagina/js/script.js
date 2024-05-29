document.addEventListener('DOMContentLoaded', function() {
    const currentDateElement = document.getElementById('current-date');
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('es-ES', options);
    currentDateElement.textContent = `Hoy es ${formattedDate}`;
});


window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});