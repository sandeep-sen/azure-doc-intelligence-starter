package com.microsoft.docintelligence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.azure.ai.documentintelligence.DocumentIntelligenceClient;
import com.azure.ai.documentintelligence.DocumentIntelligenceClientBuilder;
import com.azure.ai.documentintelligence.models.AnalyzeDocumentRequest;
import com.azure.ai.documentintelligence.models.AnalyzeResult;
import com.azure.ai.documentintelligence.models.AnalyzeResultOperation;
import com.azure.ai.documentintelligence.models.Document;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.util.polling.SyncPoller;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.microsoft.docintelligence.models.AnalyzeRequest;

@RestController
public class DocIntelligenceController {

    // private static final Logger LOGGER = LoggerFactory.getLogger(DocIntelligenceController.class);

    private DocumentIntelligenceClient client;

    @Autowired
    public DocIntelligenceController(@Value("${azure.docintelligence.endpoint}") String endpoint, @Value("${azure.docintelligence.key}") String key) {
        this.client = new DocumentIntelligenceClientBuilder()
                .credential(new AzureKeyCredential(key))
                .endpoint(endpoint)
                .buildClient();
    }

    @PostMapping(value = "/analyzeInvoice", consumes = "application/json", produces = "application/json")
    public String analyzeInvoice(@RequestBody AnalyzeRequest request) throws Exception {
        String doc = this.analyzeServiceCall("prebuilt-invoice", request.getInputUrl(), "en-US");
        return doc;
    }

    @PostMapping(value = "/analyzeReceipt", consumes = "application/json", produces = "application/json")
    public String analyzeReceipt(@RequestBody AnalyzeRequest request) throws Exception {
        String doc = this.analyzeServiceCall("prebuilt-receipt", request.getInputUrl(), "en-US");
        return doc;
    }

    @PostMapping(value = "/analyzeIdentity", consumes = "application/json", produces = "application/json")
    public String analyzeIdentity(@RequestBody AnalyzeRequest request) throws Exception {
        String doc = this.analyzeServiceCall("prebuilt-idDocument", request.getInputUrl(), "en-US");
        return doc;
    }

    private String analyzeServiceCall(String modelId, String url, String locale) throws Exception{
        SyncPoller<AnalyzeResultOperation, AnalyzeResultOperation> analyzeInvoicesPoller = client.beginAnalyzeDocument(
                modelId,
                null,
                locale,
                null,
                null,
                null,
                null, new AnalyzeDocumentRequest().setUrlSource(url));

        AnalyzeResult analyzeInvoiceResult = analyzeInvoicesPoller.getFinalResult().getAnalyzeResult();

        if (analyzeInvoiceResult != null && analyzeInvoiceResult.getDocuments() != null) {
            Document doc = analyzeInvoiceResult.getDocuments().get(0);
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
            
            String json = ow.writeValueAsString(doc);
            return json;
            
        }
        throw new Exception("No result found");
    }
}