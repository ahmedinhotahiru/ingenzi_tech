from flask import Flask, request, jsonify, send_from_directory # type: ignore
from flask_cors import CORS
from github import Github # type: ignore
from dotenv import load_dotenv, find_dotenv # type: ignore
# from client_driver import *
from logs_simulator import generate_self_test_report_json, generate_json_logs
from datetime import datetime, timedelta
import json
import base64
import os

load_dotenv(find_dotenv())

# GitHub credentials
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") #alternatively create and store your token in a .env file
GITHUB_REPO = "replace_with_your_repo_name"

error_path = ".\data\error_codes\Philips_HDI_5000_Error_Codes_Full.json"
LAST_SERVICE_DATE_PATH = ".\data\last_service_date.json"

# Initialize GitHub object with your token
g = Github(GITHUB_TOKEN)
repo = g.get_repo(GITHUB_REPO)

app = Flask(__name__)
CORS(app)

@app.route('/api/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return {'error': 'No files uploaded'}, 400

    files = request.files.getlist('files')
    uploaded_files = []

    for file in files:
        file_content = file.read()
        file_name = file.filename
        encoded_content = base64.b64encode(file_content).decode('utf-8')
        commit_message = f"Upload {file_name}"

        try:
            file_path_in_repo = f'{file_name}'
            repo.create_file(file_path_in_repo, commit_message, encoded_content)
            uploaded_files.append(file_name)
        except Exception as e:
            return {'error': str(e)}, 500

    return {'message': f'Uploaded files: {", ".join(uploaded_files)}'}

@app.route('/api/lookup-code')
def search():
    # Get query parameter `query`
    try:
        error_code = request.args.get('code')
        if error_code.isnumeric() and len(error_code) == 4:
            with open(error_path, 'r') as f:
                data = json.load(f)
                result = next((item for item in data if item["Error Code"] == error_code), None)
                
                if result is not None:
                    return {"Status":"Found", "Error Code": error_code, "Description": result["Text Message"], "Module Name": result["Module Name"]}

                else:
                    return {"Status":"Not Found", "Error Code": error_code, "Description": "Not Found"}

        else:
            return {"Status":"invalid error code", "Error Code": error_code, "Description": "Invalid Error Code"}

    except Exception as e:
        return {"Status":"Error", "Error Code": error_code, "Description": str(e)}


@app.route('/api/get_files')
def get_files():
    file_type = request.args.get('type')
    
    if file_type is None:
        return jsonify({"error": "No file type provided"}), 400
    
    if file_type == "logs":
        directory = os.path.join(app.root_path, 'data\device_logs')  # Adjust the path as needed
    elif file_type == "reports":
        directory = os.path.join(app.root_path, 'data\self_test_report')
    elif file_type == "user":
        directory = os.path.join(app.root_path, 'data\manuals\\user')
    elif file_type == "service":
        directory = os.path.join(app.root_path, 'data\manuals\service')
    elif file_type == "regulatory":
        directory = os.path.join(app.root_path, 'data\manuals\\regulatory')
        

    try:
        files = os.listdir(directory)
        
        # get a dictionary of files and current timestamp
        files_with_timestamps = {file: os.path.getmtime(os.path.join(directory, file)) for file in files}
        # sort the files by timestamp in descending order
        files_ = sorted(files_with_timestamps, key=files_with_timestamps.get, reverse=True)
        
        files_ = [{
            "type":file_type, 
            "file": file, 
            "date": datetime.fromtimestamp(files_with_timestamps[file]).strftime("%Y-%m-%d")} for file in files_]
        
        return jsonify(files_)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/self-test-report")
def run_self_test():
    response = json.loads(generate_self_test_report_json())

    return response


@app.route("/api/retrieve-logs")
def retrieve_logs():
    response = json.loads(generate_json_logs())
    # return {"file name": file_name, "date": datetime.now().strftime("%Y-%m-%d")}
    return response


@app.route("/api/retrieve-logs/<file_name>")
def retrieve_logs_by_name(file_name):
    try:
        file_path = os.path.join('.\data\device_logs', file_name)
        with open(file_path, 'r') as f:
            data = json.load(f)
            return data
    except Exception as e:
        return {"error": str(e)}, 500
    


@app.route('/api/files/download/<filename>')
def download_file(filename):
    file_type = request.args.get('type')
    if file_type is None:
        return jsonify({"error": "No file type provided"}), 400 
        
    if file_type == "logs":
        directory = os.path.join(app.root_path, 'data\device_logs')  # Adjust the path as needed
    elif file_type == "reports":
        directory = os.path.join(app.root_path, 'data\self_test_report')
    elif file_type == "user":
        directory = os.path.join(app.root_path, 'data\manuals\\user')
    elif file_type == "service":
        directory = os.path.join(app.root_path, 'data\manuals\service')
    elif file_type == "regulatory":
        directory = os.path.join(app.root_path, 'data\manuals\\regulatory')
    
    try:
        return send_from_directory(directory, filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 404


@app.route('/api/last-service-date', methods=['GET'])
def get_last_service_date():
    try:
        if os.path.exists(LAST_SERVICE_DATE_PATH):
            with open(LAST_SERVICE_DATE_PATH, 'r') as f:
                data = json.load(f)
                return data
        else:
            with open(LAST_SERVICE_DATE_PATH, 'w') as f:
                next_service_date = datetime.timestamp(datetime.now())
                last_service_date = datetime.timestamp(datetime.now())
                data = {"last_service_date": last_service_date, "next_service_date": next_service_date}
                json.dump(data, f)
                return data
    except Exception as e:
        return {"error": str(e)}, 500
    
@app.route("/api/last-service-date", methods=['POST'])
def update_last_service_date():
    print("ReQUEST JSON: ", request.json)
    print("ReQUEST RAW: ", request)
    try:
        if request.json is not None:
            with open(LAST_SERVICE_DATE_PATH, 'w') as f:
                last_service_date = request.json["last_service_date"]
                next_service_date = request.json["next_service_date"]
                data = {"last_service_date": last_service_date, "next_service_date": next_service_date}
                json.dump(data, f)
                return {"status": "success", "message": "Data updated successfully"}
        else:
            return {"status": "error", "message": "No data provided"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == '__main__':
    app.run(debug=True)


