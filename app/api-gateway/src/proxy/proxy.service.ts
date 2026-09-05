import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  async forward(
    req: Request,
    res: Response,
    targetBaseUrl: string,
    serviceName: string,
  ): Promise<void> {
    const targetUrl = new URL(req.originalUrl, targetBaseUrl).toString();

    // Prepare headers to forward
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase()) && value !== undefined) {
        if (Array.isArray(value)) {
          for (const v of value) {
            headers.append(key, v);
          }
        } else {
          headers.set(key, value);
        }
      }
    }

    // Set forwarded headers
    const clientIp = req.ip || req.socket.remoteAddress || '';
    if (clientIp) {
      headers.set('x-forwarded-for', clientIp);
    }
    headers.set('x-forwarded-host', req.get('host') || '');
    headers.set('x-forwarded-proto', req.protocol);

    // Prepare body
    let body: BodyInit | undefined;
    const method = req.method.toUpperCase();
    if (!['GET', 'HEAD'].includes(method) && req.body) {
      if (typeof req.body === 'string') {
        body = req.body;
      } else if (Buffer.isBuffer(req.body)) {
        body = new Uint8Array(req.body);
      } else if (
        typeof req.body === 'object' &&
        Object.keys(req.body).length > 0
      ) {
        body = JSON.stringify(req.body);
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json');
        }
      }
    }

    try {
      this.logger.log(
        `Forwarding ${req.method} ${req.originalUrl} -> ${targetUrl}`,
      );

      const upstreamResponse = await fetch(targetUrl, {
        method,
        headers,
        body,
        redirect: 'manual',
      });

      // Set downstream status and headers on express response
      res.status(upstreamResponse.status);

      upstreamResponse.headers.forEach((value, key) => {
        if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });

      const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
      res.send(responseBuffer);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to reach ${serviceName} at ${targetUrl}: ${err.message}`,
        err.stack,
      );
      throw new ServiceUnavailableException(
        `${serviceName} is currently unavailable. Please try again later.`,
      );
    }
  }
}
