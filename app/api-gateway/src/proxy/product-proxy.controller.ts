import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { getGatewayConfig } from '../config/gateway.config';
import { ProxyService } from './proxy.service';

@Controller('products')
export class ProductProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All()
  handleRoot(@Req() req: Request, @Res() res: Response) {
    const config = getGatewayConfig();
    return this.proxyService.forward(
      req,
      res,
      config.services.product,
      'Product Service',
    );
  }

  @All('*')
  handleWildcard(@Req() req: Request, @Res() res: Response) {
    const config = getGatewayConfig();
    return this.proxyService.forward(
      req,
      res,
      config.services.product,
      'Product Service',
    );
  }
}
