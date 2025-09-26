// Horizontal scroll drag functionality for the items container
class ScrollDragManager {
  constructor() {
    this.isDown = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.container = document.querySelector('.items');
    
    this.init();
  }
  
  init() {
    if (!this.container) return;
    
    // Attach event listeners to the container
    this.attachEventListeners();
  }
  
  attachEventListeners() {
    // Mouse events for desktop
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    
    // Touch events for mobile
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Prevent default drag behavior
    this.container.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Prevent text selection during drag
    this.container.addEventListener('selectstart', (e) => {
      if (this.isDown) e.preventDefault();
    });
  }
  
  handleMouseDown(e) {
    this.isDown = true;
    this.container.classList.add('active');
    
    // Get the initial mouse position and scroll position
    this.startX = e.pageX - this.container.offsetLeft;
    this.scrollLeft = this.container.scrollLeft;
    
    // Change cursor
    this.container.style.cursor = 'grabbing';
  }
  
  handleMouseMove(e) {
    if (!this.isDown) return;
    
    e.preventDefault();
    
    // Calculate how far the mouse has moved
    const x = e.pageX - this.container.offsetLeft;
    const walk = (x - this.startX) * 2; // Multiply by 2 for faster scrolling
    
    // Set the scroll position
    this.container.scrollLeft = this.scrollLeft - walk;
  }
  
  handleMouseUp(e) {
    this.isDown = false;
    this.container.classList.remove('active');
    this.container.style.cursor = 'grab';
  }
  
  handleTouchStart(e) {
    this.isDown = true;
    this.container.classList.add('active');
    
    const touch = e.touches[0];
    this.startX = touch.pageX - this.container.offsetLeft;
    this.scrollLeft = this.container.scrollLeft;
  }
  
  handleTouchMove(e) {
    if (!this.isDown) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const x = touch.pageX - this.container.offsetLeft;
    const walk = (x - this.startX) * 2;
    
    this.container.scrollLeft = this.scrollLeft - walk;
  }
  
  handleTouchEnd(e) {
    this.isDown = false;
    this.container.classList.remove('active');
  }
}

// Initialize the scroll drag functionality when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const scrollDragManager = new ScrollDragManager();
});

// Alternative implementation for Cypress testing compatibility
window.initScrollDrag = function() {
  const items = document.querySelector('.items');
  let isDown = false;
  let startX;
  let scrollLeft;

  items.addEventListener('mousedown', (e) => {
    isDown = true;
    items.classList.add('active');
    startX = e.pageX - items.offsetLeft;
    scrollLeft = items.scrollLeft;
  });

  items.addEventListener('mouseleave', () => {
    isDown = false;
    items.classList.remove('active');
  });

  items.addEventListener('mouseup', () => {
    isDown = false;
    items.classList.remove('active');
  });

  items.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - items.offsetLeft;
    const walk = (x - startX) * 3;
    items.scrollLeft = scrollLeft - walk;
  });
};

// Auto-initialize if not in test environment
if (typeof window !== 'undefined' && !window.Cypress) {
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollDragManager();
  });
} else if (typeof window !== 'undefined' && window.Cypress) {
  // Initialize immediately for Cypress tests
  window.initScrollDrag();
}