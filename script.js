// Navigation scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Modal functions
function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Animated counters
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.id === 'revenue') {
            element.textContent = '$' + Math.floor(current).toLocaleString();
        } else if (element.id === 'engagement') {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Start counters when dashboard section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('activeEvents'), 12);
            animateCounter(document.getElementById('totalAttendees'), 2847);
            animateCounter(document.getElementById('revenue'), 45680);
            animateCounter(document.getElementById('engagement'), 94);
        }
    });
});

observer.observe(document.querySelector('.dashboard'));

// Quick event creation
function createQuickEvent() {
    const name = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;
    const type = document.getElementById('eventType').value;
    
    if (name && date) {
        showNotification('Event "' + name + '" created successfully!', 'success');
        // Clear form
        document.getElementById('eventName').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventType').selectedIndex = 0;
    } else {
        showNotification('Please fill in all required fields', 'error');
    }
}

// Full event creation
function submitEvent() {
    const name = document.getElementById('modalEventName').value;
    const desc = document.getElementById('modalEventDesc').value;
    const date = document.getElementById('modalEventDate').value;
    const location = document.getElementById('modalEventLocation').value;
    
    if (name && desc && date && location) {
        showNotification('Event "' + name + '" has been created and is ready for promotion!', 'success');
        closeModal('createEvent');
        // Clear form
        document.getElementById('modalEventName').value = '';
        document.getElementById('modalEventDesc').value = '';
        document.getElementById('modalEventDate').value = '';
        document.getElementById('modalEventLocation').value = '';
        document.getElementById('modalEventPrice').value = '';
    } else {
        showNotification('Please fill in all required fields', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Event data storage (in-memory)
let events = [
    {
        id: 1,
        name: "Tech Conference 2025",
        date: "2025-08-15",
        type: "Conference",
        attendees: 250,
        status: "Active"
    },
    {
        id: 2,
        name: "Marketing Workshop",
        date: "2025-08-20",
        type: "Workshop",
        attendees: 45,
        status: "Active"
    }
];

// Event management functions
function addEvent(eventData) {
    const newEvent = {
        id: Date.now(),
        ...eventData,
        attendees: 0,
        status: "Active"
    };
    events.push(newEvent);
    updateDashboardStats();
    return newEvent;
}

function updateDashboardStats() {
    const activeEvents = events.filter(e => e.status === "Active").length;
    const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
    
    document.getElementById('activeEvents').textContent = activeEvents;
    document.getElementById('totalAttendees').textContent = totalAttendees.toLocaleString();
}

// Form validation - made less strict for easier event creation
function validateEventForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 1) {
        errors.push("Event name is required");
    }
    
    if (!formData.date) {
        errors.push("Event date is required");
    }
    
    // Made location optional for easier creation
    // if (!formData.location || formData.location.trim().length < 3) {
    //     errors.push("Event location is required");
    // }
    
    return errors;
}

// Enhanced event creation with validation - simplified
function submitEvent() {
    const formData = {
        name: document.getElementById('modalEventName').value.trim(),
        description: document.getElementById('modalEventDesc').value.trim(),
        date: document.getElementById('modalEventDate').value,
        location: document.getElementById('modalEventLocation').value.trim() || "TBD",
        category: document.getElementById('modalEventCategory').value,
        price: document.getElementById('modalEventPrice').value || 0
    };
    
    // Simple validation - just check required fields
    if (!formData.name) {
        showNotification('Please enter an event name', 'error');
        return;
    }
    
    if (!formData.date) {
        showNotification('Please select an event date', 'error');
        return;
    }
    
    // Add event to storage
    const newEvent = addEvent(formData);
    
    showNotification(`Event "${formData.name}" has been created successfully!`, 'success');
    closeModal('createEvent');
    
    // Clear form
    clearModalForm();
}

// Helper function to clear modal form
function clearModalForm() {
    document.getElementById('modalEventName').value = '';
    document.getElementById('modalEventDesc').value = '';
    document.getElementById('modalEventDate').value = '';
    document.getElementById('modalEventLocation').value = '';
    document.getElementById('modalEventPrice').value = '';
    document.getElementById('modalEventCategory').selectedIndex = 0;
}

// Enhanced quick event creation - simplified validation
function createQuickEvent() {
    const name = document.getElementById('eventName').value.trim();
    const date = document.getElementById('eventDate').value;
    const type = document.getElementById('eventType').value;
    
    if (!name) {
        showNotification('Please enter an event name', 'error');
        return;
    }
    
    if (!date) {
        showNotification('Please select a date for your event', 'error');
        return;
    }
    
    const eventData = {
        name: name,
        date: date,
        type: type,
        location: "TBD",
        description: "Quick event created from dashboard",
        category: type
    };
    
    addEvent(eventData);
    showNotification(`Event "${name}" created successfully!`, 'success');
    
    // Clear form
    clearQuickForm();
}

// Helper function to clear quick form
function clearQuickForm() {
    document.getElementById('eventName').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventType').selectedIndex = 0;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Ctrl/Cmd + N to create new event
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openModal('createEvent');
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to tomorrow for quick event creation
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().slice(0, 16);
    
    // Set default dates if elements exist
    const eventDateEl = document.getElementById('eventDate');
    const modalEventDateEl = document.getElementById('modalEventDate');
    
    if (eventDateEl) eventDateEl.value = tomorrowString;
    if (modalEventDateEl) modalEventDateEl.value = tomorrowString;
    
    // Add loading animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        featureObserver.observe(card);
    });
    
    // Welcome message with delay
    setTimeout(() => {
        showNotification('Welcome to EventPro! Click "Create Event" to get started.', 'info');
    }, 1500);
    
    // Debug: Log that initialization is complete
    console.log('EventPro initialized successfully!');
    console.log('Events array:', events);
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(function() {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}, 16));

// Print functionality for events
function printEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Event Details - ${event.name}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #333; }
                        .detail { margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <h1>${event.name}</h1>
                    <div class="detail"><strong>Date:</strong> ${event.date}</div>
                    <div class="detail"><strong>Type:</strong> ${event.type}</div>
                    <div class="detail"><strong>Location:</strong> ${event.location}</div>
                    <div class="detail"><strong>Attendees:</strong> ${event.attendees}</div>
                    <div class="detail"><strong>Status:</strong> ${event.status}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}