import numpy as np
import json

# Parameters for sound generation
duration = 5  # Duration of the sound in seconds
sample_rate = 44100  # Samples per second (standard audio sample rate)
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)  # Time array

# Generate a sine wave with varying frequency (e.g., from 100 Hz to 1000 Hz)
frequencies = np.linspace(100, 1000, len(t))  # Vary frequency over time
sound_wave = np.sin(2 * np.pi * frequencies * t)  # Generate sine wave with varying frequency

# Perform FFT to extract frequency components
def get_frequencies(sound_wave, sample_rate):
    fft_data = np.fft.fft(sound_wave)
    fft_freqs = np.fft.fftfreq(len(fft_data), 1/sample_rate)
    
    # Use only positive frequencies (first half of the FFT result)
    positive_freqs = fft_freqs[:len(fft_freqs)//2]
    positive_fft_data = np.abs(fft_data[:len(fft_data)//2])

    return positive_freqs, positive_fft_data

# Generate sand pattern based on frequency data
def generate_sand_pattern(frequencies, fft_data, grid_size=50):
    sand_data = []
    for i, freq in enumerate(frequencies):
        if fft_data[i] > 1000:  # Threshold for significant frequencies
            # Create a pattern based on frequency
            x = (i % grid_size) / grid_size  # Normalize to grid
            y = (i // grid_size) / grid_size  # Normalize to grid
            z = np.sin(freq * np.pi) * 0.05  # Simple sine wave pattern for Z (height)
            sand_data.append({"x": x, "y": y, "z": z})

    return sand_data

# Get the frequencies and sand pattern
frequencies, fft_data = get_frequencies(sound_wave, sample_rate)
sand_data = generate_sand_pattern(frequencies, fft_data)

# Save to JSON (for React to use)
with open("sand_pattern.json", "w") as file:
    json.dump(sand_data, file)
print("✅ Sand pattern data generated and saved to sand_pattern.json!")
