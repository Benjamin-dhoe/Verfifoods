document.addEventListener("DOMContentLoaded", function() {
        // Get all tab labels
        const tabLabels = document.querySelectorAll('[data-role="tab-label"]');

        // Function to show the active tab
        function showTab(target) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('[data-role="tab-content"]');
            tabContents.forEach(content => {
                content.style.display = 'none';
            });

            // Remove active attribute from all tab labels
            tabLabels.forEach(label => {
                label.removeAttribute('data-active');
            });

            // Show the active tab content and set the active attribute
            const activeTab = document.querySelector(`[data-role="tab-content"][data-content="${target}"]`);
            if (activeTab) {
                activeTab.style.display = 'block';
            }

            const activeLabel = [...tabLabels].find(label => label.getAttribute('data-target') === target);
            if (activeLabel) {
                activeLabel.setAttribute('data-active', 'true');
            }
        }

        // Add click event listener to each tab label
        tabLabels.forEach(label => {
            label.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                showTab(target);
            });
        });

        // Show the first tab by default
        if (tabLabels.length > 0) {
            const defaultTarget = tabLabels[0].getAttribute('data-target');
            showTab(defaultTarget);
        }
    });
