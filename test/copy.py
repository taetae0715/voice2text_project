import tkinter as tk

# 기본 윈도우 설정
root = tk.Tk()
root.title("에버랜드 일정")
root.geometry("600x600")  # 창 크기 설정

# 배경색과 텍스트 설정
root.config(bg="#f8c8d6")  # 벚꽃 분홍색 배경

# 타이틀 레이블
title_label = tk.Label(root, text="산리오 테마파크 일정", font=("Arial", 24, "bold"), bg="#f8c8d6", fg="#ff66b2")
title_label.pack(pady=20)

# 산리오 캐릭터 버튼 생성 (키티, 시나모롤, 쿠로미, 마이멜로디)
def display_schedule(character):
    schedule_label.config(text=f"{character} 일정이 표시됩니다!")

characters = ["키티", "시나모롤", "쿠로미", "마이멜로디"]

for char in characters:
    button = tk.Button(root, text=char, font=("Arial", 18), bg="#ff66b2", fg="white", command=lambda c=char: display_schedule(c))
    button.pack(pady=10, fill="x")

# 일정 출력 레이블
schedule_label = tk.Label(root, text="여기에 일정이 표시됩니다.", font=("Arial", 16), bg="#f8c8d6", fg="#ff3399")
schedule_label.pack(pady=30)

# 실행
root.mainloop()
