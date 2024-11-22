document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    let submenuTimer;
    let isAnimating = false; // New variable to track animation state

    const checkScroll = () => {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Check scroll position on load
    checkScroll();

    window.addEventListener('scroll', checkScroll);

    // Function to show submenu and close others
    function showSubmenuAndCloseOthers(button) {
        clearTimeout(submenuTimer);
        if (isAnimating) return; // Don't start a new animation if one is in progress

        // Close all other submenus
        headerNavButtons.forEach(otherButton => {
            if (otherButton !== button) {
                const otherSubmenu = otherButton.querySelector('.header-submenu');
                if (otherSubmenu && otherSubmenu.style.display === 'block') {
                    collapseAllSubmenuChildren(otherSubmenu);
                    otherSubmenu.style.display = 'none';
                    otherButton.querySelector('.header-nav-button-arrow').style.transform = 'rotate(0deg)';
                }
            }
        });

        // Show the current submenu
        const submenu = button.querySelector('.header-submenu');
        if (submenu) {
            submenu.style.display = 'block';
            button.querySelector('.header-nav-button-arrow').style.transform = 'rotate(180deg)';
        }

        // Reset animating state after animation completes
        setTimeout(() => {
            isAnimating = false;
        }, 300); // Match the transition duration
    }

    // Function to collapse all submenu children
    function collapseAllSubmenuChildren(submenu) {
        const expandedChildren = submenu.querySelectorAll('.header-submenu-children.expanded');
        expandedChildren.forEach(child => {
            child.classList.remove('expanded');
            child.style.maxHeight = '0px';
            const arrow = child.previousElementSibling.querySelector('.submenu-arrow');
            if (arrow) {
                arrow.classList.remove('expanded');
            }
        });
    }

    // Function to hide submenu with delay
    function hideSubmenuWithDelay(button) {
        clearTimeout(submenuTimer);
        submenuTimer = setTimeout(() => {
            if (isAnimating) return; // Don't start a new animation if one is in progress

            isAnimating = true; // Set animating state

            const submenu = button.querySelector('.header-submenu');
            if (submenu) {
                collapseAllSubmenuChildren(submenu);
                submenu.style.display = 'none';
                button.querySelector('.header-nav-button-arrow').style.transform = 'rotate(0deg)';

                // Reset animating state after animation completes
                setTimeout(() => {
                    isAnimating = false;
                }, 300); // Match the transition duration
            }
        }, 100); // Reduced delay before hiding
    }

    // Get all header nav buttons
    const headerNavButtons = document.querySelectorAll('.header-nav-button');

    // Add event listeners to all buttons
    headerNavButtons.forEach(button => {
        button.addEventListener('mouseenter', () => showSubmenuAndCloseOthers(button));
        button.addEventListener('mouseleave', () => hideSubmenuWithDelay(button));
    });

    // Add event listeners to submenus
    const submenus = document.querySelectorAll('.header-submenu');
    submenus.forEach(submenu => {
        submenu.addEventListener('mouseenter', () => clearTimeout(submenuTimer));
        submenu.addEventListener('mouseleave', () => {
            const parentButton = submenu.closest('.header-nav-button');
            hideSubmenuWithDelay(parentButton);
        });
    });

    // Close submenus when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.header-nav-button') && !event.target.closest('.header-submenu')) {
            closeAllSubmenus();
        }
    });

    // Function to toggle submenu children
    function toggleSubmenuChildren(item, event) {
        console.log("Toggle submenu children called");
        event.preventDefault();
        event.stopPropagation();
        const children = item.nextElementSibling;
        const arrow = item.querySelector('.submenu-arrow');
        const submenu = item.closest('.header-submenu');

        // Close all other open submenu-children in the same submenu
        const openChildren = submenu.querySelectorAll('.header-submenu-children.expanded');
        openChildren.forEach(openChild => {
            if (openChild !== children) {
                const openArrow = openChild.previousElementSibling.querySelector('.submenu-arrow');
                openArrow.classList.remove('expanded');
                openChild.style.maxHeight = '0px';

                // Remove the expanded class after the transition
                setTimeout(() => {
                    openChild.classList.remove('expanded');
                }, 300); // Match the transition duration (0.3s)
            }
        });

        // Toggle the clicked submenu-children
        arrow.classList.toggle('expanded');

        if (children.classList.contains('expanded')) {
            children.style.maxHeight = '0px';
            setTimeout(() => {
                children.classList.remove('expanded');
            }, 300); // Match the transition duration (0.3s)
        } else {
            children.classList.add('expanded');
            children.style.maxHeight = children.scrollHeight + 'px';
        }
    }

    // Add click event listener to submenu items with children
    const submenuItemsWithChildren = document.querySelectorAll('.header-submenu-item-with-children');
    submenuItemsWithChildren.forEach(item => {
        item.addEventListener('click', (event) => toggleSubmenuChildren(item, event));
    });

    // Add click event listener to collapsible submenu items
    const collapsibleSubmenuItems = document.querySelectorAll('.header-submenu__collapsible');
    collapsibleSubmenuItems.forEach(item => {
        item.addEventListener('click', (event) => toggleSubmenuChildren(item, event));
    });

    // Update closeAllSubmenus function
    function closeAllSubmenus() {
        if (isAnimating) return; // Don't start a new animation if one is in progress

        isAnimating = true; // Set animating state
        const allSubmenus = document.querySelectorAll('.header-submenu');
        allSubmenus.forEach(submenu => {
            collapseAllSubmenuChildren(submenu);
            submenu.style.display = 'none';
            const button = submenu.closest('.header-nav-button');
            if (button) {
                button.querySelector('.header-nav-button-arrow').style.transform = 'rotate(0deg)';
            }
        });

        // Reset animating state after animation completes
        setTimeout(() => {
            isAnimating = false;
        }, 300); // Match the transition duration
    }

    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const headerNav = document.querySelector('.header-nav');

    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('open');
        headerNav.classList.toggle('active');
        header.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.hamburger-menu') && !event.target.closest('.header-nav')) {
            hamburgerMenu.classList.remove('open');
            headerNav.classList.remove('active');
            header.classList.remove('menu-open');
        }
    });

    // Add this at the end of the file, outside of any existing event listeners
    document.addEventListener('DOMContentLoaded', () => {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const headerNav = document.querySelector('.header-nav');

        if (hamburgerMenu && headerNav) {
            hamburgerMenu.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                headerNav.classList.toggle('active');
                console.log('Hamburger clicked, nav toggled'); // Debug log
            });
        } else {
            console.error('Hamburger menu or header nav not found'); // Debug log
        }
    });
});
