import type { Request, Response } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    health(): {
        status: string;
        service: string;
    };
    handleAuth(req: Request, res: Response): Promise<void>;
    handleProducts(req: Request, res: Response): Promise<void>;
    handleOrders(req: Request, res: Response): Promise<void>;
}
