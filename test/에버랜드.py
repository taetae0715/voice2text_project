import tkinter as tk
from tkinter import messagebox

# GUI 윈도우 생성
window = tk.Tk()
window.title("에버랜드 일정 짜기")
window.geometry("600x400")
window.config(bg="#ffb3d9")  # 벚꽃 분홍색 배경

# 산리오 캐릭터 이미지 (파일 경로 예시, 실제 이미지는 해당 경로로 교체)
kitty_image = tk.PhotoImage(file="kitty.png")
cinamoroll_image = tk.PhotoImage(file="cinamoroll.png")
kuromi_image = tk.PhotoImage(file="kuromi.png")
mymelody_image = tk.PhotoImage(file="mymelody.png")

# 제목 라벨
label_title = tk.Label(window, text="에버랜드 일정 짜기!", font=("Arial", 24, "bold"), bg="#ffb3d9", fg="white")
label_title.pack(pady=20)

# 캐릭터 선택
label_character = tk.Label(window, text="캐릭터를 선택하세요", font=("Arial", 14), bg="#ffb3d9", fg="black")
label_character.pack()

character_frame = tk.Frame(window, bg="#ffb3d9")
character_frame.pack(pady=10)

kitty_button = tk.Button(character_frame, image=kitty_image, bg="#ffb3d9", borderwidth=0, command=lambda: select_character("Hello Kitty"))
kitty_button.grid(row=0, column=0, padx=10)

cinamoroll_button = tk.Button(character_frame, image=cinamoroll_image, bg="#ffb3d9", borderwidth=0, command=lambda: select_character("Cinnamoroll"))
cinamoroll_button.grid(row=0, column=1, padx=10)

kuromi_button = tk.Button(character_frame, image=kuromi_image, bg="#ffb3d9", borderwidth=0, command=lambda: select_character("Kuromi"))
kuromi_button.grid(row=0, column=2, padx=10)

mymelody_button = tk.Button(character_frame, image=mymelody_image, bg="#ffb3d9", borderwidth=0, command=lambda: select_character("My Melody"))
mymelody_button.grid(row=0, column=3, padx=10)

# 일정 입력
label_schedule = tk.Label(window, text="일정을 선택하세요", font=("Arial", 14), bg="#ffb3d9", fg="black")
label_schedule.pack(pady=10)

activity_list = ["롤러코스터", "바이킹", "퍼레이드", "사파리 투어", "분수쇼"]
activity_var = tk.StringVar(window)
activity_var.set(activity_list[0])  # 기본값 설정

activity_menu = tk.OptionMenu(window, activity_var, *activity_list)
activity_menu.config(width=20)
activity_menu.pack(pady=10)

# 날짜 입력
label_date = tk.Label(window, text="일정을 입력할 날짜를 선택하세요", font=("Arial", 14), bg="#ffb3d9", fg="black")
label_date.pack(pady=10)

date_entry = tk.Entry(window, font=("Arial", 12), width=20)
date_entry.pack(pady=10)

# 선택된 캐릭터 저장
selected_character = ""

def select_character(character):
    global selected_character
    selected_character = character
    messagebox.showinfo("캐릭터 선택", f"{selected_character}가 선택되었습니다!")

# 일정 저장
def save_schedule():
    selected_activity = activity_var.get()
    selected_date = date_entry.get()

    if not selected_character:
        messagebox.showerror("오류", "캐릭터를 선택해주세요!")
        return
    if not selected_date:
        messagebox.showerror("오류", "날짜를 입력해주세요!")
        return

    schedule_message = f"{selected_character}의 일정을 저장했습니다!\n날짜: {selected_date}\n활동: {selected_activity}"
    messagebox.showinfo("일정 저장 완료", schedule_message)

# 일정 저장 버튼
save_button = tk.Button(window, text="일정 저장", font=("Arial", 14), bg="#ff66b2", fg="white", command=save_schedule)
save_button.pack(pady=20)

# 실행
window.mainloop()
