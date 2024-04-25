using Azure;
using Azure.AI.DocumentIntelligence;


namespace dotnet.Service;

public class AnalyzeService
{
    private DocumentIntelligenceClient client;
    public AnalyzeService()
    {
        string? endpoint = Environment.GetEnvironmentVariable("DOCUMENT_INTELLIGENCE_ENDPOINT");
        string? key =  Environment.GetEnvironmentVariable("DOCUMENT_INTELLIGENCE_API_KEY");
        if (string.IsNullOrEmpty(endpoint) || string.IsNullOrEmpty(key))
        {
            throw new Exception("Please provide endpoint and key in the environment variables");
        }
        client = new DocumentIntelligenceClient(new Uri(endpoint), new AzureKeyCredential(key));
    }

    public async Task<AnalyzedDocument> AnalyzeServiceCall(string modelId, string url, string locale = "en-US")
    {
        Uri uriSource = new Uri(url);

        var content = new AnalyzeDocumentContent()
        {
            UrlSource = uriSource
        };

        Operation<AnalyzeResult> operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, modelId, content, locale: locale);
        AnalyzeResult result = operation.Value;

        if (result != null && result.Documents != null && result.Documents.Count > 0)
        {
            AnalyzedDocument doc = result.Documents[0];
            return doc;
        }
        throw new Exception("Server Error in analyzing document");
    }
}
