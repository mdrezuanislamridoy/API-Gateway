import { Controller, Get } from '@nestjs/common';
import { getGatewayConfig } from '../config/gateway.config';

@Controller()
export class HealthController {
  @Get()
  getInfo() {
    return {
      service: 'API Gateway',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      routes: [
        { path: '/auth/*', description: 'Authentication and user management' },
        { path: '/products/*', description: 'Product catalog and management' },
        { path: '/orders/*', description: 'Order processing and history' },
        { path: '/health', description: 'Service health check' },
      ],
    };
  }

  @Get('health')
  async checkHealth() {
    const config = getGatewayConfig();
    const probe = async (url: string) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(url, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return res.ok ? 'up' : `degraded (${res.status})`;
      } catch {
        return 'down';
      }
    };

    const [authStatus, productStatus, orderStatus] = await Promise.all([
      probe(config.services.auth),
      probe(config.services.product),
      probe(config.services.order),
    ]);

    return {
      gateway: 'up',
      timestamp: new Date().toISOString(),
      services: {
        auth: {
          url: config.services.auth,
          status: authStatus,
        },
        product: {
          url: config.services.product,
          status: productStatus,
        },
        order: {
          url: config.services.order,
          status: orderStatus,
        },
      },
    };
  }
}
