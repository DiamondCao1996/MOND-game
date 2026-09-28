(() => {
  'use strict';
  const key = 'mond-care-v1';
  let saved = {seeds: 0, visits: 0};
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (value && Number.isSafeInteger(value.seeds) && value.seeds >= 0 && Number.isSafeInteger(value.visits) && value.visits >= 0) saved = value;
  } catch {}
  let popup, lastMessage = 0, summary = null, previousRmssd = null, trend = 'steady', activity = null, started = 0, audio;
  const button = document.createElement('button');
  button.id = 'mond-care-open'; button.textContent = 'Visit your bunny';
  const panel = document.createElement('dialog'); panel.id = 'mond-care';
  panel.innerHTML = `<button id="care-close" aria-label="Close care visit">×</button>
    <h2>A little time together</h2><p>Your bunny is glad you’re here.</p>
    <div class="care-scene"><img id="care-bunny" alt="Your bunny companion"><span id="care-garden" aria-label="Your growing garden"></span></div>
    <p id="care-response" role="status"></p>
    <label>How are you feeling? <select id="care-mood"><option value="">Skip for now</option><option value="overwhelmed">Overwhelmed</option><option value="tired">Tired</option><option value="settled">Settled</option><option value="curious">Curious</option></select></label>
    <p id="care-suggestion"></p><div class="care-actions"><button data-care="rest">Rest by the pond</button><button data-care="music">Make music</button><button data-care="garden">Tend the garden</button></div>
    <div id="care-play"></div><button id="care-finish" hidden>Leave a seed growing</button>
    <p id="care-progress"></p><details><summary>Connect your sensor</summary><p>Start recording in the Mac app, then connect here. Keep the connection window open. You can also enjoy every activity without a sensor.</p><button id="care-connect">Connect Mac app</button><button id="care-disconnect">Disconnect</button><p id="care-signal" role="status">Playing without a sensor.</p></details>`;
  document.body.append(button, panel);
  const $ = id => panel.querySelector('#' + id);
  $('care-bunny').src = window.BUNNY_ASSETS?.['mond-bunny.png'] || '';
  function persist() {
    try {localStorage.setItem(key, JSON.stringify(saved));} catch { $('care-progress').textContent += ' Progress is available for this visit only; browser storage is unavailable.'; }
  }
  function render() {
    const mood = $('care-mood').value;
    const ready = summary?.quality === 'ready' && Date.now() - lastMessage < 8000;
    const gentle = mood === 'overwhelmed' || mood === 'tired';
    // Fictional behavior is separate from physiology. Check-in always wins.
    const response = gentle ? 'Your bunny brings a blanket and settles beside you.' : mood === 'curious' ? 'Your bunny tilts an ear toward the garden.' : 'Your bunny nestles beside the lantern.';
    $('care-response').textContent = response;
    $('care-suggestion').textContent = gentle ? 'Perhaps a quiet rest? You can choose any activity.' : mood === 'curious' ? 'Perhaps tend the garden together? You can choose any activity.' : !mood && ready && trend === 'lower' ? 'A quiet moment is available, if you would like one.' : 'Rest, play a few notes, or tend a little patch together.';
    panel.classList.toggle('care-curious', mood === 'curious');
    panel.style.setProperty('--care-glow', ready ? (trend === 'lower' ? '.28' : '.42') : '.35');
    $('care-garden').textContent = '🌱'.repeat(Math.min(saved.seeds, 3)) + (saved.seeds >= 3 ? ' 🌸' : '') + (saved.seeds >= 7 ? ' ✨' : '');
    $('care-progress').textContent = `${saved.seeds} seeds · ${saved.visits} shared moments. ${saved.seeds >= 7 ? 'Fireflies have found a home in your garden.' : saved.seeds >= 3 ? 'Your first flowers have opened.' : 'Every shared moment leaves something growing.'}`;
    if (lastMessage) $('care-signal').textContent = Date.now() - lastMessage >= 8000 ? 'Sensor disconnected. Your garden is safe; keep playing.' : `${summary.source === 'simulation' ? 'Demo data · ' : summary.source === 'replay' ? 'Recorded data · ' : ''}${ready ? 'Usable reading. Small changes in lantern light follow the session.' : summary.quality === 'warming' ? 'Gathering a reading. Your bunny is here while you wait.' : 'Waiting for a reliable reading. All activities remain available.'}`;
  }
  button.onclick = () => { window.dispatchEvent(new Event("mond-care-open")); panel.showModal(); render(); };
  function stopActivity() {activity = null; $('care-play').replaceChildren(); $('care-finish').hidden = true; if(audio) audio.suspend();}
  $('care-close').onclick = () => panel.close();
  panel.addEventListener('close', stopActivity);
  // Keep the adventure keyboard controls from firing behind this modal.
  panel.addEventListener('keydown', e => e.stopPropagation());
  panel.addEventListener('keyup', e => e.stopPropagation());
  $('care-mood').onchange = render;
  function note(frequency) {
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume();
      const oscillator = audio.createOscillator(), gain = audio.createGain(), now = audio.currentTime;
      oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.09, now + .03); gain.gain.exponentialRampToValueAtTime(.0001, now + 1.2);
      oscillator.connect(gain).connect(audio.destination); oscillator.start(now); oscillator.stop(now + 1.3);
    } catch { $('care-response').textContent = 'We can enjoy a quiet moment together, too.'; }
  }
  panel.querySelectorAll('[data-care]').forEach(b => b.onclick = () => {
    stopActivity(); activity = b.dataset.care; started = Date.now();
    $('care-finish').hidden = false; $('care-finish').disabled = true;
    if(activity === 'rest') $('care-play').textContent = 'Sit beside the pond. There is nothing you need to change. Stay for a quiet moment, as you are.';
    if(activity === 'music') {
      [ ['C',261.63], ['E',329.63], ['G',392] ].forEach(([label, hz]) => {const n = document.createElement('button'); n.textContent = label; n.onclick = () => note(hz); $('care-play').append(n);});
    }
    if(activity === 'garden') {
      const water = document.createElement('button'); water.textContent = 'Water our little patch'; water.onclick = () => {water.textContent = 'The soil is watered. A little care is enough.'; water.disabled = true;}; $('care-play').append(water);
    }
  });
  $('care-finish').onclick = () => {
    if(!activity || Date.now() - started < 10000) return;
    saved.seeds++; saved.visits++; stopActivity(); render(); persist();
    $('care-response').textContent = 'Thank you for spending time together. A seed is growing, whatever kind of day this is.';
  };
  $('care-connect').onclick = () => {
    popup = window.open('http://localhost:8765/mond', 'mond-sensor', 'popup,width=460,height=360');
    $('care-signal').textContent = popup ? 'Connecting… If the window cannot open, start the Mac app’s Live view and try again.' : 'Allow the connection window in your browser, then try again.';
  };
  $('care-disconnect').onclick = () => {popup?.close(); popup = null; lastMessage = 0; summary = null; previousRmssd = null; trend = 'steady'; $('care-signal').textContent = 'Playing without a sensor.'; render();};
  addEventListener('message', e => {
    if(e.origin !== 'http://localhost:8765' || !popup || e.source !== popup) return;
    const d = e.data;
    if(d?.type !== 'mond-session' || d.version !== 1 || !['ready','warming','unreliable','unavailable'].includes(d.quality)) return;
    if(d.quality === 'ready') {
      const rmssd = d.measurements?.rmssd_ms;
      if(!Number.isFinite(rmssd) || rmssd <= 0) return;
      trend = previousRmssd && rmssd < previousRmssd * .95 ? 'lower' : 'steady'; previousRmssd = rmssd;
    } else { previousRmssd = null; trend = 'steady'; }
    summary = d; lastMessage = Date.now(); render();
  });
  setInterval(() => {
    if(popup && !popup.closed) popup.postMessage({type:'mond-connect'}, 'http://localhost:8765');
    if(activity) $('care-finish').disabled = Date.now() - started < 10000;
    if(lastMessage && Date.now() - lastMessage >= 8000) render();
  }, 1000);
  render();
})();
