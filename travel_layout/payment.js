/**
 * payment.js
 * Contains the reusable Razorpay payment integration function.
 */

function initiatePayment(bookingDetails) {
    // Note: In a production environment, you MUST generate the `order_id` 
    // from your backend using Razorpay's API securely. Do NOT create it on the frontend.
    // For this demonstration, we trigger the Razorpay checkout directly.

    var options = {
        // "key": "YOUR_RAZORPAY_KEY_ID", // Uncomment and add your real test/live key here
        "key": "rzp_test_Tjktt6Bs0TXxDk", // <-- Put your real test/live key here
        "amount": bookingDetails.amount * 100, // Amount in subunits (e.g., paise). So ₹500 = 50000 paise
        "currency": "INR",
        "name": "WanderLust Travel",
        "description": "Booking for " + bookingDetails.destination,
        "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=100&h=100&fit=crop", // Your logo
        // "order_id": "order_ID_from_backend", // Pass the backend-generated order ID here
        "handler": function (response) {
            // This function is executed when the payment succeeds
            console.log("Payment Success Response:", response);
            alert("Payment Successful!\nPayment ID: " + response.razorpay_payment_id);
            
            // Here you would make an API call to your backend to verify the payment signature
            
            // Close the modal upon success
            if (typeof closeModal === 'function') {
                closeModal();
            }
        },
        "prefill": {
            "name": bookingDetails.customerName,
            "email": bookingDetails.customerEmail,
            "contact": bookingDetails.customerPhone
        },
        "notes": {
            "address": "WanderLust Travel Booking",
            "destination": bookingDetails.destination
        },
        "theme": {
            "color": "#2b6cb0" // Matches our primary color
        }
    };

    var rzp = new Razorpay(options);
    
    rzp.on('payment.failed', function (response){
        console.error("Payment Failed", response.error);
        alert("Payment Failed. Reason: " + response.error.description);
    });
    
    // Open the checkout modal
    rzp.open();
}
