export interface GatewayConfig {
  port: number;
  services: {
    auth: string;
    product: string;
    order: string;
  };
}

export const getGatewayConfig = (): GatewayConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  services: {
    auth: process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001',
    product: process.env.PRODUCT_SERVICE_URL ?? 'http://localhost:3002',
    order: process.env.ORDER_SERVICE_URL ?? 'http://localhost:3003',
  },
});
