import tkinter as tk
from tkinter import filedialog, messagebox
import whisper
import csv
import os

def select_audio_file():
    file_path = filedialog.askopenfilename(filetypes=[("Audio Files", "*.mp3 *.wav *.m4a *.flac *.aac")])
    if file_path:
        entry_file_path.delete(0, tk.END)
        entry_file_path.insert(0, file_path)

def transcribe_and_save():
    audio_path = entry_file_path.get()
    if not audio_path or not os.path.exists(audio_path):
        messagebox.showerror("오류", "올바른 오디오 파일을 선택하세요.")
        return

    output_path = os.path.splitext(audio_path)[0] + "_output.tsv"

    try:
        label_status.config(text="🔊 모델 로드 중...", fg="#0077CC")
        root.update()

        model = whisper.load_model("base")

        label_status.config(text="🎙️ 음성 변환 중...", fg="#0077CC")
        root.update()

        # 실시간 텍스트 업데이트
        result = model.transcribe(audio_path, word_timestamps=True, task="transcribe")

        # 출력창을 지우고 새로운 텍스트를 추가
        text_output.delete(1.0, tk.END)

        # 세그먼트별로 텍스트 추가
        for segment in result["segments"]:
            text_output.insert(tk.END, f"{segment['start']:0.2f} - {segment['end']:0.2f}: {segment['text']}\n")
            text_output.yview(tk.END)  # 자동으로 스크롤 내려주기

        # TSV로 저장
        with open(output_path, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f, delimiter="\t")
            writer.writerow(["start", "end", "text"])
            for segment in result["segments"]:
                writer.writerow([segment["start"], segment["end"], segment["text"]])

        label_status.config(text=f"✅ 변환 완료! 저장 위치:\n{output_path}", fg="green")
        messagebox.showinfo("성공", f"TSV 파일로 저장 완료:\n{output_path}")

    except Exception as e:
        label_status.config(text="❌ 오류 발생", fg="red")
        messagebox.showerror("오류", str(e))

# ==== UI 구성 ====
root = tk.Tk()
root.title("🎧 Whisper 음성 → 텍스트 변환기")
root.geometry("700x500")
root.configure(bg="white")

font_title = ("Segoe UI", 16, "bold")
font_body = ("Segoe UI", 12)
font_btn = ("Segoe UI", 13, "bold")

# 상단 안내
label_instruction = tk.Label(root, text="🔊 오디오 파일을 선택하세요", font=font_title, bg="white")
label_instruction.pack(pady=20)

# 파일 입력창 + 찾아보기
frame_input = tk.Frame(root, bg="white")
frame_input.pack()

entry_file_path = tk.Entry(frame_input, width=55, font=font_body, relief="solid", bd=1)
entry_file_path.pack(side=tk.LEFT, padx=(0, 10), ipady=5)

btn_browse = tk.Button(
    frame_input,
    text="찾아보기",
    command=select_audio_file,
    font=font_btn,
    bg="#007BFF",
    fg="white",
    activebackground="#0056b3",
    padx=20,
    pady=5,
    relief="raised",
    bd=2
)
btn_browse.pack(side=tk.LEFT)

# 변환 버튼
btn_convert = tk.Button(
    root,
    text="📝 텍스트로 변환 & TSV 저장",
    command=transcribe_and_save,
    font=font_btn,
    bg="#007BFF",
    fg="white",
    activebackground="#0056b3",
    padx=30,
    pady=10,
    relief="raised",
    bd=2
)
btn_convert.pack(pady=20)

# 실시간 텍스트 출력 영역
label_output = tk.Label(root, text="🎤 실시간 텍스트 변환:", font=font_title, bg="white")
label_output.pack(pady=10)

text_output = tk.Text(root, height=10, width=70, font=font_body, wrap=tk.WORD, bd=2, relief="sunken")
text_output.pack(pady=10)

# 상태 메시지
label_status = tk.Label(root, text="", font=("Segoe UI", 11, "bold"), bg="white")
label_status.pack()

root.mainloop()
