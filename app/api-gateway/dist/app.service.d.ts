import type { Request, Response } from 'express';
export declare class AppService {
    proxy(req: Request, res: Response, targetBase: string): Promise<void>;
}
