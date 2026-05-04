import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
export declare class TenantMiddleware implements NestMiddleware {
    private readonly prisma;
    constructor(prisma: PrismaService);
    use(request: Request, response: Response, next: NextFunction): Promise<void>;
}
