#tool #accessibility
<!-- nr -->

```python
import soundfile as sf
import numpy as np
import librosa
import parselmouth
from parselmouth.praat import call

import os
import sys
import pyttsx3
import re
from pathlib import Path
from elevenlabs import ElevenLabs, VoiceSettings
import io
from pydub import AudioSegment
from pydub.playback import play
import datetime
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Disable SSL warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def make_effect(y, sr):
    # Save the input audio to a temporary WAV file
    temp_input_file = "temp_input.wav"
    sf.write(temp_input_file, y, sr)

    # Load the audio with Parselmouth
    sound = parselmouth.Sound(temp_input_file)

    # Create a manipulation object
    manipulation = call(sound, "To Manipulation", 0.01, 75, 600)

    # Extract pitch tier
    pitch_tier = call(manipulation, "Extract pitch tier")

    # Multiply frequencies (adjust the 1.3 factor as needed)
    call(pitch_tier, "Multiply frequencies", sound.xmin, sound.xmax, 1.3)

    # Replace pitch tier
    call([pitch_tier, manipulation], "Replace pitch tier")

    # Get resynthesis
    sound_higher_pitch = call(manipulation, "Get resynthesis (overlap-add)")

    # Save the processed audio to a temporary WAV file
    temp_output_file = "temp_output.wav"
    sound_higher_pitch.save(temp_output_file, "WAV")

    # Read the processed audio back into numpy array
    y_processed, sr = librosa.load(temp_output_file, sr=sr)

    # Clean up temporary files
    os.remove(temp_input_file)
    os.remove(temp_output_file)

    formant_shift = 1.12  # Slight shift, adjust as needed
    y = np.interp(np.arange(0, len(y), formant_shift), np.arange(0, len(y)), y)

    # Additional processing steps
    # Soft clipping to reduce harshness
    y_processed = np.tanh(y_processed * 5) / 5

    # Dynamic range compression
    y_processed = np.sign(y_processed) * np.log1p(np.abs(y_processed) * 5) / 5

    # Normalize audio
    # y_processed = librosa.util.normalize(y_processed)

    return y_processed

def intelligent_replace(text):
    replacements = {
        '```': 'code block symbol',
        '~~': 'strikethrough',
        '^': 'superscript',
        '[[': 'internal link start',
        ']]': 'internal link end',
        '![[': 'embed start',
        ']]': 'embed end',
        '- [ ]': 'unchecked checkbox',
        '- [x]': 'checked checkbox',
        '!=': 'not equal',
        '<=': 'smaller than or equal',
        '>=': 'bigger than or equal',
        '<': 'smaller than',
        '>': 'bigger than',
        '""': 'empty string',
    }
    
    single_char_replacements = {
        ',': 'comma',
        '.': 'dot',
        '!': 'exclamation mark',
        '?': 'question mark',
        ':': 'colon',
        ';': 'semicolon',
        '(': 'opening parenthesis',
        ')': 'closing parenthesis',
        '[': 'opening bracket',
        ']': 'closing bracket',
        '{': 'opening brace',
        '}': 'closing brace',
        '*': 'asterisk',
        '#': 'hash',
        '@': 'at sign',
        '&': 'ampersand',
        '%': 'percent',
        '$': 'dollar sign',
        '=': 'equals sign',
        '+': 'plus',
        '-': 'minus',
        '/': 'slash',
        '\\': 'backslash',
        '|': 'vertical bar',
        '~': 'tilde',
        '^': 'caret',
        '_': 'underscore',
    }
    
    if len(text.strip()) == 1:
        return single_char_replacements.get(text.strip(), text)
    
    for pattern, replacement in replacements.items():
        text = text.replace(pattern, replacement)
    
    # Replace headers
    text = re.sub(r'^(#{1,6})\s', lambda m: f"Header {len(m.group(1))} ", text, flags=re.MULTILINE)
    
    return text

def count_empty_lines(lines, current_line, direction):
    count = 0
    start = current_line + direction
    end = len(lines) if direction > 0 else -1
    step = direction

    for i in range(start, end, step):
        if lines[i].strip() == "":
            count += 1
        else:
            break
    return count

def tts_speak(text):
	openai_speak(text)
	return
    engine = pyttsx3.init()
    engine.setProperty('rate', 200)  # Increase speed (default is 200)
    engine.say(intelligent_replace(text))
    engine.runAndWait()

obs_vault = os.environ.get('OBS_VAULT')
import sys
sys.path.append(os.path.join(obs_vault, "Scripts"))
sys.path.append(os.path.join(obs_vault, "Modules"))

import myapikeys
elevenlabs_key = myapikeys.elevenlabs

client = ElevenLabs(
    api_key = elevenlabs_key,
)

def elevenlabs_speak(input_text, save_locally=False):
    audio_stream = client.text_to_speech.convert_as_stream(
        voice_id="eKdP9CXLg7mIekUdVeyv",
        optimize_streaming_latency="0",
        output_format="mp3_22050_32",
        text=input_text,
        voice_settings=VoiceSettings(
            stability=0.3,
            similarity_boost=0.8,
            style=0,
        ),
    )

    # Read all data from the generator and concatenate into a single bytes object
    audio_data = b''.join(chunk for chunk in audio_stream)
    
    if save_locally:
        # Generate a filename based on current date and time
        current_time = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"audio_{current_time}.mp3"
        
        # Save the audio file
        with open(filename, 'wb') as f:
            f.write(audio_data)
        print(f"Audio saved to local file: {filename}")
    
    # Convert the bytes to a BytesIO object
    audio_bytes = io.BytesIO(audio_data)
    
    # Load the audio using pydub
    audio_segment = AudioSegment.from_mp3(audio_bytes)
    
    # Play the audio
    play(audio_segment)


def openai_speak(text, save_locally=False, effect=True):
    OPENAI_API_KEY = myapikeys.openai

    url = "https://api.openai.com/v1/audio/speech"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "tts-1",
        "input": text,
        "voice": "nova"
    }

	response = requests.post(url, json=data, headers=headers, verify=False)

    if response.status_code != 200:
        raise Exception(f"OpenAI API request failed with status {response.status_code}")

    audio_content = response.content
    
    if effect:
        # Load the audio content
        y, sr = librosa.load(io.BytesIO(audio_content), sr=None)
        
        # Apply the voice effect
        y_effect = make_effect(y, sr)
        
        # Convert the modified audio to WAV format
        buffer = io.BytesIO()
        sf.write(buffer, y_effect, sr, format='wav')
        buffer.seek(0)
        audio_content = buffer.getvalue()
    
    if save_locally:
        # Generate a filename based on current date and time
        current_time = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"audio_{current_time}.wav"
        
        # Save the audio file
        with open(filename, 'wb') as f:
            f.write(audio_content)
        print(f"Audio saved to local file: {filename}")
    
    # Convert the bytes to a BytesIO object
    audio_bytes = io.BytesIO(audio_content)
    
    # Load the audio using pydub
    audio_segment = AudioSegment.from_wav(audio_bytes) if effect else AudioSegment.from_mp3(audio_bytes)
    
    # Play the audio
    play(audio_segment)



if __name__ == "__main__":

    vault_path = os.environ.get('vaultPath')
    file_path = os.environ.get('filePath')
    selected_text = os.environ.get('selectedText')
    line_number = int(os.environ.get('lineNumber', 1)) - 1  # Convert to 0-based index
    
    if selected_text:
        tts_speak(selected_text)
    else:
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        current_line = lines[line_number].strip() if line_number < len(lines) else ""
        
        if current_line:
            tts_speak(current_line)
        else:
            up_count = count_empty_lines(lines, line_number, -1)
            down_count = count_empty_lines(lines, line_number, 1)
            tts_speak(f"Empty. up {up_count}, down {down_count}")

```

# Resource

https://github.com/YannickJadoul/Parselmouth
https://parselmouth.readthedocs.io/en/stable/examples/pitch_manipulation.html
