let slideIndex = 1;
let slideInterval;
let touchStartX = 0;
let touchEndX = 0;
let imageColors = []; // Array to store dominant colors from images

// Initialize the slideshow when the page loads
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    showSlides(slideIndex);
    startAutoSlide();
    createConfetti();
    addGlitchEffect();
    initTypewriter();
    initTouchEvents();
    initKeyboardEvents();
    addBirthdayCake();
    addStarryBackground();
    initTypewriterEffect();
    addQuoteAnimation();
    applySlideShapes();
    analyzeImageColors();
});

// Preload images for smoother transitions
function preloadImages() {
    const slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        const img = slides[i].querySelector('img');
        if (img) {
            const newImg = new Image();
            newImg.src = img.src;
            newImg.onload = function() {
                // Once image is loaded, apply high-quality rendering
                img.style.imageRendering = 'high-quality';
                img.classList.add('loaded');
            };
        }
    }
}

// Analyze image colors to create matching effects
function analyzeImageColors() {
    const slides = document.getElementsByClassName("slide");
    
    for (let i = 0; i < slides.length; i++) {
        const img = slides[i].querySelector('img');
        if (img) {
            // Create a canvas to analyze the image
            setTimeout(() => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 50; // Small size for analysis
                    canvas.height = 50;
                    
                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0, 50, 50);
                    
                    // Get image data
                    const imageData = ctx.getImageData(0, 0, 50, 50).data;
                    
                    // Calculate average color
                    let r = 0, g = 0, b = 0;
                    let pixelCount = 0;
                    
                    for (let j = 0; j < imageData.length; j += 4) {
                        r += imageData[j];
                        g += imageData[j + 1];
                        b += imageData[j + 2];
                        pixelCount++;
                    }
                    
                    // Calculate average
                    r = Math.floor(r / pixelCount);
                    g = Math.floor(g / pixelCount);
                    b = Math.floor(b / pixelCount);
                    
                    // Store the color
                    imageColors[i] = `rgb(${r}, ${g}, ${b})`;
                    
                    // Apply color to slide border
                    slides[i].style.borderColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
                    
                    // Adjust caption color based on image
                    const caption = slides[i].querySelector('.caption');
                    if (caption) {
                        caption.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
                        caption.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
                    }
                } catch (e) {
                    console.log('Error analyzing image:', e);
                }
            }, 500 * i); // Stagger analysis to prevent performance issues
        }
    }
}

// Next/previous controls
function plusSlides(n) {
    clearInterval(slideInterval);
    showSlides(slideIndex += n);
    startAutoSlide();
}

// Thumbnail image controls
function currentSlide(n) {
    clearInterval(slideInterval);
    showSlides(slideIndex = n);
    startAutoSlide();
}

// Start automatic slideshow
function startAutoSlide() {
    slideInterval = setInterval(function() {
        showSlides(slideIndex += 1);
    }, 5000); // Change slide every 5 seconds
}

// Show the current slide
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    // Reset slideIndex if it's out of bounds
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    
    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    
    // Remove active class from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show the current slide and activate the corresponding dot
    slides[slideIndex-1].style.display = "flex";  
    dots[slideIndex-1].className += " active";
    
    // Apply color theme based on current slide
    applyColorTheme(slideIndex-1);
    
    // Update mirror effect for current slide
    updateMirrorEffect(slideIndex-1);
    
    // Add glitch effect to current slide
    addGlitchToCurrentSlide(slideIndex-1);
    
    // Update shape effects for current slide
    updateShapeEffects(slideIndex-1);
    
    // Call the image handler's updateImageForSlide function if it exists
    if (typeof updateImageForSlide === 'function') {
        updateImageForSlide(slideIndex-1);
    }
    
    // Check if the slide has the original-resolution class
    const isOriginalResolution = slides[slideIndex-1].classList.contains('original-resolution');
    
    // Get the toggle button
    const toggleButton = document.querySelector('.resolution-toggle');
    
    // Update button text based on current state
    if (toggleButton) {
        toggleButton.textContent = isOriginalResolution ? 'Use Styled View' : 'Show Original Resolution';
    }
}

// Apply color theme based on current image
function applyColorTheme(index) {
    if (imageColors[index]) {
        // Extract RGB values
        const colorMatch = imageColors[index].match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (colorMatch) {
            const r = parseInt(colorMatch[1]);
            const g = parseInt(colorMatch[2]);
            const b = parseInt(colorMatch[3]);
            
            // Calculate brightness
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            
            // Apply glow effect based on image color
            const slides = document.getElementsByClassName("slide");
            const currentSlide = slides[index];
            
            // Create a glow effect that matches the image
            currentSlide.style.boxShadow = `0 0 30px rgba(${r}, ${g}, ${b}, 0.8)`;
            
            // Adjust navigation buttons to match image color
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            
            if (prevBtn && nextBtn) {
                prevBtn.style.color = `rgb(${r}, ${g}, ${b})`;
                nextBtn.style.color = `rgb(${r}, ${g}, ${b})`;
                prevBtn.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
                nextBtn.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
            }
            
            // Adjust active dot color
            const dots = document.getElementsByClassName("dot");
            const activeDot = document.querySelector('.dot.active');
            if (activeDot) {
                activeDot.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                activeDot.style.boxShadow = `0 0 10px rgb(${r}, ${g}, ${b})`;
            }
        }
    }
}

// Function to update mirror effect for the current slide
function updateMirrorEffect(slideIndex) {
    const slides = document.getElementsByClassName("slide");
    const currentSlide = slides[slideIndex];
    
    // Add a subtle animation to the mirror effect
    currentSlide.classList.add('mirror-animate');
    
    // Add a subtle glow effect to the current slide
    if (!imageColors[slideIndex]) {
        currentSlide.style.boxShadow = "0 0 30px rgba(255, 105, 180, 0.8)";
    }
    
    setTimeout(function() {
        currentSlide.classList.remove('mirror-animate');
        if (!imageColors[slideIndex]) {
            currentSlide.style.boxShadow = "";
        }
    }, 1000);
}

// Add confetti effect
function createConfetti() {
    const confettiCount = 200;
    const container = document.querySelector('body');
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        confetti.style.backgroundColor = getRandomColor();
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 6000);
    }
}

function getRandomColor() {
    const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#f0f', '#c71585'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add glitch effect to elements
function addGlitchEffect() {
    const slides = document.querySelectorAll('.slide');
    const currentSlide = slides[slideIndex-1];
    
    // Add a circular glitch effect
    currentSlide.style.transform = "scale(1.05) rotate(3deg)";
    setTimeout(function() {
        currentSlide.style.transform = "scale(0.95) rotate(-3deg)";
        setTimeout(function() {
            currentSlide.style.transform = "";
        }, 150);
    }, 150);
}

// Add glitch to current slide
function addGlitchToCurrentSlide(index) {
    const slides = document.getElementsByClassName("slide");
    const currentSlide = slides[index];
    
    // Add a circular glitch effect with color shift
    const img = currentSlide.querySelector('img');
    if (img) {
        // Use image-specific color for the glitch if available
        if (imageColors[index]) {
            const colorMatch = imageColors[index].match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (colorMatch) {
                const r = parseInt(colorMatch[1]);
                const g = parseInt(colorMatch[2]);
                const b = parseInt(colorMatch[3]);
                
                // Calculate complementary color for interesting effect
                const compR = 255 - r;
                const compG = 255 - g;
                const compB = 255 - b;
                
                // Apply a subtle color shift based on image colors
                img.style.filter = `hue-rotate(${(r % 30) - 15}deg) brightness(1.2)`;
                setTimeout(function() {
                    img.style.filter = `hue-rotate(${(compR % 30) - 15}deg) brightness(0.9)`;
                    setTimeout(function() {
                        // Reset to shape-specific filter
                        img.style.filter = "";
                    }, 150);
                }, 150);
                return;
            }
        }
        
        // Default glitch if no color data
        img.style.filter = "hue-rotate(30deg) brightness(1.2)";
        setTimeout(function() {
            img.style.filter = "hue-rotate(-30deg) brightness(0.9)";
            setTimeout(function() {
                img.style.filter = "";
            }, 150);
        }, 150);
    }
}

// Initialize typewriter effect
function initTypewriter() {
    const typewriterText = document.querySelector('.typewriter');
    if (typewriterText) {
        typewriterText.style.width = '0';
        setTimeout(() => {
            typewriterText.style.width = '100%';
        }, 1000);
    }
}

// Initialize touch events for swipe functionality
function initTouchEvents() {
    const slideshow = document.querySelector('.slideshow');
    
    slideshow.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    slideshow.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
}

// Handle swipe gesture
function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left
        plusSlides(1);
    } else if (touchEndX > touchStartX + 50) {
        // Swipe right
        plusSlides(-1);
    }
}

// Initialize keyboard events for arrow key navigation
function initKeyboardEvents() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            plusSlides(-1);
        } else if (e.key === 'ArrowRight') {
            plusSlides(1);
        }
    });
}

// Modal functionality
function showSpecialMessage() {
    const modal = document.getElementById('special-message');
    modal.style.display = 'block';
    
    // Add confetti effect
    createConfetti();
}

function closeModal() {
    const modal = document.getElementById('special-message');
    modal.style.display = 'none';
}

// Close modal if clicked outside of content
window.onclick = function(event) {
    const modal = document.getElementById('special-message');
    if (event.target == modal) {
        closeModal();
    }
}

// Add scanner effect
document.addEventListener('DOMContentLoaded', function() {
    const scanner = document.createElement('div');
    scanner.className = 'scanner-line';
    document.body.appendChild(scanner);
    
    setInterval(function() {
        scanner.style.top = '-100%';
        scanner.style.opacity = '0.8';
        
        setTimeout(function() {
            scanner.style.transition = 'all 3s linear';
            scanner.style.top = '100%';
        }, 100);
        
        setTimeout(function() {
            scanner.style.transition = 'none';
            scanner.style.opacity = '0';
        }, 3100);
    }, 8000);
});

// Add birthday cake icon
function addBirthdayCake() {
    const title = document.querySelector('.title');
    const cakeIcon = document.createElement('span');
    cakeIcon.className = 'cake-icon float';
    cakeIcon.innerHTML = '<i class="fas fa-birthday-cake"></i>';
    title.appendChild(cakeIcon);
    
    // Add floating animation
    setInterval(function() {
        cakeIcon.classList.add('float');
        setTimeout(function() {
            cakeIcon.classList.remove('float');
        }, 2000);
    }, 4000);
}

function addStarryBackground() {
    const stars = document.querySelector('.stars');
    const starsCount = 100;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDelay = Math.random() * 5 + 's';
        stars.appendChild(star);
    }
}

function initTypewriterEffect() {
    const typewriter = document.querySelector('.typewriter');
    typewriter.style.opacity = '0';
    
    // Delay the typewriter effect for better visibility
    setTimeout(() => {
        typewriter.style.opacity = '1';
    }, 1000);
}

function addQuoteAnimation() {
    const quote = document.querySelector('.quote');
    
    // Add intersection observer to animate quote when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    if (quote) {
        quote.style.opacity = '0';
        quote.style.transform = 'translateY(20px)';
        quote.style.transition = 'opacity 1s ease, transform 1s ease';
        observer.observe(quote);
    }
}

// Apply different shapes to each slide
function applySlideShapes() {
    const slides = document.getElementsByClassName("slide");
    const shapes = [
        'circle',        // Default circle
        'hexagon',       // Hexagon shape
        'heart',         // Heart shape
        'diamond',       // Diamond shape
        'pentagon',      // Pentagon shape
        'star'           // Star shape
    ];
    
    // Apply shape classes to slides
    for (let i = 0; i < slides.length; i++) {
        const shapeIndex = i % shapes.length;
        slides[i].classList.add(`shape-${shapes[shapeIndex]}`);
        
        // Add shape-specific styling to the image
        const img = slides[i].querySelector('img');
        if (img) {
            img.classList.add(`shape-${shapes[shapeIndex]}`);
            
            // Add loading effect
            img.classList.add('loading');
            
            // Add event listener to ensure image is properly loaded
            img.addEventListener('load', function() {
                // Remove loading class and add loaded class
                img.classList.remove('loading');
                img.classList.add('loaded');
                
                // Store original dimensions as data attributes if not already set
                if (!img.dataset.originalWidth) {
                    img.dataset.originalWidth = img.naturalWidth;
                    img.dataset.originalHeight = img.naturalHeight;
                }
            });
            
            // If image is already loaded, remove loading class
            if (img.complete) {
                setTimeout(() => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                    
                    // Store original dimensions as data attributes if not already set
                    if (!img.dataset.originalWidth) {
                        img.dataset.originalWidth = img.naturalWidth;
                        img.dataset.originalHeight = img.naturalHeight;
                    }
                }, 500);
            }
        }
    }
}

// Function to update shape-specific effects
function updateShapeEffects(index) {
    const slides = document.getElementsByClassName("slide");
    const currentSlide = slides[index];
    
    // Ensure the current slide is visible
    if (currentSlide) {
        currentSlide.style.opacity = '1';
    }
}

// Add CSS for confetti
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            z-index: 1000;
            animation: fall 6s linear forwards;
            pointer-events: none;
        }
        
        @keyframes fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: white;
            border-radius: 50%;
            animation: twinkle 5s infinite;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
        
        .glitch {
            animation: glitchEffect 0.2s linear;
        }
        
        @keyframes glitchEffect {
            0% { transform: translate(0); }
            20% { transform: translate(-5px, 5px); }
            40% { transform: translate(-5px, -5px); }
            60% { transform: translate(5px, 5px); }
            80% { transform: translate(5px, -5px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(style);
});