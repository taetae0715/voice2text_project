from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from datetime import datetime
import json
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
import io

app = Flask(__name__)
CORS(app)

# 한글 폰트 등록 (서버에 한글 폰트 파일이 있어야 합니다)
# Windows의 경우 'C:/Windows/Fonts/malgun.ttf'를 사용할 수 있습니다
FONT_PATH = 'C:/Windows/Fonts/malgun.ttf'
pdfmetrics.registerFont(TTFont('Malgun', FONT_PATH))

def generate_pdf(record):
    # PDF 생성을 위한 버퍼 생성
    buffer = io.BytesIO()
    
    # PDF 캔버스 생성
    p = canvas.Canvas(buffer, pagesize=A4)
    p.setFont('Malgun', 12)
    
    # 제목
    p.setFont('Malgun', 16)
    p.drawString(50, 800, f"제목: {record['title']}")
    
    # 날짜와 시간
    p.setFont('Malgun', 12)
    p.drawString(50, 770, f"날짜: {record['date']}")
    p.drawString(50, 750, f"시간: {record['duration']}")
    
    # 구분선
    p.line(50, 730, 550, 730)
    
    # 요약
    p.setFont('Malgun', 14)
    p.drawString(50, 700, "녹음 AI 요약")
    p.setFont('Malgun', 12)
    
    # 요약 텍스트를 여러 줄로 나누어 표시
    summary = record['summary']
    y = 670
    words = summary.split()
    line = ""
    for word in words:
        if len(line + " " + word) < 60:  # 한 줄의 최대 길이
            line += " " + word if line else word
        else:
            p.drawString(50, y, line)
            y -= 20
            line = word
    if line:
        p.drawString(50, y, line)
    
    # PDF 저장
    p.save()
    buffer.seek(0)
    return buffer

def generate_excel(record):
    # 새로운 워크북 생성
    wb = Workbook()
    ws = wb.active
    ws.title = "녹음 내용"
    
    # 스타일 설정
    title_font = Font(name='맑은 고딕', size=14, bold=True)
    header_font = Font(name='맑은 고딕', size=12, bold=True)
    content_font = Font(name='맑은 고딕', size=11)
    
    header_fill = PatternFill(start_color="E6E6E6", end_color="E6E6E6", fill_type="solid")
    
    # 제목
    ws['A1'] = "제목"
    ws['B1'] = record['title']
    ws['A1'].font = header_font
    ws['B1'].font = title_font
    
    # 날짜
    ws['A2'] = "날짜"
    ws['B2'] = record['date']
    ws['A2'].font = header_font
    ws['B2'].font = content_font
    
    # 시간
    ws['A3'] = "시간"
    ws['B3'] = record['duration']
    ws['A3'].font = header_font
    ws['B3'].font = content_font
    
    # 요약
    ws['A5'] = "녹음 AI 요약"
    ws['A5'].font = header_font
    ws['A6'] = record['summary']
    ws['A6'].font = content_font
    
    # 열 너비 조정
    ws.column_dimensions['A'].width = 15
    ws.column_dimensions['B'].width = 50
    
    # 셀 정렬
    for row in ws.iter_rows(min_row=1, max_row=6, min_col=1, max_col=2):
        for cell in row:
            cell.alignment = Alignment(wrap_text=True, vertical='center')
    
    # 엑셀 파일을 바이트로 저장
    excel_file = io.BytesIO()
    wb.save(excel_file)
    excel_file.seek(0)
    return excel_file

@app.route('/api/records/<int:record_id>/download/<format>', methods=['GET'])
def download_record(record_id, format):
    try:
        # 녹음 데이터 조회 (실제 구현에서는 데이터베이스에서 조회)
        record = {
            'id': record_id,
            'title': '2024년 3월 15일 회의',  # 예시 데이터
            'date': '2024-03-15 14:30',
            'duration': '45:30',
            'summary': '프로젝트 진행상황 논의 및 일정 조정. 주요 논의 사항: 1) 디자인 시스템 구축 2) API 연동 3) 테스트 계획'
        }
        
        if format == 'pdf':
            file_buffer = generate_pdf(record)
            mimetype = 'application/pdf'
            extension = 'pdf'
        elif format == 'excel':
            file_buffer = generate_excel(record)
            mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            extension = 'xlsx'
        else:
            return jsonify({'error': '지원하지 않는 파일 형식입니다.'}), 400
        
        return send_file(
            file_buffer,
            mimetype=mimetype,
            as_attachment=True,
            download_name=f"{record['title']}.{extension}"
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True) 