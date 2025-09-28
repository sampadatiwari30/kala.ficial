const cards = document.querySelectorAll('.exhibition-item, .artwork-item, .artist-item, .flex.flex-col.items-center');

cards.forEach(card => {
  const maxRotation = 8; // Max degrees of tilt. Adjust as you like.

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const { width, height } = rect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation based on mouse position from center
    const rotateY = maxRotation * ((x - width / 2) / (width / 2));
    const rotateX = -maxRotation * ((y - height / 2) / (height / 2));

    card.style.setProperty('--rotateX', `${rotateX}deg`);
    card.style.setProperty('--rotateY', `${rotateY}deg`);
  });

  // Reset rotation when mouse leaves
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--rotateX', '0deg');
    card.style.setProperty('--rotateY', '0deg');
  });
});