import whisper
import csv

model = whisper.load_model("base")

audio_file = r"C:\Users\user\voice2text_project\001_sd.m4a"

print("🔊 오디오 파일 로드 중...")
result = model.transcribe(audio_file)

print("📄 전체 결과:", result)  # 디버깅용 전체 출력
print("📝 변환된 텍스트:", result["text"])

# 📁 저장할 TSV 파일 경로
tsv_file = r"C:\Users\user\voice2text_project\doc\transcription_output.tsv"

# 📝 TSV로 저장 (시작 시간, 끝 시간, 텍스트)
with open(tsv_file, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f, delimiter="\t")
    writer.writerow(["start", "end", "text"])  # 헤더
    for segment in result["segments"]:
        writer.writerow([segment["start"], segment["end"], segment["text"]])

print(f"✅ 변환 결과가 TSV 파일로 저장되었습니다: {tsv_file}")
