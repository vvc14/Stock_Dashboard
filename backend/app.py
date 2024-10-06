from flask import Flask, render_template, request, jsonify
import yfinance as yf
import yagmail
import json
import base64
from io import BytesIO
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_stock_data')
def get_stock_data():
    ticker = request.args.get('ticker')
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')

    stock = yf.Ticker(ticker)
    hist = stock.history(start=start_date, end=end_date)
    
    stock_data = {
        'ticker': ticker,
        'dates': hist.index.strftime('%Y-%m-%d').tolist(),
        'prices': hist['Close'].tolist(),
    }
    
    return jsonify(stock_data)

@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.json
    recipient_email = data['email']
    chart_image_base64 = data['chartImage']

    chart_image_base64 = chart_image_base64.split(",")[1] 
    chart_image_data = base64.b64decode(chart_image_base64)

    image_path = 'stock_chart.png'
    with open(image_path, 'wb') as f:
        f.write(chart_image_data)

    try:
        yag = yagmail.SMTP('vyaswanthvelchuri@gmail.com', 'gpxv wyzb ujax ocby')
        subject = "Stock Analysis Report"
        contents = "Here is your stock analysis report with the stock chart."
        
        yag.send(
            to=recipient_email,
            subject=subject,
            contents=[contents, image_path]
        )
        
        return jsonify({'message': 'Email sent successfully!'})
    except Exception as e:
        return jsonify({'message': f'Failed to send email. Error: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)
