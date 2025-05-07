document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const upiIdInput = document.getElementById('upi-id');
    const noteInput = document.getElementById('note');
    const downloadBtn = document.getElementById('download-btn');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    const amountError = document.getElementById('amount-error');
    
    // Initialize QRCode
    const qrcode = new QRCode(qrcodeDiv, {
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Handle window resize for scrolling
    function handleResize() {
        if (window.innerWidth > 768) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    // Set initial state and add event listeners
    function init() {
        handleResize();
        window.addEventListener('resize', handleResize);
        
        // Real-time QR generation
        amountInput.addEventListener('input', generateQRCode);
        upiIdInput.addEventListener('input', generateQRCode);
        noteInput.addEventListener('input', generateQRCode);
        
        // Download button
        downloadBtn.addEventListener('click', downloadQRCode);
        
        // Initial input validation
        amountInput.addEventListener('input', validateAmount);
    }
    
    // Validate amount input
    function validateAmount() {
        const value = parseInt(this.value);
        if (value > 100001) this.value = 100000;
        if (value < 1 && this.value !== '') this.value = 1;
    }
    
    // Generate QR code
    function generateQRCode() {
        const amount = parseInt(amountInput.value);
        const upiId = upiIdInput.value.trim();
        const note = noteInput.value.trim();
        
        // Clear previous errors
        amountError.textContent = '';
        
        // Validate amount
        if (!amountInput.value || isNaN(amount)) {
            resetQRDisplay();
            return;
        }
        
        if (amount < 1 || amount > 100000) {
            resetQRDisplay();
            return;
        }

        // Create UPI payment link
        const params = new URLSearchParams();
        params.append('pa', upiId || '9668308533@okbizaxis');
        params.append('pn', 'Payment Receiver');
        params.append('am', amount.toString());
        if (note) params.append('tn', note);
        
        const upiLink = `upi://pay?${params.toString()}`;
        
        // Generate QR code
        try {
            qrcode.clear();
            qrcode.makeCode(upiLink);
            
            // Update UI
            qrPlaceholder.style.display = 'none';
            qrcodeDiv.style.display = 'block';
            downloadBtn.disabled = false;
        } catch (error) {
            console.error('QR Generation Error:', error);
            resetQRDisplay();
        }
    }
    
    // Reset QR display
    function resetQRDisplay() {
        qrPlaceholder.style.display = 'flex';
        qrcodeDiv.style.display = 'none';
        downloadBtn.disabled = true;
    }
    
    // Download QR code
    function downloadQRCode() {
        const canvas = qrcodeDiv.querySelector('canvas');
        if (!canvas) return;
        
        const amount = amountInput.value || 'payment';
        const link = document.createElement('a');
        link.download = `UPI-Payment-₹${amount}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    // Initialize the application
    init();
});