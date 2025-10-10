document.querySelectorAll('.card').forEach(card => {
  // Add base hover classes
  card.classList.add(
    'relative',
    'overflow-hidden',
    'rounded-xl',
    'shadow-lg',
    'transform',
    'transition-all',
    'duration-300',
    'hover:scale-105',
    'hover:shadow-2xl',
    'cursor-pointer'
  );

  // Create sliding info panel (top)
  const infoPanel = document.createElement('div');
  infoPanel.className = `
    absolute top-0 left-0 w-full text-white p-3
    transform -translate-y-full transition-transform duration-300
    pointer-events-none
  `;

  // Fill panel with dynamic info
  const title = card.dataset.title || "Exhibition";
  const type = card.dataset.type || "Info";
  const start = card.dataset.start || "";
  const end = card.dataset.end || "";

  infoPanel.innerHTML = `
    <p class="text-xs uppercase font-semibold">${type}</p>
    <h3 class="text-sm font-bold">${title}</h3>
    <p class="text-xs">${start}${end ? ' — ' + end : ''}</p>
  `;

  card.appendChild(infoPanel);

  // Hover in/out effect
  card.addEventListener('mouseenter', () => {
    infoPanel.classList.remove('-translate-y-full');
    infoPanel.classList.add('translate-y-0');
  });

  card.addEventListener('mouseleave', () => {
    infoPanel.classList.remove('translate-y-0');
    infoPanel.classList.add('-translate-y-full');
  });
});
