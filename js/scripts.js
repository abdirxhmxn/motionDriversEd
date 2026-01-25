/* Template: Corso - Free Training Course Landing Page Template
   Author: Inovatik
   Created: Nov 2019
   Description: Custom JS file
*/


(function($) {
    "use strict"; 
	
	/* Preloader */
	$(window).on('load', function() {
		var preloaderFadeOutTime = 500;
		function hidePreloader() {
			var preloader = $('.spinner-wrapper');
			setTimeout(function() {
				preloader.fadeOut(preloaderFadeOutTime);
			}, 500);
		}
		hidePreloader();
	});

	
	/* Navbar Scripts */
	// jQuery to collapse the navbar on scroll
    $(window).on('scroll load', function() {
		if ($(".navbar").offset().top > 60) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
    });

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$(document).on('click', 'a.page-scroll', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 600, 'easeInOutExpo');
			event.preventDefault();
		});
	});

    // closes the responsive menu on menu item click
    $(".navbar-nav li a").on("click", function(event) {
    if (!$(this).parent().hasClass('dropdown'))
        $(".navbar-collapse").collapse('hide');
    });


    /* Countdown Timer - The Final Countdown */
	$('#clock').countdown('2020/12/27 08:50:56') /* change here your "countdown to" date */
	.on('update.countdown', function(event) {
		var format = '<span class="counter-number">%D<br><span class="timer-text">Days</span></span><span class="counter-number">%H<br><span class="timer-text">Hours</span></span><span class="counter-number">%M<br><span class="timer-text">Minutes</span></span><span class="counter-number">%S<br><span class="timer-text">Seconds</span></span>';
		$(this).html(event.strftime(format));
	})
	.on('finish.countdown', function(event) {
	$(this).html('This offer has expired!')
		.parent().addClass('disabled');
    });


    /* Image Slider 2 - Swiper */
    var imageSliderOne = new Swiper('.image-slider-1', {
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
		},
        loop: true,
        navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		}
    });


    /* Image Slider - Swiper */
    var imageSliderTwo = new Swiper('.image-slider-2', {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false
		},
        loop: true,
        spaceBetween: 12,
        slidesPerView: 5,
		breakpoints: {
            // when window is <= 580px
            580: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            // when window is <= 768px
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window is <= 992px
            992: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window is <= 1200px
            1200: {
                slidesPerView: 4,
                spaceBetween: 20
            },

        }
    });


    /* Text Slider - Swiper */
	var textSlider = new Swiper('.text-slider', {
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
		},
        loop: true,
        navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
        },
        spaceBetween: 0,
        slidesPerView: 1
    });
    

    /* Video Lightbox - Magnific Popup */
    $('.popup-youtube, .popup-vimeo').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        iframe: {
            patterns: {
                youtube: {
                    index: 'youtube.com/', 
                    id: function(url) {        
                        var m = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
                        if ( !m || !m[1] ) return null;
                        return m[1];
                    },
                    src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                },
                vimeo: {
                    index: 'vimeo.com/', 
                    id: function(url) {        
                        var m = url.match(/(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
                        if ( !m || !m[5] ) return null;
                        return m[5];
                    },
                    src: 'https://player.vimeo.com/video/%id%?autoplay=1'
                }
            }
        }
    });


    /* Details Lightbox - Magnific Popup */
	$('.popup-with-move-anim').magnificPopup({
		type: 'inline',
		fixedContentPos: false, /* keep it false to avoid html tag shift with margin-right: 17px */
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-slide-bottom'
	});
    
    
    /* Move Form Fields Label When User Types */
    // for input and textarea fields
    $("input, textarea").keyup(function(){
		if ($(this).val() != '') {
			$(this).addClass('notEmpty');
		} else {
			$(this).removeClass('notEmpty');
		}
    });


    /* Registration Form */
    $("#registrationForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            rformError();
            rsubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            rsubmitForm();
        }
    });

    function rsubmitForm() {
        // initiate variables with form content
		var name = $("#rname").val();
		var email = $("#remail").val();
		var phone = $("#rphone").val();
        var terms = $("#rterms").val();
        
        $.ajax({
            type: "POST",
            url: "php/registrationform-process.php",
            data: "name=" + name + "&email=" + email + "&phone=" + phone + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    rformSuccess();
                } else {
                    rformError();
                    rsubmitMSG(false, text);
                }
            }
        });
	}

    function rformSuccess() {
        $("#registrationForm")[0].reset();
        rsubmitMSG(true, "Request Submitted!");
        $("input").removeClass('notEmpty'); // resets the field label after submission
    }

    function rformError() {
        $("#registrationForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function rsubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#rmsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
    

    /* Newsletter Form */
    $("#newsletterForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            nformError();
            nsubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            nsubmitForm();
        }
    });

    function nsubmitForm() {
        // initiate variables with form content
		var email = $("#nemail").val();
        var terms = $("#nterms").val();
        $.ajax({
            type: "POST",
            url: "php/newsletterform-process.php",
            data: "email=" + email + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    nformSuccess();
                } else {
                    nformError();
                    nsubmitMSG(false, text);
                }
            }
        });
	}

    function nformSuccess() {
        $("#newsletterForm")[0].reset();
        nsubmitMSG(true, "Subscribed!");
        $("input").removeClass('notEmpty'); // resets the field label after submission
    }

    function nformError() {
        $("#newsletterForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function nsubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#nmsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }


    /* Contact Form */
    $("#contactForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            cformError();
            csubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            csubmitForm();
        }
    });

    function csubmitForm() {
        // Gather form data and send to Formspree via fetch
        var form = document.getElementById("contactForm");
        var formData = new FormData(form);
        var email = document.getElementById("cemail").value.trim();
        var name = document.getElementById("cname").value.trim();
        var message = document.getElementById("cmessage").value.trim();
        
        // Set reply-to to the user's email to avoid spam
        formData.set("_replyto", email);
        formData.set("_format", "plain");
        formData.set("_subject", "Motion Drivers Ed - Contact Form: " + name + " (" + email + ")");
        formData.set("_cc", "motiondriversed@gmail.com");
        formData.set("_to", "motiondriversed@gmail.com");
        
        // Update the hidden replyto field
        var replytoField = document.getElementById("replyto_email");
        if (replytoField) {
            replytoField.value = email;
        }
        
        // Update the subject field
        var subjectField = document.getElementById("form_subject");
        if (subjectField) {
            subjectField.value = "Motion Drivers Ed - Contact Form: " + name + " (" + email + ")";
        }
        
        // Set Content-Type header properly
        var headers = new Headers();
        headers.append("Accept", "application/json");

        fetch("https://formspree.io/f/mblnzjqq", {
            method: "POST",
            headers: headers,
            body: formData,
            mode: "cors"
        }).then(function(response) {
            if (response.ok) {
                cformSuccess();
            } else {
                return response.json().then(function(data) {
                    var msg = "Something went wrong. Please try again.";
                    if (data && data.errors) {
                        msg = data.errors.map(function(e) { return e.message; }).join(" ");
                    }
                    throw new Error(msg);
                });
            }
        }).catch(function(err) {
            cformError();
            csubmitMSG(false, err.message || "Something went wrong. Please try again.");
        });
	}

    function cformSuccess() {
        $("#contactForm")[0].reset();
        csubmitMSG(true, "Message sent! We'll be in touch soon.");
        $("input").removeClass('notEmpty'); // resets the field label after submission
        $("textarea").removeClass('notEmpty'); // resets the field label after submission
    }

    function cformError() {
        $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function csubmitMSG(valid, msg) {
        var $msg = $("#cmsgSubmit");
        if (valid) {
            $msg.removeClass().addClass("success-bubble").text(msg);
        } else {
            $msg.removeClass().addClass("error-text").text(msg);
        }
    }


    /* Privacy Form */
    $("#privacyForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            pformError();
            psubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            psubmitForm();
        }
    });

    function psubmitForm() {
        // initiate variables with form content
		var name = $("#pname").val();
		var email = $("#pemail").val();
        var select = $("#pselect").val();
        var terms = $("#pterms").val();
        
        $.ajax({
            type: "POST",
            url: "php/privacyform-process.php",
            data: "name=" + name + "&email=" + email + "&select=" + select + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    pformSuccess();
                } else {
                    pformError();
                    psubmitMSG(false, text);
                }
            }
        });
	}

    function pformSuccess() {
        $("#privacyForm")[0].reset();
        psubmitMSG(true, "Request Submitted!");
        $("input").removeClass('notEmpty'); // resets the field label after submission
    }

    function pformError() {
        $("#privacyForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function psubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#pmsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
    

    /* Back To Top Button */
    // create the back to top button
    $('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
    var amountScrolled = 700;
    $(window).scroll(function() {
        if ($(window).scrollTop() > amountScrolled) {
            $('a.back-to-top').fadeIn('500');
        } else {
            $('a.back-to-top').fadeOut('500');
        }
    });


	/* Removes Long Focus On Buttons */
	$(".button, a, button").mouseup(function() {
		$(this).blur();
	});

})(jQuery);


/* ============================================
   Motion Drivers Ed - Custom Functionality
   ============================================ */

// Function to handle all .btn-book clicks - CSP compliant (no inline scripts)
// Make setupBookButtons globally accessible for table generation script
window.setupBookButtons = function() {
    const buttons = document.querySelectorAll('.btn-book');
    
    // Log for debugging (can be removed in production)
    if (buttons.length === 0) {
        console.log('No .btn-book elements found');
        return;
    }
    
    buttons.forEach(btn => {
        // Check if already has listener
        if (btn.hasAttribute('data-listener-attached')) {
            return;
        }
        btn.setAttribute('data-listener-attached', 'true');
        
        // Use capture phase to ensure we catch the event early
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const d = this.dataset;
            
            // Try both camelCase and lowercase versions
            const serviceId = d.serviceId || d.serviceid;
            const serviceName = d.serviceName || d.servicename || 'Service';
            const servicePrice = d.servicePrice || d.serviceprice || '0';
            const squareUrl = d.squareUrl || d.squareurl || '';

            // Console log for debugging
            console.log('Button clicked - Extracted data attributes:', {
                serviceId: serviceId,
                serviceName: serviceName,
                servicePrice: servicePrice,
                squareUrl: squareUrl,
                fullDataset: d
            });

            if (!serviceId) {
                console.error('Missing service ID', d);
                alert('Error: Missing service information. Please try again.');
                return false;
            }

            // Ensure all values are strings and properly encoded
            const cleanId = String(serviceId).trim();
            const cleanName = String(serviceName).trim();
            const cleanPrice = String(servicePrice).trim();
            const cleanSquare = squareUrl ? String(squareUrl).trim() : '';

            // Validate that we have required values
            if (!cleanId || cleanId === 'undefined' || cleanId === 'null') {
                console.error('Invalid service ID:', cleanId);
                alert('Error: Invalid service information. Please try again.');
                return false;
            }

            // Use current page location as base to preserve subdirectory path
            const url = new URL('register.html', window.location.href);
            url.searchParams.set('id', cleanId);
            url.searchParams.set('name', cleanName);
            url.searchParams.set('price', cleanPrice);
            if (cleanSquare) {
                url.searchParams.set('square', cleanSquare);
            }

            // Console log final URL before redirect
            console.log('Navigating to register.html with URL:', url.toString());
            console.log('URL search params (individual):', {
                id: url.searchParams.get('id'),
                name: url.searchParams.get('name'),
                price: url.searchParams.get('price'),
                square: url.searchParams.get('square')
            });
            console.log('URL search string:', url.search);

            window.location.href = url.toString();
            return false;
        }, true);
    });
    
    // Log success (can be removed in production)
    console.log('Attached listeners to', buttons.length, 'button(s)');
};

// Setup function with retry mechanism for reliability
function initializeBookButtons() {
    // Always use DOMContentLoaded to ensure DOM is fully parsed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.setupBookButtons();
            // Retry after a short delay to catch any late-rendering elements
            setTimeout(window.setupBookButtons, 100);
        });
    } else {
        // DOM is already ready, setup immediately
        window.setupBookButtons();
        // Retry after a short delay as a safety net
        setTimeout(window.setupBookButtons, 100);
    }
}

// Initialize immediately
initializeBookButtons();

// Re-setup after dynamic content is added (for table rows)
const observer = new MutationObserver(function(mutations) {
    let shouldSetup = false;
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('btn-book')) {
                        shouldSetup = true;
                    } else if (node.querySelector && node.querySelector('.btn-book')) {
                        shouldSetup = true;
                    }
                }
            });
        }
    });
    if (shouldSetup) {
        // Call immediately and also with a small delay for safety
        window.setupBookButtons();
        setTimeout(window.setupBookButtons, 50);
    }
});

// Start observing immediately if body exists, otherwise wait for it
function startObserver() {
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        // Wait for body to exist
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObserver);
        } else {
            // Fallback: check again after a short delay
            setTimeout(startObserver, 50);
        }
    }
}

startObserver();


// Generate class schedule table
document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.getElementById('classRows');
    if (!tbody) {
        return; // Exit if table doesn't exist on this page
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Helper: Get first Monday of a given month/year
    const getFirstMonday = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const dayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon
        const diff = dayOfWeek === 1 ? 0 : (8 - dayOfWeek) % 7;
        return new Date(year, month, 1 + diff);
    };

    // Helper: Add days to a date
    const addDays = (date, days) => new Date(date.getTime() + days * 86400000);

    // Generate next 12 classes starting from *next month*
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11

    const classes = [];
    let year = currentYear;
    let month = currentMonth; // start from current month

    // Start from *next month* if we're past the first Monday
    const firstMondayThisMonth = getFirstMonday(year, month);
    if (today > firstMondayThisMonth) {
        month++;
        if (month > 11) { month = 0; year++; }
    }

    // Generate 12 future classes
    for (let i = 0; i < 12; i++) {
        const start = getFirstMonday(year, month);
        const end = addDays(start, 38); // 6 weeks = 42 days, minus weekends → ~38 days
        const permit = addDays(end, 2); // 2 days after end

        const isCurrentMonth = start.getMonth() === today.getMonth() && start.getFullYear() === today.getFullYear();
        const randomCurrentCapacity = Math.floor(Math.random() * (27 - 17 + 1)) + 17;
        const capacity = isCurrentMonth ? randomCurrentCapacity : 20;

        classes.push({ start, end, permit, capacity });

        // Next month
        month++;
        if (month > 11) { month = 0; year++; }
    }

    // Filter: only future classes, take first 5
    const upcoming = classes
        .filter(cls => cls.start >= today)
        .slice(0, 5);

    if (upcoming.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: #888;">
            No upcoming classes. New sessions start monthly!
        </td></tr>`;
        return;
    }

    // Format date
    const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    upcoming.forEach((cls, i) => {
        const startStr = fmt(cls.start);
        const endStr = fmt(cls.end);
        const permitStr = fmt(cls.permit);

        const isNext = i === 0;
        const status = isNext ? 'Filling Fast' : 'Available';
        const statusClass = isNext ? 'status-filling' : 'status-available';

        const id = `class-${cls.start.getMonth() + 1}-${cls.start.getFullYear()}`;
        const name = `Driver Education Class: ${startStr.split(', ')[0]} - ${endStr.split(', ')[0]}, ${cls.start.getFullYear()}`;

        // Console log for debugging table generation
        console.log('Generating table row:', {
            'data-service-id': id,
            'data-service-name': name,
            'data-service-price': '595',
            'data-square-url': 'https://square.link/u/hel5wnyU'
        });

        const row = document.createElement('tr');
        row.innerHTML = `
    <td data-label="Program">
        <strong>${startStr.split(', ')[0]} - ${endStr.split(', ')[0]}</strong>
        <div class="status-badge ${statusClass}">${status}</div>
    </td>
    <td data-label="Price"><div class="price">595</div></td>
    <td data-label="Capacity">
        <span class="capacity">
            <i class="fas fa-user-friends"></i>
            ${cls.capacity} Students
        </span>
    </td>
    <td data-label="Permit Test"><span class="permit-date">${permitStr}</span></td>
    <td data-label="Action">
        <a href="register.html" class="btn-solid-reg btn-book"
           data-service-id="${id}"
           data-service-name="${name}"
           data-service-price="595"
           data-square-url="https://square.link/u/hel5wnyU">
           Register
        </a>
    </td>
`;
        tbody.appendChild(row);
    });

    // Re-attach Register button handler after table is populated
    // The MutationObserver will handle this, but we'll also call it directly for immediate setup
    setTimeout(function() {
        if (typeof window.setupBookButtons === 'function') {
            window.setupBookButtons();
        }
    }, 100);
});
