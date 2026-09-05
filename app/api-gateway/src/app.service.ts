import { BadGatewayException, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class AppService {
  async proxy(req: Request, res: Response, targetBase: string): Promise<void> {
    const targetUrl = new URL(req.originalUrl, targetBase).toString();

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (key !== 'host' && key !== 'content-length' && val) {
        if (Array.isArray(val)) {
          val.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, val);
        }
      }
    }

    let body: BodyInit | undefined;
    if (!['GET', 'HEAD'].includes(req.method) && req.body) {
      if (typeof req.body === 'string') {
        body = req.body;
      } else if (Buffer.isBuffer(req.body)) {
        body = new Uint8Array(req.body);
      } else if (Object.keys(req.body).length > 0) {
        body = JSON.stringify(req.body);
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json');
        }
      }
    }

    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
      });

      res.status(response.status);
      response.headers.forEach((value, key) => {
        if (key !== 'transfer-encoding' && key !== 'content-encoding') {
          res.setHeader(key, value);
        }
      });

      const data = Buffer.from(await response.arrayBuffer());
      res.send(data);
    } catch {
      throw new BadGatewayException(
        `Failed to reach service at ${targetBase}`,
      );
    }
  }
}
