import json
import os
from http import HTTPStatus
from flask import Flask, make_response, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult, AnalyzeDocumentRequest
from dotenv import find_dotenv, load_dotenv

app = Flask(__name__)
document_intelligence_client = None


def build_response(message, status_code):
    resp = make_response(jsonify(message), status_code)
    resp.content_type = 'application/json'
    return resp


def validate_request(request):
    if request.method != 'POST':
        return build_response({"errorMessage": "Method not Allowed"}, HTTPStatus.METHOD_NOT_ALLOWED)
    if not request.content_type.startswith('application/json'):
        return build_response({"errorMessage": "Content Type is not application/json"}, HTTPStatus.UNSUPPORTED_MEDIA_TYPE)
    if request.content_length < 1:
        return build_response({"errorMessage": "No Message Body"}, HTTPStatus.BAD_REQUEST)
    return None


def create_client():
    endpoint = os.environ["DOCUMENT_INTELLIGENCE_ENDPOINT"]
    key = os.environ["DOCUMENT_INTELLIGENCE_API_KEY"]
    global document_intelligence_client
    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key))


@app.route("/", methods=['POST', 'GET'])
def index():
    return build_response({"errorMessage": "The resource could not be found"}, HTTPStatus.NOT_FOUND)


@app.errorhandler(404)
def page_not_found(e):
    return build_response({"errorMessage": "The resource could not be found"}, HTTPStatus.NOT_FOUND)


@app.route("/analyzeInvoice", methods=['POST'])
def analyze_invoice():
    validate_req = validate_request(request)
    if validate_req is not None:
        return validate_req
    else:
        req_data = request.get_json()
        try:
            fields = analyze_service_call(
                model_id="prebuilt-invoice", url=req_data["inputUrl"], locale="en-US")
            return build_response(fields, HTTPStatus.OK)
        except Exception as e:
            return build_response({"errorMessage": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR)


@app.route("/analyzeReceipt", methods=['POST'])
def analyze_receipt():
    validate_req = validate_request(request)
    if validate_req is not None:
        return validate_req
    else:
        req_data = request.get_json()
        try:
            fields = analyze_service_call(
                model_id="prebuilt-receipt", url=req_data["inputUrl"], locale="en-US")
            return build_response(fields, HTTPStatus.OK)
        except Exception as e:
            return build_response({"errorMessage": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR)


@app.route("/analyzeIdentity", methods=['POST'])
def analyze_identity():
    validate_req = validate_request(request)
    if validate_req is not None:
        return validate_req
    else:
        req_data = request.get_json()
        try:
            fields = analyze_service_call(
                model_id="prebuilt-idDocument", url=req_data["inputUrl"], locale="en-US")
            return build_response(fields, HTTPStatus.OK)
        except Exception as e:
            return build_response({"errorMessage": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR)


def analyze_service_call(model_id=None, url=None, locale=None):
    global document_intelligence_client
    poller = document_intelligence_client.begin_analyze_document(
        model_id=model_id, analyze_request=AnalyzeDocumentRequest(url_source=url), locale=locale, content_type="application/json"
    )
    invoices: AnalyzeResult = poller.result()
    if invoices and invoices.documents and invoices.documents[0].fields:
        doc_data = invoices.documents[0].as_dict()
        # res = json.dumps(doc_data, cls=AzureJSONEncoder)
        return doc_data
    else:
        raise Exception("Analysis failed")


if __name__ == "__main__":
    try:
        load_dotenv(find_dotenv())
    except:
        print("No .env file found")
    try:
        create_client()
        app.run(debug=False, threaded=True, port=os.environ["PORT"])
    except:
        print("Error in running the app")
