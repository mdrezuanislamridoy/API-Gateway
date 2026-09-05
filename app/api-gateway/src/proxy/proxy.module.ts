import { Module } from '@nestjs/common';
import { AuthProxyController } from './auth-proxy.controller';
import { OrderProxyController } from './order-proxy.controller';
import { ProductProxyController } from './product-proxy.controller';
import { ProxyService } from './proxy.service';

@Module({
  controllers: [
    AuthProxyController,
    ProductProxyController,
    OrderProxyController,
  ],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
