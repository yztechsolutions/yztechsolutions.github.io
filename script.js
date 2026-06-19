// ===== DOM Elements =====
const header = document.querySelector('.header');
const navMenu = document.querySelector('.nav-menu');
const mobileMenuBtn = document.querySelector('#mobileMenuBtn');
const navLinks = document.querySelectorAll('.nav-link');
const faqItems = document.querySelectorAll('.faq-item');
const quoteForm = document.querySelector('#quoteFormEl');
const bookingForm = document.querySelector('#bookingForm');
const toast = document.querySelector('#toast');
const qrModal = document.querySelector('#qrModal');
const qrClose = document.querySelector('#qrClose');
const qrImage = document.querySelector('#qrImage');
const qrImgs = document.querySelectorAll('.qr-img');

// ===== Mobile Menu Toggle =====
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// ===== Close mobile menu when clicking a link =====
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// ===== Active nav link on scroll =====
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// ===== Header shadow on scroll =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// ===== FAQ Accordion =====
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// ===== Show Toast =====
function showToast(message = 'Message sent successfully!') {
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ===== Form Submission Handler =====
async function handleFormSubmit(form, formType) {
    event.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#EF4444';
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showToast('Please fill in all required fields.');
        return;
    }
    
    // Get submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate form submission (in production, replace with actual API call)
        // For now, we'll use mailto as a fallback since we don't have a backend
        await simulateSubmission(data, formType);
        
        // Show success message
        showToast(formType === 'booking' 
            ? 'Booking submitted successfully! We will contact you soon.' 
            : 'Quote request sent! We will get back to you within 24 hours.');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        showToast('Something went wrong. Please try again or call us directly.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ===== Simulate form submission =====
function simulateSubmission(data, formType) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Log data for debugging
            console.log('Form submitted:', { type: formType, data });
            
            // In production, you would send this to your backend
            // For demonstration, we'll create a mailto link as fallback
            const subject = formType === 'booking' 
                ? `Booking Request - ${data.bookingName}` 
                : `Quote Request - ${data.name}`;
            
            let body = '';
            
            if (formType === 'booking') {
                body = `
Booking Details:
----------------
Name: ${data.bookingName}
Email: ${data.bookingEmail}
Phone: ${data.bookingPhone}
Device: ${data.bookingDevice || 'Not specified'}
Date: ${data.bookingDate}
Time: ${data.bookingTime}
Service: ${data.bookingService}
Additional: ${data.bookingMessage || 'None'}
                `.trim();
            } else {
                body = `
Quote Request:
--------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Service: ${data.enquiryType}
Message: ${data.message || 'None'}
                `.trim();
            }
            
            // Open mailto (this is a fallback for demo purposes)
            // In production, integrate with a form service like Formspree, Netlify Forms, etc.
            // window.location.href = `mailto:yztechsolutions88@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            resolve({ success: true });
        }, 1500);
    });
}

// ===== Set minimum date for booking =====
function setMinBookingDate() {
    const dateInput = document.querySelector('#bookingDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        
        dateInput.min = `${year}-${month}-${day}`;
    }
}

// ===== Form event listeners =====
if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        handleFormSubmit(quoteForm, 'quote');
    });
}

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        handleFormSubmit(bookingForm, 'booking');
    });
    
    // Set minimum date on load
    setMinBookingDate();
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    setActiveNavLink();
    
    // Set booking date constraints
    setMinBookingDate();
});

// ===== QR Code Modal =====
function openQrModal(src) {
    qrImage.src = src;
    qrModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQrModal() {
    qrModal.classList.remove('active');
    document.body.style.overflow = '';
}

qrImgs.forEach(img => {
    img.addEventListener('click', () => {
        openQrModal(img.getAttribute('data-src'));
    });
});

qrClose.addEventListener('click', closeQrModal);

document.querySelector('.qr-overlay').addEventListener('click', closeQrModal);
