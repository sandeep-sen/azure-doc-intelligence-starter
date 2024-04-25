using Azure.AI.DocumentIntelligence;
using dotnet.Models;
using dotnet.Service;
using Microsoft.AspNetCore.Mvc;

namespace dotnet.Controllers;

[ApiController]
[Route("/")]
public class AnalyzeDocumentController : ControllerBase
{
    
    private readonly ILogger<AnalyzeDocumentController> _logger;

    public AnalyzeDocumentController(ILogger<AnalyzeDocumentController> logger)
    {
        _logger = logger;
    }

    [HttpPost("analyzeInvoice")]
    public async Task<ActionResult<AnalyzedDocument>> AnalyzeInvoice(InputReq inputReq)
    {
        AnalyzeService service = new AnalyzeService();
        var res = await service.AnalyzeServiceCall("prebuilt-invoice", inputReq.InputUrl, "en-US");
        return res;
    }

    [HttpPost("analyzeReceipt")]
    public async Task<ActionResult<AnalyzedDocument>> AnalyzeReceipt(InputReq inputReq)
    {
        AnalyzeService service = new AnalyzeService();
        var res = await service.AnalyzeServiceCall("prebuilt-receipt", inputReq.InputUrl, "en-US");
        return res;
    }

    [HttpPost("analyzeIdentity")]
    public async Task<ActionResult<AnalyzedDocument>> AnalyzeIdentity(InputReq inputReq)
    {
        AnalyzeService service = new AnalyzeService();
        var res = await service.AnalyzeServiceCall("prebuilt-idDocument", inputReq.InputUrl, "en-US");
        return res;
    }
}
