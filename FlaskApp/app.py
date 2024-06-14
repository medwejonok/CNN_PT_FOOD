from flask import Flask, request, jsonify, send_from_directory
from model import prediction
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"/process": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
    
    if file:
        return jsonify({'response': str(prediction(file))}), 200
    
    return jsonify({'error': 'File upload failed'}), 500

@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')
if __name__ == '__main__':
    app.run(debug=True)