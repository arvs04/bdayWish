document.addEventListener('DOMContentLoaded', function() {
    // 1. Progress Bar Animation
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
            if (progress >= 100) clearInterval(progressInterval);
        }, 50);
    }

    // 2. Floating Hearts Animation
    const contentCard = document.querySelector('.card'); // The element hearts should become transparent over
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        // Random properties
        const size = Math.random() * 20 + 15;
        const duration = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const startOpacity = Math.random() * 0.7 + 0.3;
        
        heart.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            opacity: ${startOpacity};
            color: ${['#ff6b6b', '#ff8787', '#fa5252', '#e64980'][Math.floor(Math.random() * 4)]};
        `;
        
        heart.innerHTML = '❤';
        document.body.appendChild(heart);

        // Track position and adjust opacity
        function updateHeartPosition() {
            if (!heart.isConnected) return; // Stop if heart was removed
            
            const heartRect = heart.getBoundingClientRect();
            const heartCenterY = heartRect.top + heartRect.height/2;
            
            if (contentCard) {
                const cardRect = contentCard.getBoundingClientRect();
                const isOverCard = heartCenterY > cardRect.top && heartCenterY < cardRect.bottom;
                
                if (isOverCard) {
                    // Calculate how deep the heart is in the card
                    const distanceIntoCard = Math.min(
                        heartCenterY - cardRect.top,
                        cardRect.bottom - heartCenterY
                    );
                    const maxDistance = cardRect.height/2;
                    const transparency = 0.1 + 0.9 * (distanceIntoCard / maxDistance);
                    heart.style.opacity = startOpacity * transparency;
                } else {
                    heart.style.opacity = startOpacity;
                }
            }
            
            requestAnimationFrame(updateHeartPosition);
        }
        
        updateHeartPosition();

        // Remove heart after animation completes
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, duration * 1000);
    }

    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 300);
    }
    
    // Create hearts periodically
    setInterval(createHeart, 800);
});

// Add required styles
const style = document.createElement('style');
style.textContent = `
    .floating-heart {
        position: fixed;
        pointer-events: none;
        animation: float-up linear forwards;
        z-index: 100;
        font-size: 1em;
        bottom: -20px;
        transform: translateY(0);
        transition: opacity 0.3s ease;
        text-shadow: 0 0 10px rgba(255,255,255,0.5);
    }
    
    @keyframes float-up {
        0% { transform: translateY(0); opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateY(-100vh); opacity: 0; }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.7);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: 100px;
        height: 100px;
        top: 50%;
        left: 50%;
        margin: -50px 0 0 -50px;
    }
    
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
    
    .card {
        position: relative;
        z-index: 10;
    }
`;
document.head.appendChild(style);

function toggleVisibility(currentStepId) {
    // Hide current step
    const currentStep = document.getElementById(currentStepId);
    currentStep.classList.remove('active');
    
    // Show next step
    const nextStepNumber = parseInt(currentStepId.replace('step', '')) + 1;
    const nextStepId = `step${nextStepNumber}`;
    const nextStep = document.getElementById(nextStepId);
    
    if (nextStep) {
        nextStep.classList.add('active');
    }
    
    // Update progress bar
    updateProgressBar(nextStepNumber);
}

function goBack(currentStepId) {
    // Hide current step
    const currentStep = document.getElementById(currentStepId);
    currentStep.classList.remove('active');
    
    // Show previous step
    const prevStepNumber = parseInt(currentStepId.replace('step', '')) - 1;
    const prevStepId = `step${prevStepNumber}`;
    const prevStep = document.getElementById(prevStepId);
    
    if (prevStep) {
        prevStep.classList.add('active');
    }
    
    // Update progress bar
    updateProgressBar(prevStepNumber);
}

function updateProgressBar(stepNumber) {
    const totalSteps = 5; // Total number of steps
    const progressPercentage = (stepNumber / totalSteps) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
}

// Initialize - show only first step
document.addEventListener('DOMContentLoaded', function() {
    // Show first step
    document.getElementById('step1').classList.add('active');
    
    // Initialize progress bar
    updateProgressBar(1);

});
