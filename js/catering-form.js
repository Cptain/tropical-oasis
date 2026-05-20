(function () {
  var cateringForm = document.querySelector('.catering-form');
  if (cateringForm) {
    var dateInput    = document.getElementById('catering-date');
    var nameInput    = document.getElementById('catering-name');
    var emailInput   = document.getElementById('catering-email');
    var phoneLocal   = document.getElementById('catering-phone-local');
    // Date: set min and default value to today
    if (dateInput) {
      var todayStr = new Date().toISOString().split('T')[0];
      dateInput.min = todayStr;
      dateInput.value = todayStr;
    }
    // Auto-format phone as (XXX) XXX-XXXX
    if (phoneLocal) {
      phoneLocal.addEventListener('input', function () {
        var digits = phoneLocal.value.replace(/\D/g, '').slice(0, 10);
        var formatted = '';
        if (digits.length > 6)      formatted = '(' + digits.slice(0,3) + ') ' + digits.slice(3,6) + '-' + digits.slice(6);
        else if (digits.length > 3) formatted = '(' + digits.slice(0,3) + ') ' + digits.slice(3);
        else if (digits.length > 0) formatted = '(' + digits;
        phoneLocal.value = formatted;
      });
    }
    // --- Inline error helpers ---
    function getErrorSpan(input) {
      var field = input.closest('.catering-form__field') || input.parentNode;
      var span = field.querySelector('.catering-form__error');
      if (!span) {
        span = document.createElement('span');
        span.className = 'catering-form__error';
        span.setAttribute('aria-live', 'polite');
        field.appendChild(span);
      }
      return span;
    }
    function showError(input, msg) {
      if (!input) return;
      getErrorSpan(input).textContent = msg;
      input.classList.toggle('catering-form__input--error', !!msg);
    }
    // --- Validation logic (returns error string or '') ---
    function validateName() {
      if (!nameInput) return '';
      var val = nameInput.value.trim();
      if (!val) return 'Name is required.';
      if (!/^[A-Za-z\u00C0-\u024F\s'.\-]{2,}$/.test(val)) return 'Please enter a valid name (letters only, min 2 characters).';
      return '';
    }
    function validateEmail() {
      if (!emailInput) return '';
      var val = emailInput.value.trim();
      if (!val) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return 'Please enter a valid email address.';
      return '';
    }
    function validatePhone() {
      if (!phoneLocal) return '';
      var val = phoneLocal.value.trim();
      if (!val) return 'Phone number is required.';
      if (val.replace(/\D/g, '').length !== 10) return 'Please enter a valid 10-digit phone number.';
      return '';
    }
    function validateDate() {
      if (!dateInput || !dateInput.value) return '';
      var now = new Date();
      var today = now.toISOString().split('T')[0];
      var currentYear = now.getFullYear();
      var enteredYear = parseInt(dateInput.value.split('-')[0], 10);
      if (dateInput.value < today) return 'Please select a future date.';
      if (enteredYear !== currentYear && enteredYear !== currentYear + 1) {
        return 'Please select a date in ' + currentYear + ' or ' + (currentYear + 1) + '.';
      }
      return '';
    }
    // --- Real-time validation: show immediately on input ---
    function wireValidation(input, validateFn) {
      if (!input) return;
      input.addEventListener('blur', function () {
        showError(input, validateFn());
      });
      input.addEventListener('input', function () {
        showError(input, validateFn());
      });
    }
    wireValidation(nameInput,  validateName);
    wireValidation(emailInput, validateEmail);
    wireValidation(phoneLocal, validatePhone);
    wireValidation(dateInput,  validateDate);
    // --- Custom number spinner buttons ---
    var guestsInput = document.getElementById('catering-guests');
    var spinUp   = cateringForm.querySelector('.catering-form__spin--up');
    var spinDown = cateringForm.querySelector('.catering-form__spin--down');
    if (guestsInput && spinUp) {
      spinUp.addEventListener('click', function () { guestsInput.stepUp(); });
    }
    if (guestsInput && spinDown) {
      spinDown.addEventListener('click', function () { guestsInput.stepDown(); });
    }
    // --- Calendar picker trigger ---
    var dateTriggerBtn = cateringForm.querySelector('.catering-form__date-btn');
    if (dateTriggerBtn && dateInput) {
      dateTriggerBtn.addEventListener('click', function () {
        dateInput.focus();
        try { dateInput.showPicker(); } catch (ex) {}
      });
    }
    var submitBtn = cateringForm.querySelector('[type="submit"]');
    var originalHTML = submitBtn.innerHTML;
    var checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-left:8px"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    function launchBtnConfetti(btn) {
      var rect = btn.getBoundingClientRect();
      var pad = 24;
      var canvas = document.createElement('canvas');
      canvas.width  = rect.width  + pad * 2;
      canvas.height = rect.height + pad * 2;
      canvas.style.cssText = 'position:fixed;top:' + (rect.top - pad) + 'px;left:' + (rect.left - pad) + 'px;width:' + canvas.width + 'px;height:' + canvas.height + 'px;pointer-events:none;z-index:9999;';
      document.body.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var colors = ['#f0a827', '#e8622a', '#f5ddc0', '#ffffff', '#6e2d5e'];
      var particles = Array.from({ length: 22 }, function () {
        return {
          x: pad + Math.random() * rect.width,
          y: pad + rect.height * (0.4 + Math.random() * 0.6),
          vx: (Math.random() - 0.5) * 2.5,
          vy: -(2.5 + Math.random() * 3.5),
          color: colors[Math.floor(Math.random() * colors.length)],
          w: 4 + Math.random() * 4, h: 2 + Math.random() * 3,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          alpha: 1
        };
      });
      var start = Date.now();
      (function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var elapsed = Date.now() - start;
        var alive = false;
        particles.forEach(function (p) {
          p.x += p.vx; p.y += p.vy; p.vy += 0.1;
          p.rotation += p.rotSpeed;
          p.alpha = Math.max(0, 1 - elapsed / 1600);
          if (p.alpha > 0) alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });
        if (alive) requestAnimationFrame(frame);
        else canvas.remove();
      }());
    }
    cateringForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Validate all fields and show any errors before submitting
      var nameErr  = validateName();
      var emailErr = validateEmail();
      var phoneErr = validatePhone();
      var dateErr  = validateDate();
      showError(nameInput,  nameErr);
      showError(emailInput, emailErr);
      showError(phoneLocal, phoneErr);
      showError(dateInput,  dateErr);
      if (nameErr || emailErr || phoneErr || dateErr) return;
      function handleSuccess() {
        cateringForm.reset();
        submitBtn.innerHTML = 'Request Sent' + checkIcon;
        submitBtn.classList.add('btn--success');
        submitBtn.disabled = true;
        launchBtnConfetti(submitBtn);
        setTimeout(function () {
          submitBtn.innerHTML = originalHTML;
          submitBtn.classList.remove('btn--success');
          submitBtn.disabled = false;
        }, 10000);
      }
      // No Netlify backend when running locally — simulate success
      var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';
      if (isLocal) { handleSuccess(); return; }
      var data = new URLSearchParams(new FormData(cateringForm)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('Submission failed (' + response.status + ')');
        }
        handleSuccess();
      }).catch(function () {
        alert('Something went wrong. Please try again.');
      });
    });
  }
})();
