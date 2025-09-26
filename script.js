// Your code here.
// Click and Drag functionality for cubes
class DragDropManager {
  constructor() {
    this.isDragging = false;
    this.currentElement = null;
    this.offset = { x: 0, y: 0 };
    this.container = document.querySelector('.items');
    this.items = document.querySelectorAll('.item');
    
    this.init();
  }
  
  init() {
    // Set up the container and items for absolute positioning
    this.setupContainer();
    this.attachEventListeners();
  }
  
  setupContainer() {
    // Make container relative and items absolute positioned
    this.container.style.position = 'relative';
    
    // Convert items to absolute positioning while maintaining their original positions
    this.items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      
      // Calculate position relative to container
      const left = rect.left - containerRect.left + this.container.scrollLeft;
      const top = rect.top - containerRect.top + this.container.scrollTop;
      
      // Set absolute positioning
      item.style.position = 'absolute';
      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
      item.style.margin = '0';
      item.style.display = 'flex'; // Override inline-flex for absolute positioning
      item.style.cursor = 'grab';
      item.style.zIndex = '1';
      item.style.transition = 'none'; // Remove transitions during drag
    });
  }
  
  attachEventListeners() {
    // Add mouse event listeners to each item
    this.items.forEach(item => {
      item.addEventListener('mousedown', this.handleMouseDown.bind(this));
    });
    
    // Add global mouse events
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // Prevent default drag behavior on images and other elements
    document.addEventListener('dragstart', (e) => e.preventDefault());
  }
  
  handleMouseDown(e) {
    e.preventDefault();
    
    this.isDragging = true;
    this.currentElement = e.target;
    
    // Calculate offset from mouse to element's top-left corner
    const rect = this.currentElement.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    
    this.offset.x = e.clientX - rect.left;
    this.offset.y = e.clientY - rect.top;
    
    // Visual feedback
    this.currentElement.style.cursor = 'grabbing';
    this.currentElement.style.zIndex = '1000';
    this.currentElement.style.transform += ' scale(1.05)';
    this.currentElement.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
    
    // Add active class to container
    this.container.classList.add('active');
  }
  
  handleMouseMove(e) {
    if (!this.isDragging || !this.currentElement) return;
    
    e.preventDefault();
    
    // Calculate new position
    const containerRect = this.container.getBoundingClientRect();
    const elementWidth = this.currentElement.offsetWidth;
    const elementHeight = this.currentElement.offsetHeight;
    
    // Calculate position relative to container
    let newX = e.clientX - containerRect.left - this.offset.x + this.container.scrollLeft;
    let newY = e.clientY - containerRect.top - this.offset.y + this.container.scrollTop;
    
    // Apply boundary constraints
    const containerPadding = 100; // Account for container padding
    const minX = containerPadding;
    const minY = containerPadding;
    const maxX = this.container.scrollWidth - elementWidth - containerPadding;
    const maxY = this.container.offsetHeight - elementHeight - containerPadding;
    
    // Constrain to boundaries
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    // Update element position
    this.currentElement.style.left = `${newX}px`;
    this.currentElement.style.top = `${newY}px`;
  }
  
  handleMouseUp(e) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    if (this.currentElement) {
      // Reset visual feedback
      this.currentElement.style.cursor = 'grab';
      this.currentElement.style.zIndex = '1';
      this.currentElement.style.transform = this.currentElement.style.transform.replace(' scale(1.05)', '');
      this.currentElement.style.boxShadow = 'inset 0 0 0 10px rgba(0,0,0,0.15)';
      
      this.currentElement = null;
    }
    
    // Remove active class from container
    this.container.classList.remove('active');
    
    this.offset = { x: 0, y: 0 };
  }
  
  // Method to reset all items to original grid positions
  resetPositions() {
    this.items.forEach((item, index) => {
      const col = index % 5; // Assuming 5 columns
      const row = Math.floor(index / 5);
      
      item.style.left = `${100 + (col * 220)}px`; // 100px padding + 200px width + 20px gap
      item.style.top = `${100 + (row * 140)}px`;  // 100px padding + spacing
    });
  }
}

// Initialize the drag and drop functionality when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const dragDropManager = new DragDropManager();
  
  // Optional: Add a reset button for testing
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset Positions';
  resetButton.style.position = 'fixed';
  resetButton.style.top = '20px';
  resetButton.style.right = '20px';
  resetButton.style.padding = '10px 20px';
  resetButton.style.backgroundColor = 'rgba(255,255,255,0.9)';
  resetButton.style.border = 'none';
  resetButton.style.borderRadius = '5px';
  resetButton.style.cursor = 'pointer';
  resetButton.style.zIndex = '9999';
  
  resetButton.addEventListener('click', () => {
    dragDropManager.resetPositions();
  });
  
  document.body.appendChild(resetButton);
});

// Touch support for mobile devices
class TouchDragSupport {
  constructor(dragManager) {
    this.dragManager = dragManager;
    this.addTouchListeners();
  }
  
  addTouchListeners() {
    this.dragManager.items.forEach(item => {
      item.addEventListener('touchstart', this.handleTouchStart.bind(this));
    });
    
    document.addEventListener('touchmove', this.handleTouchMove.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  handleTouchStart(e) {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    e.target.dispatchEvent(mouseEvent);
    e.preventDefault();
  }
  
  handleTouchMove(e) {
    if (this.dragManager.isDragging) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      document.dispatchEvent(mouseEvent);
      e.preventDefault();
    }
  }
  
  handleTouchEnd(e) {
    const mouseEvent = new MouseEvent('mouseup', {});
    document.dispatchEvent(mouseEvent);
    e.preventDefault();
  }
}