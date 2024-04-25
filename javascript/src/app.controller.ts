import { Controller, Get, Header, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Header('content-type', 'application/json')
  getHello(@Res() res: Response): Response {
    return this.appService.getHello(res);
  }

  @Post('/analyzeInvoice')
  @Header('content-type', 'application/json')
  async analyzeInvoice(@Req() req: Request, @Res() res: Response): Promise<Response> {
    return this.appService.analyzeInvoice(req, res)
  }

  @Post('/analyzeReceipt')
  @Header('content-type', 'application/json')
  async analyzeReceipt(@Req() req: Request, @Res() res: Response): Promise<Response> {
    return this.appService.analyzeReceipt(req, res)
  }

  @Post('/analyzeIdentity')
  @Header('content-type', 'application/json')
  async analyzeIdDoc(@Req() req: Request, @Res() res: Response): Promise<Response> {
    console.log("in doc req")
    return this.appService.analyzeIdDocs(req, res)
  }
}
