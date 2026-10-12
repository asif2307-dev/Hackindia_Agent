/**
 * app.js
 * Handles UI interactions, modal logic, and triggering the payment function.
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    const bookingForm = document.getElementById('bookingForm');
    
    let currentBookingAmount = 0;
    let currentDestination = '';

    // Attach click listeners to all elements with class 'btn-book'
    const bookButtons = document.querySelectorAll('.btn-book');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Get data attributes from the clicked button
            currentDestination = e.target.dataset.destination || 'Custom Travel Package';
            currentBookingAmount = e.target.dataset.price || 5000;
            
            // Populate modal with dynamic data
            document.getElementById('modalDestination').innerText = currentDestination;
            document.getElementById('modalPrice').innerText = `₹${currentBookingAmount}`;
            
            // Show the modal
            modal.style.display = 'block';
        });
    });

    // Close modal when X is clicked
    closeBtn.addEventListener('click', () => {
        closeModal();
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Handle form submission to trigger Razorpay
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect user input
        const customerName = document.getElementById('name').value;
        const customerEmail = document.getElementById('email').value;
        const customerPhone = document.getElementById('phone').value;
        
        // Prepare data object to pass to our payment integration
        const bookingDetails = {
            destination: currentDestination,
            amount: currentBookingAmount,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone
        };
        
        // Call the reusable Razorpay function
        initiatePayment(bookingDetails);
    });
});

// Helper function to close modal
function closeModal() {
    const modal = document.getElementById('bookingModal');
    if(modal) {
        modal.style.display = 'none';
        // Optional: clear the form fields on close
        document.getElementById('bookingForm').reset();
    }
}
