import whisper
from transformers import pipeline
import os

# 📌 유니크한 파일명 생성 함수
def get_unique_filename(directory, base_name, extension=".txt"):
    filename = f"{base_name}{extension}"
    counter = 1
    while os.path.exists(os.path.join(directory, filename)):
        filename = f"{base_name}({counter}){extension}"
        counter += 1
    return os.path.join(directory, filename)

# 1. Whisper 모델 로딩
print("Whisper 모델 로딩 중...")
whisper_model = whisper.load_model("large")

# 2. 음성 파일 경로 지정
audio_path = r"C:\Users\user\voice2text_project\voice\self.m4a"

# 파일 존재 여부 확인
if not os.path.exists(audio_path):
    print(f"❌ 파일이 존재하지 않습니다: {audio_path}")
    exit()

# 3. 텍스트로 변환
print("음성 파일을 텍스트로 변환 중...")
result = whisper_model.transcribe(audio_path, language="ko")
transcribed_text = result["text"]

print("\n🎙 인식된 텍스트:")
print(transcribed_text)

# 4. 요약 모델 로딩
print("\n요약 모델 로딩 중...")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# 5. 텍스트 길이 제한 (500단어 이하)
if len(transcribed_text.split()) > 500:
    print("\n⚠ 텍스트가 너무 길어 500단어로 자릅니다.")
    truncated_text = " ".join(transcribed_text.split()[:500])
else:
    truncated_text = transcribed_text

# 6. 요약 수행
print("\n📝 요약 중...")
summary = summarizer(truncated_text, max_length=130, min_length=30, do_sample=False)
summary_text = summary[0]["summary_text"]

print("\n✅ 요약 결과:")
print(summary_text)

# 7. 결과 저장 (요약 + 전체 텍스트)
save_dir = "doc"
os.makedirs(save_dir, exist_ok=True)
save_path = get_unique_filename(save_dir, "summary_full")

with open(save_path, "w", encoding="utf-8") as f:
    f.write(f"요약: {summary_text}\n\n")
    f.write("전체 텍스트:\n")
    f.write(transcribed_text)

print(f"\n📁 요약 + 전체 텍스트가 저장되었습니다: {save_path}")
