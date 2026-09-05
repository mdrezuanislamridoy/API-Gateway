import { All, Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  health() {
    return { status: 'ok', service: 'api-gateway' };
  }

  @All('auth')
  @All('auth/*path')
  handleAuth(@Req() req: Request, @Res() res: Response) {
    const target = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001';
    return this.appService.proxy(req, res, target);
  }

  @All('products')
  @All('products/*path')
  handleProducts(@Req() req: Request, @Res() res: Response) {
    const target = process.env.PRODUCT_SERVICE_URL ?? 'http://localhost:3002';
    return this.appService.proxy(req, res, target);
  }

  @All('orders')
  @All('orders/*path')
  handleOrders(@Req() req: Request, @Res() res: Response) {
    const target = process.env.ORDER_SERVICE_URL ?? 'http://localhost:3003';
    return this.appService.proxy(req, res, target);
  }
}
