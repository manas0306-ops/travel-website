/**
 * VoyageX — Contact Form Validation & FAQ Accordion
 * Accessible client-side validation, error handling, simulated async submission,
 * and interactive FAQ toggles.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFaqAccordion();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');
  const responseBox = document.getElementById('contact-response-message');

  // Real-time validation on input
  if (nameInput) nameInput.addEventListener('input', () => validateField(nameInput, val => val.trim().length >= 2, 'Please enter at least 2 characters.'));
  if (emailInput) emailInput.addEventListener('input', () => validateField(emailInput, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address.'));
  if (subjectInput) subjectInput.addEventListener('input', () => validateField(subjectInput, val => val.trim().length >= 3, 'Please specify a subject.'));
  if (messageInput) messageInput.addEventListener('input', () => validateField(messageInput, val => val.trim().length >= 10, 'Message must be at least 10 characters long.'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, val => val.trim().length >= 2, 'Please enter at least 2 characters.');
    const isEmailValid = validateField(emailInput, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address.');
    const isSubjectValid = validateField(subjectInput, val => val.trim().length >= 3, 'Please specify a subject.');
    const isMessageValid = validateField(messageInput, val => val.trim().length >= 10, 'Message must be at least 10 characters long.');

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      if (typeof showToast === 'function') {
        showToast('Please fix the errors in the form before submitting.', 'warning');
      }
      return;
    }

    // Simulate async submission
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳ Sending your message...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      const travelerName = nameInput.value.trim();
      form.reset();

      // Clear valid classes
      [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
        inp.classList.remove('is-valid');
      });

      if (responseBox) {
        responseBox.style.display = 'block';
        responseBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1.5px solid var(--success); border-radius: var(--radius-md); padding: 16px 20px; color: var(--text-primary); margin-top: 20px; animation: slideInRight 0.3s ease;">
            <div style="display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--success); margin-bottom: 6px;">
              <span>✓ Message Delivered!</span>
            </div>
            <p style="margin: 0; font-size: 0.92rem;">
              Thank you, <strong>${travelerName}</strong>! Our 24/7 travel concierge team has received your note and will get back to you within 24 hours.
            </p>
          </div>
        `;
      }

      if (typeof showToast === 'function') {
        showToast(`Thank you, ${travelerName}! Your inquiry has been sent.`, 'success');
      }
    }, 1200);
  });
}

function validateField(inputElement, validationFn, errorMsg) {
  if (!inputElement) return false;
  const val = inputElement.value;
  const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
  let errorDisplay = formGroup.querySelector('.field-error-msg');

  if (!errorDisplay) {
    errorDisplay = document.createElement('div');
    errorDisplay.className = 'field-error-msg';
    errorDisplay.style.color = 'var(--danger)';
    errorDisplay.style.fontSize = '0.78rem';
    errorDisplay.style.marginTop = '4px';
    errorDisplay.style.fontWeight = '600';
    formGroup.appendChild(errorDisplay);
  }

  const isValid = validationFn(val);
  if (!isValid) {
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');
    errorDisplay.textContent = errorMsg;
    errorDisplay.style.display = 'block';
    return false;
  } else {
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    errorDisplay.style.display = 'none';
    return true;
  }
}

// --- FAQ ACCORDION ---
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Close other open accordions
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}
