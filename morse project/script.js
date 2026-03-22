// Standard Morse dictionary (Latin letters + digits)
const MORSE_CODE = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".",
  "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---",
  "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---",
  "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-",
  "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--",
  "Z": "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----."
};

const reverseDict = Object.fromEntries(Object.entries(MORSE_CODE).map(([k,v]) => [v,k]));

let mode = "text-to-morse";
let theme = "light";

function toggleMode() {
  const inputBox = document.getElementById("inputText");
  const outputBox = document.getElementById("outputBox");

  if (mode === "text-to-morse") {
    mode = "morse-to-text";
    document.getElementById("leftTitle").innerText = "MORSE";
    document.getElementById("rightTitle").innerText = "TEXT";
    document.getElementById("modeLabel").innerText = "Morse → Text";
  } else {
    mode = "text-to-morse";
    document.getElementById("leftTitle").innerText = "TEXT";
    document.getElementById("rightTitle").innerText = "MORSE";
    document.getElementById("modeLabel").innerText = "Text → Morse";
  }

  inputBox.value = outputBox.value;
  convert(); // re-run conversion immediately
}

function convert() {
  const input = document.getElementById("inputText").value.trim();

  if (mode === "text-to-morse") {
    // Encode text → Morse
    const morse = input.toUpperCase().split("").map(ch => {
      return MORSE_CODE[ch] || "";
    }).join(" "); // space between letters
    document.getElementById("outputBox").value = morse;
  } else {
    // Decode Morse → Text
    const codes = input.split(/\s+/); // split by spaces
    const text = codes.map(code => reverseDict[code] || "").join("");
    document.getElementById("outputBox").value = text;
  }
}

function playInput() {
  const input = document.getElementById("inputText").value.trim();
  if (!input) return;
  const utterance = new SpeechSynthesisUtterance(input);
  speechSynthesis.speak(utterance);
}

function playOutput() {
  const output = document.getElementById("outputBox").value.trim();
  if (!output) return;

  const waveformEl = document.getElementById("waveform");
  const freqEl = document.getElementById("frequency");
  const wpmEl = document.getElementById("wpm");

  const waveform = waveformEl ? waveformEl.value.toLowerCase() : "sine";
  const freq = freqEl ? parseInt(freqEl.value) : 700;
  const wpm = wpmEl ? parseInt(wpmEl.value) : 20;

  const dotDuration = 1200 / wpm;
  const dashDuration = dotDuration * 3;
  const gap = dotDuration;
  const wordGap = dotDuration * 7;

  if (/^[.\- ]+$/.test(output)) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let time = ctx.currentTime;
    output.split("").forEach(symbol => {
      if (symbol === ".") {
        beep(ctx, time, dotDuration/1000, freq, waveform);
        time += (dotDuration+gap)/1000;
      } else if (symbol === "-") {
        beep(ctx, time, dashDuration/1000, freq, waveform);
        time += (dashDuration+gap)/1000;
      } else if (symbol === " ") {
        time += wordGap/1000;
      }
    });
  } else {
    const utterance = new SpeechSynthesisUtterance(output);
    speechSynthesis.speak(utterance);
  }
}

function beep(ctx, startTime, duration, freq, waveform) {
  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = freq;
  osc.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function copyOutput() {
  const output = document.getElementById("outputBox").value;
  navigator.clipboard.writeText(output).then(() => {
    alert("Output copied to clipboard!");
  });
}

function toggleTheme() {
  const body = document.body;
  if (theme === "light") {
    body.classList.add("dark-theme");
    theme = "dark";
  } else {
    body.classList.remove("dark-theme");
    theme = "light";
  }
}
