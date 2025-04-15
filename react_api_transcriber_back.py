from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os

app = Flask(__name__)
CORS(app)  # React 연동을 위해 CORS 허용

model = whisper.load_model("large")  # 서버 실행 시 1회만 로드

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    audio = request.files['audio']
    audio_path = os.path.join("voice", audio.filename)
    audio.save(audio_path)

    result = model.transcribe(audio_path, language="Korean", word_timestamps=True)

    return jsonify({
        'text': result['text'],
        'segments': result['segments']
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
