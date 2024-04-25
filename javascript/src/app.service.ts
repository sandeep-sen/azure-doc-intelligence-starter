import { Injectable, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import DocumentIntelligence, { AnalyzeResultOperationOutput, DocumentOutput, getLongRunningPoller, isUnexpected } from "@azure-rest/ai-document-intelligence";
import 'dotenv/config';

const client = DocumentIntelligence(
  process.env["DOCUMENT_INTELLIGENCE_ENDPOINT"] || "<cognitive services endpoint>",
  { key: process.env["DOCUMENT_INTELLIGENCE_API_KEY"] || "<api key>" });

@Injectable()
export class AppService {
  buildResponse(@Res() res: Response, body: object, status_code: number): Response {
    res.status(status_code);
    res.json(
      {
        body
      }
    );
    return res;
  }

  getHello(@Res() res: Response): Response {
    return this.buildResponse(res, { error: 'Page Unavailable' }, 404);
  }

  validateReq(req: Request, res: Response): Response {
    if (!req.is('application/json')) {
      return this.buildResponse(res, { error: "Content Type is not application/json" }, 415)
    }
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return this.buildResponse(res, { error: 'No Message Body' }, 400)
    }
    return null
  }

  async analyzeInvoice(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const validReq = this.validateReq(req, res)
    if (validReq != null) {
      return validReq
    }
    let docResp
    try {
      docResp = await this.analyzeServiceCall(req.body.inputUrl, "prebuilt-invoice", null)
    } catch (error) {
      return this.buildResponse(res, { errorMessage: "Error in Service", error: error.message }, 500)
    }
    return this.buildResponse(res, docResp, 200)
  }

  async analyzeReceipt(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const validReq = this.validateReq(req, res)
    if (validReq != null) {
      return validReq
    }
    let docResp
    try {
      docResp = await this.analyzeServiceCall(req.body.inputUrl, "prebuilt-receipt", null)
    } catch (error) {
      return this.buildResponse(res, { errorMessage: "Error in Service", error: error.message }, 500)
    }
    return this.buildResponse(res, docResp.fields, 200)
  }

  async analyzeIdDocs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const validReq = this.validateReq(req, res)
    if (validReq != null) {
      return validReq
    }
    let docResp
    try {
      docResp = await this.analyzeServiceCall(req.body.inputUrl, "prebuilt-idDocument", "en-IN")
    } catch (error) {
      return this.buildResponse(res, { errorMessage: "Error in Service", error: error.message }, 500)
    }
    if (docResp) {
      if (docResp.docType === "idDocument.driverLicense") {
        return this.buildResponse(res, { docType: "Driver License", extractedFields: docResp.fields }, 200)
      } else if (docResp.docType === "idDocument.passport") {
        return this.buildResponse(res, { docType: "Passport", extractedFields: docResp.fields }, 200)
      } else {
        return this.buildResponse(res, { error: "Unknown document type", document: docResp }, 500)
      }
    }
  }

  async analyzeServiceCall(inputUrl: string, model: string, locale: string): Promise<DocumentOutput> {
    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", model)
      .post({
        contentType: "application/json",
        body: {
          urlSource: inputUrl,
        },
        ...(locale ? { queryParameters: { locale: locale } } : {}),
      });
    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }
    const poller = await getLongRunningPoller(client, initialResponse);
    const analyzeResult = (
      (await (poller).pollUntilDone()).body as AnalyzeResultOperationOutput
    ).analyzeResult;

    const documents = analyzeResult?.documents;

    const document = documents && documents[0];
    if (!document) {
      throw new Error("Expected at least one document in the result.");
    }
    if (document) {
      return document;
    } else {
      throw new Error("Expected at least one receipt in the result.");
    }
  }
}
