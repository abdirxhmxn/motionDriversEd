/* ============================================
   Motion Drivers Ed - Registration Page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    
    // Console log for debugging - parsed URLSearchParams values
    console.log('register.js - Parsed URLSearchParams:', {
        id: params.get('id'),
        name: params.get('name'),
        price: params.get('price'),
        square: params.get('square'),
        fullSearch: location.search
    });
    
    const service = {
        id: params.get('id') || 'unknown',
        name: decodeURIComponent(params.get('name') || 'Driver Education'),
        price: params.get('price') || '0',
        square: params.get('square') || 'https://square.link/u/hel5wnyU'
    };
    
    console.log('register.js - Decoded service object:', service);

    const isClass = service.id.toLowerCase().startsWith('class');
    const isDeposit = service.id.toLowerCase().includes('deposit');
    const usesClassTime = isDeposit;
    const FORMSPREE_URL = isClass
        ? 'https://formspree.io/f/xblnpybl'   // Class form
        : 'https://formspree.io/f/mnneovrj';  // Service form

    // Hide deposit button for non-class services (only show for classes)
    // Set deposit amount to $150 for classes
    const payDepositBtn = document.getElementById('payDepositBtn');
    if (payDepositBtn) {
        if (isClass) {
            payDepositBtn.style.display = 'inline-block';
            // Set deposit amount to $150 for classes
            const depositPriceElements = payDepositBtn.querySelectorAll('.dynamicPrice');
            depositPriceElements.forEach(el => {
                el.textContent = '150.00';
            });
        } else {
            payDepositBtn.style.display = 'none';
        }
    }

    // Update hidden form action
    document.getElementById('formspreeHiddenForm').action = FORMSPREE_URL;

    // Populate UI
    document.getElementById('serviceName').textContent = service.name;
    document.getElementById('servicePrice').textContent = `$${Number(service.price).toFixed(2)}`;
    document.getElementById('summaryService').textContent = service.name;
    document.getElementById('summaryTotal').textContent = `$${Number(service.price).toFixed(2)}`;
    // Update all dynamicPrice elements EXCEPT those in the deposit button (which should stay at $150)
    document.querySelectorAll('.dynamicPrice').forEach(el => {
        // Skip if this element is inside the deposit button
        if (payDepositBtn && payDepositBtn.contains(el)) {
            return; // Keep the deposit button at $150.00
        }
        el.textContent = Number(service.price).toFixed(2);
    });

    // Date rules
    const dateInput = document.getElementById('preferredDate');
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    const todayMonth = today.toISOString().slice(0, 7);
    if (isClass) {
        dateInput.type = 'month';
        dateInput.min = todayMonth;
    } else {
        dateInput.type = 'date';
        dateInput.min = todayDate;
    }

    const timeGroup = document.getElementById('timeGroup');
    const classTimeGroup = document.getElementById('classTimeGroup');
    const preferredTimeSelect = document.getElementById('preferredTime');
    const classStartSelect = document.getElementById('classStartTime');
    const classEndSelect = document.getElementById('classEndTime');

    // Toggle time controls
    if (isClass) {
        timeGroup.style.display = 'none';
        classTimeGroup.style.display = 'none';
        preferredTimeSelect.removeAttribute('required');
        classStartSelect.removeAttribute('required');
        classEndSelect.removeAttribute('required');
        document.getElementById('summaryTime').textContent = 'Scheduled after enrollment';
        document.getElementById('dateLabel').textContent = 'Class Month *';
    } else if (usesClassTime) {
        timeGroup.style.display = 'none';
        preferredTimeSelect.removeAttribute('required');
        classTimeGroup.style.display = 'block';
        classStartSelect.required = true;
        classEndSelect.required = true;
        document.getElementById('summaryTime').textContent = 'Select your class time';
        document.getElementById('dateLabel').textContent = 'Confirm Date *';
    } else {
        classTimeGroup.style.display = 'none';
        classStartSelect.removeAttribute('required');
        classEndSelect.removeAttribute('required');
    }

    const formatTime = (time) => new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
    });

    // Live summary update
    const updateSummary = () => {
        const date = dateInput.value;
        const time = preferredTimeSelect.value;
        const classStart = classStartSelect.value;
        const classEnd = classEndSelect.value;

        const dateLabel = (() => {
            if (!date) return 'Not selected';
            if (isClass) {
                return new Date(`${date}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            }
            return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        })();
        document.getElementById('summaryDate').textContent = dateLabel;

        let summaryTime = 'Not selected';
        if (isClass) {
            summaryTime = 'Scheduled after enrollment';
        } else if (usesClassTime) {
            summaryTime = classStart && classEnd ? `${formatTime(classStart)} - ${formatTime(classEnd)}` : 'Not selected';
        } else if (time) {
            summaryTime = formatTime(time);
        }
        document.getElementById('summaryTime').textContent = summaryTime;
    };
    document.getElementById('preferredDate').addEventListener('change', updateSummary);
    preferredTimeSelect.addEventListener('change', updateSummary);
    classStartSelect.addEventListener('change', updateSummary);
    classEndSelect.addEventListener('change', updateSummary);
    updateSummary();

    // MAIN SUBMIT HANDLER
    document.getElementById('bookingForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const btn = e.submitter || document.getElementById('payFullBtn');
        const isDepositPayment = btn && btn.id === 'payDepositBtn';
        
        btn.disabled = true;
        btn.innerHTML = 'Processing... <i class="fas fa-spinner fa-spin"></i>';

        const ref = 'MDE-' + Date.now().toString().slice(-6);
        document.getElementById('bookingRef').textContent = ref;

        // Show success
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';

        // Collect data
        const classStartTime = usesClassTime ? classStartSelect.value : '';
        const classEndTime = usesClassTime ? classEndSelect.value : '';
        const preferredTimeValue = isClass
            ? 'Scheduled after enrollment'
            : usesClassTime
                ? (classStartTime && classEndTime ? `${classStartTime} - ${classEndTime}` : 'N/A')
                : (preferredTimeSelect.value || 'N/A');

        // Determine price: $150 deposit for classes, full price otherwise
        const paymentPrice = (isClass && isDepositPayment) ? '150' : service.price;
        const paymentType = (isClass && isDepositPayment) ? 'Deposit' : 'Full Payment';

        const data = {
            ref,
            service: service.name,
            price: paymentPrice,
            paymentType: paymentType,
            fullPrice: service.price,
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            date: document.getElementById('preferredDate').value || 'TBD',
            time: preferredTimeValue,
            notes: document.getElementById('notes').value.trim(),
            classStartTime,
            classEndTime
        };

        // Console log for debugging - collected data object
        console.log('register.js - Form submit - Collected data object:', data);

        // FILL HIDDEN FORMSPREE FORM
        document.getElementById('fs_ref').value = data.ref;
        document.getElementById('fs_service').value = data.service + (isDepositPayment ? ' (Deposit)' : '');
        document.getElementById('fs_price').value = '$' + Number(data.price).toFixed(2) + (isDepositPayment ? ' (Full Price: $' + Number(service.price).toFixed(2) + ')' : '');
        document.getElementById('fs_firstName').value = data.firstName;
        document.getElementById('fs_lastName').value = data.lastName;
        document.getElementById('fs_email').value = data.email;
        document.getElementById('fs_phone').value = data.phone;
        document.getElementById('fs_date').value = data.date;
        document.getElementById('fs_time').value = data.time;
        document.getElementById('fs_classStartTime').value = data.classStartTime || '';
        document.getElementById('fs_classEndTime').value = data.classEndTime || '';
        document.getElementById('fs_notes').value = data.notes;
        document.getElementById('fs_replyto').value = data.email;
        
        // Add spam prevention fields
        var form = document.getElementById('formspreeHiddenForm');
        if (!form.querySelector('input[name="_format"]')) {
            var formatInput = document.createElement('input');
            formatInput.type = 'hidden';
            formatInput.name = '_format';
            formatInput.value = 'plain';
            form.appendChild(formatInput);
        }
        if (!form.querySelector('input[name="_subject"]')) {
            var subjectInput = document.createElement('input');
            subjectInput.type = 'hidden';
            subjectInput.name = '_subject';
            subjectInput.value = 'Motion Drivers Ed - Booking: ' + data.service;
            form.appendChild(subjectInput);
        }

        // SUBMIT TO FORMSPREE (this WILL work)
        document.getElementById('formspreeHiddenForm').submit();

        // Save locally
        localStorage.setItem('motionBooking', JSON.stringify(data));

        // Build Square URL
        // Use deposit link for class deposits, otherwise use the service's Square link
        const depositSquareLink = 'https://square.link/u/sidz03wc';
        let squareUrl = (isClass && isDepositPayment) ? depositSquareLink : service.square;
        squareUrl += `?prefill_email=${encodeURIComponent(data.email)}`;
        squareUrl += `&prefill_name=${encodeURIComponent(data.firstName + ' ' + data.lastName)}`;
        const timeNote = usesClassTime && data.classStartTime && data.classEndTime
            ? ` | Time: ${formatTime(data.classStartTime)} - ${formatTime(data.classEndTime)}`
            : (!usesClassTime && preferredTimeSelect.value ? ` | Time: ${formatTime(preferredTimeSelect.value)}` : '');
        
        // Add payment type info to note
        const paymentNote = (isClass && isDepositPayment) 
            ? `Ref: ${ref} | ${data.service} | DEPOSIT: $${data.price} (Full Price: $${data.fullPrice}) | Date: ${data.date}${timeNote}`
            : `Ref: ${ref} | ${data.service} | Date: ${data.date}${timeNote}`;
        squareUrl += `&note=${encodeURIComponent(paymentNote)}`;

        // Console log for debugging - final squareUrl before redirect
        console.log('register.js - Form submit - Final squareUrl before redirect:', squareUrl);
        console.log('register.js - Form submit - Redirecting to Square payment in 200ms...');

        // Redirect after 200ms
        setTimeout(() => {
            window.location.href = squareUrl;
        }, 200);
    });
});
