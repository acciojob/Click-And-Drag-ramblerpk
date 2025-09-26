// Simple horizontal scroll drag implementation for Cypress compatibility
const items = document.querySelector('.items');
let isDown = false;
let startX;
let scrollLeft;

// Ensure the container exists
if (items) {
  // Mouse down event
  items.addEventListener('mousedown', (e) => {
    isDown = true;
    items.classList.add('active');
    startX = e.pageX - items.offsetLeft;
    scrollLeft = items.scrollLeft;
  });

  // Mouse leave event
  items.addEventListener('mouseleave', () => {
    isDown = false;
    items.classList.remove('active');
  });

  // Mouse up event
  items.addEventListener('mouseup', () => {
    isDown = false;
    items.classList.remove('active');
  });

  // Mouse move event - this is where the scrolling happens
  items.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    
    const x = e.pageX - items.offsetLeft;
    const walk = x - startX; // Distance moved
    const newScrollLeft = scrollLeft - walk; // Reverse for natural scrolling
    
    // Ensure scroll position is never negative
    items.scrollLeft = Math.max(0, newScrollLeft);
    
    console.log('Mouse moved:', walk, 'New scroll:', items.scrollLeft);
  });

  // Prevent default drag behavior
  items.addEventListener('dragstart', (e) => e.preventDefault());
}

// For debugging - log scroll position changes
if (items) {
  items.addEventListener('scroll', () => {
    console.log('Scroll position:', items.scrollLeft);
  });
}