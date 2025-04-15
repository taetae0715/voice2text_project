import whisper

model = whisper.load_model("base")

audio_file = r"C:\Users\user\voice2text_project\001_sd.wav"

print("🔊 오디오 파일 로드 중...")
result = model.transcribe(audio_file)

print("📝 변환된 텍스트:", result["text"])

# 👉 결과를 텍스트 파일로 저장
output_path = r"C:\Users\user\voice2text_project\transcription.txt"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(result["text"])

print(f"✅ 텍스트가 저장되었습니다: {output_path}")
