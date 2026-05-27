import tkinter as tk
import winsound
import time
import threading

# Morse code dictionary
MORSE_CODE = {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".",
    "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---",
    "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---",
    "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-",
    "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--",
    "Z": "--..", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    "0": "-----", " ": " "
}

# Timing (ms)
DOT = 150
DASH = DOT * 3
GAP = DOT
LETTER_GAP = DOT * 3
WORD_GAP = DOT * 7

def play_morse(message, output_box):
    output_box.delete("1.0", tk.END)  # clear previous text
    for char in message.upper():
        if char not in MORSE_CODE:
            continue
        code = MORSE_CODE[char]
        
        # Show Morse code for this character
        output_box.insert(tk.END, f"{char} : {code}\n")
        output_box.see(tk.END)
        
        if code == " ":
            time.sleep(WORD_GAP / 1000.0)
            continue
        
        for symbol in code:
            if symbol == ".":
                winsound.Beep(700, DOT)
            elif symbol == "-":
                winsound.Beep(700, DASH)
            time.sleep(GAP / 1000.0)
        
        time.sleep(LETTER_GAP / 1000.0)

def start_conversion(entry, output_box):
    text = entry.get()
    if not text:
        output_box.insert(tk.END, "⚠️ Please type something!\n")
        return
    # Run in another thread so GUI doesn’t freeze
    threading.Thread(target=play_morse, args=(text, output_box), daemon=True).start()

# GUI setup
root = tk.Tk()
root.title("Morse Code Converter")

frame = tk.Frame(root, padx=10, pady=10)
frame.pack()

label = tk.Label(frame, text="Enter Text:")
label.pack()

entry = tk.Entry(frame, width=40, font=("Arial", 14))
entry.pack(pady=5)

convert_btn = tk.Button(frame, text="Convert to Morse", command=lambda: start_conversion(entry, output_box))
convert_btn.pack(pady=5)

output_box = tk.Text(frame, height=15, width=50, font=("Courier", 12))
output_box.pack()

root.mainloop()
