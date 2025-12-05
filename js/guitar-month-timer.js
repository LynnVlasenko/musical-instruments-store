// Guitar of the Month countdown timer
export function initGuitarMonthTimer() {
  const timer = document.querySelector('.guitar-month__timer');
  if (!timer) return; // nothing to do

  const numberEls = Array.from(timer.querySelectorAll('.timer__number'));

  // Try to read ISO deadline from `data-deadline` attribute on the timer.
  // Example: <div class="guitar-month__timer timer" data-deadline="2025-12-31T23:59:59Z">...
  const deadlineAttr = timer.dataset.deadline;
  let deadline = null;

  if (deadlineAttr) {
    const parsed = new Date(deadlineAttr);
    if (!isNaN(parsed)) deadline = parsed;
  }

  // Fallback: 30 days from now
  if (!deadline) {
    deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  let intervalId = null;

  function pad(n) {
    return n.toString().padStart(2, '0');
  }

  function update() {
    const now = new Date();
    let diff = Math.max(0, deadline - now);

    if (diff <= 0) {
      // expired — set all to zero and stop
      if (numberEls[0]) numberEls[0].textContent = '0';
      if (numberEls[1]) numberEls[1].textContent = '00';
      if (numberEls[2]) numberEls[2].textContent = '00';
      if (numberEls[3]) numberEls[3].textContent = '00';
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 24 * 60 * 60 * 1000;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 60 * 60 * 1000;
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 60 * 1000;
    const seconds = Math.floor(diff / 1000);

    if (numberEls[0]) numberEls[0].textContent = String(days);
    if (numberEls[1]) numberEls[1].textContent = pad(hours);
    if (numberEls[2]) numberEls[2].textContent = pad(minutes);
    if (numberEls[3]) numberEls[3].textContent = pad(seconds);
  }

  // Run immediately and then every second
  update();
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(update, 1000);
}
