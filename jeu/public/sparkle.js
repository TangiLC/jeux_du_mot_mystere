// sparkle.js - Module pour les effets de confettis

class Sparkle {
  constructor(id, options = {}) {
    this.id = id;
    this.diameter = options.diameter || this.randomBetween(8, 20);
    this.color = options.color || this.randomColor();
    this.speed = options.speed || this.randomBetween(1.2, 4);
    this.drift = options.drift || this.randomBetween(-0.6, 0.6);
    this.x = options.x || this.randomBetween(0, window.innerWidth - this.diameter);
    this.y = options.y || -this.randomBetween(0, window.innerHeight);
    
    this.element = this.createElement();
  }

  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  randomColor() {
    const hue = Math.floor(this.randomBetween(0, 360));
    return `hsl(${hue} 80% 60%)`;
  }

  createElement() {
    const el = document.createElement('div');
    el.id = `sparkle${this.id}`;
    el.className = 'sparkle';
    el.style.width = `${this.diameter}px`;
    el.style.height = `${this.diameter}px`;
    el.style.backgroundColor = this.color;
    el.style.position = 'fixed';
    el.style.borderRadius = '50%';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.left = `${this.x}px`;
    el.style.top = `${this.y}px`;
    return el;
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  animate() {
    this.y += this.speed;
    this.x += Math.sin(this.y / 18) * this.drift;
    
    if (this.y > window.innerHeight + 20) {
      this.reset();
    }
    
    this.updatePosition();
  }

  reset() {
    this.y = -this.randomBetween(40, 200);
    this.x = this.randomBetween(0, window.innerWidth - this.diameter);
    this.speed = this.randomBetween(1.2, 4);
  }

  addToDOM() {
    document.body.appendChild(this.element);
  }

  removeFromDOM() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

class SparkleManager {
  constructor(count = 50) {
    this.sparkles = [];
    this.animationId = null;
    this.isAnimating = false;
    this.createSparkles(count);
  }

  createSparkles(count) {
    this.cleanup();
    
    for (let i = 1; i <= count; i++) {
      const sparkle = new Sparkle(i);
      sparkle.addToDOM();
      this.sparkles.push(sparkle);
    }
  }

  start() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    const animate = () => {
      if (!this.isAnimating) return;
      
      for (const sparkle of this.sparkles) {
        sparkle.animate();
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  stop() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  cleanup() {
    this.stop();
    for (const sparkle of this.sparkles) {
      sparkle.removeFromDOM();
    }
    this.sparkles = [];
  }
}

// Fonction de compatibilité avec l'ancien code
function confettis(count = 50) {
  const manager = new SparkleManager(count);
  manager.start();
  
  return function cleanup() {
    manager.cleanup();
  };
}

// Export pour utilisation en module ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Sparkle, SparkleManager, confettis };
}

// Export pour utilisation globale dans le navigateur
if (typeof window !== 'undefined') {
  window.Sparkle = Sparkle;
  window.SparkleManager = SparkleManager;
  window.confettis = confettis;
}