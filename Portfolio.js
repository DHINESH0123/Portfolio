// 1. Initialize Lucide Icons
// This function needs to be called to render the <i data-lucide="icon-name"></i> elements
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// 2. Add Scroll Logic for Sticky Header (Optional but enhances feel)
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    
    // Function to handle the scroll event
    const handleScroll = () => {
        // Adjust the shadow/styling based on scroll position
        if (window.scrollY > 50) {
            // Add a class for a slightly more prominent shadow or style change
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check in case the page is loaded mid-scroll
    handleScroll();
});

// ... (Existing code for Lucide Icons and Scroll Logic) ...

// 3. Mobile Menu Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    // ... (existing scroll logic) ...

    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuButton.querySelector('i'); // Get the lucide icon element

    // Function to toggle the mobile menu and icon
    const toggleMenu = () => {
        // Toggle the 'hidden' class on the mobile menu
        mobileMenu.classList.toggle('hidden');

        // Toggle the icon: 'menu' when closed, 'x' (close) when open
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.setAttribute('data-lucide', 'menu');
        } else {
            menuIcon.setAttribute('data-lucide', 'x');
        }
        
        // Re-create icons to reflect the change
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Attach click listener to the button
    menuButton.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked (optional, but good UX)
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMenu(); // Closes the menu
            }
        });
    });
});

// 4. Loader Screen Logic
document.addEventListener('DOMContentLoaded', () => {
    // ... (Your existing code: Lucide, Scroll, Mobile Menu) ...

    const loadingOverlay = document.getElementById('loading-overlay');
    const resumeBtn = document.getElementById('download-resume-btn');
    const contactBtn = document.getElementById('contact-mail-btn');

    // Function to show loader and execute callback after a delay
    const showLoader = (callback) => {
        // Show the overlay
        loadingOverlay.classList.remove('hidden');

        // Wait for 1.5 seconds (or adjust the duration as needed)
        setTimeout(() => {
            // Hide the overlay
            loadingOverlay.classList.add('hidden');
            
            // Execute the original action (e.g., download or mailto)
            if (callback) {
                callback();
            }
        }, 1000); // 1.5 second duration
    };

    // --- 1. Resume Button Handler ---
    if (resumeBtn) {
        // We need to prevent the default action (download) first
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Get the target URL and download attribute from the button
            const fileUrl = resumeBtn.getAttribute('href');
            const fileName = resumeBtn.getAttribute('download');
            
            // Show the loader and pass the download action as a callback
            showLoader(() => {
                // Manually trigger the download after the loader finishes
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        });
    }

    // --- 2. Contact Button Handler ---
    if (contactBtn) {
        // We need to prevent the default action (mailto) first
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Get the target mailto URL from the button
            const mailtoUrl = contactBtn.getAttribute('href');
            
            // Show the loader and pass the mailto action as a callback
            showLoader(() => {
                // Manually trigger the mailto link after the loader finishes
                window.location.href = mailtoUrl;
            });
        });
    }
});

// Note: You would typically add CSS for the 'scrolled' class in your style.css,
// e.g., to darken the shadow or slightly reduce the padding.
// Example for style.css (if you wanted a darker header on scroll):
/*
.header-bg.scrolled {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
*/