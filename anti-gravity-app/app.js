// --- System Scale Logic ---
function updateScale() {
    const wrapper = document.getElementById('desktop-wrapper');
    const device = document.getElementById('device');
    
    // We want the device (height: 2400) to fit within wrapper height with a small margin.
    const wrapperHeight = window.innerHeight;
    const padding = 80; // 40px top/bottom
    const availableHeight = wrapperHeight - padding;
    
    // Calculate scale ratio
    const scale = availableHeight / 2400;
    
    // Limit max scale to 1 (don't scale up beyond 100%)
    const finalScale = Math.min(scale, 1);
    
    device.style.transform = `scale(${finalScale})`;
}

// Ensure scale updates on resize and load
window.addEventListener('resize', updateScale);
window.addEventListener('DOMContentLoaded', () => {
    updateScale();
    updateTime();
    setInterval(updateTime, 60000);
});

// Update status bar time
function updateTime() {
    const timeEl = document.getElementById('time');
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    timeEl.innerText = `${hours}:${minutes}`;
}

// --- Navigation Logic ---
window.navTo = function(screenId) {
    // Clear any pending alerts if navigating away from the mode
    if (typeof alertTimeout !== 'undefined') {
        clearTimeout(alertTimeout);
    }

    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.classList.remove('active');
        s.classList.remove('exit-left');
        s.classList.remove('enter-right');
    });

    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
        // Very basic simple appearance
        target.classList.add('active');
        
        // Handle specific logic when screen shows up
        if (screenId === 'connecting') {
            startConnectionSimulation();
        } else if (screenId === 'Saathi') {
            initAntiGravityMode();
        } else if (screenId === 'alert') {
            triggerAlertSound();
        }
    }
};

window.navToMap = function(type) {
    const title = document.getElementById('map-sheet-title');
    const desc = document.getElementById('map-sheet-desc');
    const pin = document.getElementById('map-pin-label');
    const dist = document.getElementById('map-dist');
    const time = document.getElementById('map-time');
    const btn = document.getElementById('map-action-btn');
    const mapBg = document.querySelector('.map-bg');
    
    if (type === 'cafe') {
        title.innerText = "Platform Cafe";
        pin.innerText = "Platform Cafe";
        desc.innerText = "Follow the path to the premium cafe for food and Wi-Fi.";
        dist.innerText = "50";
        time.innerText = "1";
        btn.innerText = "Back to Details";
        btn.onclick = () => navTo('cafe');
        if(mapBg) mapBg.style.backgroundImage = "url('cafe_map_bg.png')";
    } else if (type === 'bag') {
        title.innerText = "Track Triplock";
        pin.innerText = "Your Triplock";
        desc.innerHTML = "<span class='text-danger font-bold'>Warning: Set is moving away!</span> Follow signal.";
        dist.innerText = "15";
        time.innerText = "0.2";
        btn.innerText = "Trigger Loud Alarm";
        btn.onclick = () => { triggerAlertSound(); navTo('home'); };
        if(mapBg) mapBg.style.backgroundImage = "url('map_bg.png')";
    } else {
        // default: seating
        title.innerText = "Bench Zone B";
        pin.innerText = "Bench Zone B";
        desc.innerText = "Directly opposite to Coach B2 position. Relatively empty.";
        dist.innerText = "120";
        time.innerText = "2";
        btn.innerText = "I've Arrived Here";
        btn.onclick = () => navTo('connecting');
        if(mapBg) mapBg.style.backgroundImage = "url('seating_map_bg.png')";
    }
    
    navTo('map');
};

// --- Mock Interactions ---

// Fetch PNR
window.fetchPNR = function() {
    const btn = document.querySelector('#pnr-entry-section button');
    btn.innerText = "Fetching...";
    
    setTimeout(() => {
        document.getElementById('pnr-entry-section').classList.add('hidden');
        document.getElementById('journey-details-section').classList.remove('hidden');
    }, 800);
};

// Connection Simulation
function startConnectionSimulation() {
    const statusText = document.getElementById('bt-status-text');
    const subText = document.getElementById('bt-sub-text');
    const btCenter = document.getElementById('bt-center-icon');
    const connectedInfo = document.getElementById('bt-connected-info');
    
    statusText.innerText = "Searching for Triplock device...";
    btCenter.classList.remove('success');
    connectedInfo.classList.add('hidden');
    
    setTimeout(() => {
        statusText.innerText = "Connected to Triplock";
        subText.innerText = "Battery level is good.";
        btCenter.classList.add('success');
        btCenter.innerHTML = '<i class="fa-solid fa-check"></i>';
        connectedInfo.classList.remove('hidden');
    }, 3000);
}

// Saathi Slider and Auto Alert
let alertTimeout;
let isSliderInitialized = false;

function initAntiGravityMode() {
    const slider = document.getElementById('radius-slider');
    const display = document.getElementById('radius-val');
    const safeZone = document.getElementById('safe-zone-display');
    
    // Scale visual circle based on slider exactly once
    if (!isSliderInitialized) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            display.innerText = `${val} Meters`;
            
            // Base size is 400px for 3m. Let's map 2-5m to 300-600px.
            const size = 300 + ((val - 2) * 100);
            safeZone.style.width = `${size}px`;
            safeZone.style.height = `${size}px`;
        });
        isSliderInitialized = true;
    }

    // Auto trigger alert after 8 seconds of entering Safe Mode
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
        navTo('alert');
    }, 8000);
}

// Theme Toggle
window.toggleTheme = function() {
    document.body.classList.toggle('dark-theme');
    const knob = document.getElementById('theme-knob');
    if (document.body.classList.contains('dark-theme')) {
        knob.style.transform = 'translateX(50px)';
        knob.style.background = '#2B6CB0';
    } else {
        knob.style.transform = 'translateX(0)';
        knob.style.background = 'white';
    }
};

// Demo helper
window.triggerAlertDemo = function() {
    clearTimeout(alertTimeout);
    navTo('alert');
};

function triggerAlertSound() {
    // In a real app we play sound here
    console.log("ALERT WARNING PLAYED");
}

window.saveSettings = function() {
    const nameInput = document.getElementById('settings-name-input');
    const homeName = document.getElementById('user-name-display');
    const settingsName = document.getElementById('settings-name-display');
    
    if (nameInput && nameInput.value.trim() !== '') {
        const customName = nameInput.value.trim();
        if (homeName) homeName.innerText = customName;
        if (settingsName) settingsName.innerText = customName;
    }
    
    navTo('home');
};
