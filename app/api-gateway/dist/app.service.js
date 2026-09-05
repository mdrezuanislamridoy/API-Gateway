"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    async proxy(req, res, targetBase) {
        const targetUrl = new URL(req.originalUrl, targetBase).toString();
        const headers = new Headers();
        for (const [key, val] of Object.entries(req.headers)) {
            if (key !== 'host' && key !== 'content-length' && val) {
                if (Array.isArray(val)) {
                    val.forEach((v) => headers.append(key, v));
                }
                else {
                    headers.set(key, val);
                }
            }
        }
        let body;
        if (!['GET', 'HEAD'].includes(req.method) && req.body) {
            if (typeof req.body === 'string') {
                body = req.body;
            }
            else if (Buffer.isBuffer(req.body)) {
                body = new Uint8Array(req.body);
            }
            else if (Object.keys(req.body).length > 0) {
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
        }
        catch {
            throw new common_1.BadGatewayException(`Failed to reach service at ${targetBase}`);
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map