# Azure Document Intelligence SDK Demo

## Description

This repository demonstrates document analysis capabilities using Azure Document Intelligence SDKs for Java, JavaScript/TypeScript, Python, and .NET.

The project consists of a REST server with three endpoints:

- POST http://<HOST>:<PORT>/analyzeInvoice
- POST http://<HOST>:<PORT>/analyzeIdentity
- POST http://<HOST>:<PORT>/analyzeReceipt

Each endpoint accepts JSON input with the content type set to `'Content-Type: application/json'`:

```json
{
 "inputUrl": "<URL of your hosted document>"
}
```

The response is a JSON object containing the analyzed documents.

## Usage

Clone the repository.  
Navigate to the folder corresponding to your preferred language (Java, JavaScript/TypeScript, Python, or .NET).  
Follow the standard setup and debug instructions for your chosen language, vscode launch settings are setup to debug each of them.

## Folder Structure

- **Java**: Contains a Spring Boot application.
- **JavaScript/TypeScript**: Built using the Nest framework TypeScript starter repository.
- **Python**: Implements a Flask server.
- **.NET**: Uses .NET 8 MVC API.

## Java

Add following dependency in pom file

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-documentintelligence</artifactId>
    <version>1.0.0-beta.1</version>
</dependency>
```

Setup your environment by adding `endpoint` and `apikey` values in the `application.yaml` file or create equivalent environment variables.

## .NET

Add the following dependency in csproj file

```xml
<PackageReference Include="Azure.AI.DocumentIntelligence" Version="1.0.0-beta.2" />
```

Setup your environment by adding `DOCUMENT_INTELLIGENCE_ENDPOINT` and `DOCUMENT_INTELLIGENCE_API_KEY` values in the `launchSettings.json` file or create equivalent environment variables.

## JavaScript / TypeScript

Built from [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

```json
"dependencies": {
    ...
    "@azure-rest/ai-document-intelligence": "1.0.0-beta.2"
  }
```

Setup your environment by creating a `.env` file and adding the following information

```properties
PORT=5000
DOCUMENT_INTELLIGENCE_ENDPOINT=<YOUR_AZURE_AI_DOC_INTELLIGENCE_ENDPOINT>
DOCUMENT_INTELLIGENCE_API_KEY=<API_KEY>
```

### Support Nest

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## Python

Add the following dependency in requirements file.

```properties
azure-ai-documentintelligence==1.0.0b2
```

Setup your environment by creating a `.env` file and adding the following information.

```properties
PORT=3000
DOCUMENT_INTELLIGENCE_ENDPOINT=<YOUR_AZURE_AI_DOC_INTELLIGENCE_ENDPOINT>
DOCUMENT_INTELLIGENCE_API_KEY=<API_KEY>
```

## Contributing

Contributions are welcome! Please create a pull request with your changes.

## License

This project is licensed under the [MIT License](LICENSE).
