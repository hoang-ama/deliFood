"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                response.status(status).json({ statusCode: status, message: res });
            }
            else {
                const payload = res;
                response.status(status).json({
                    statusCode: status,
                    ...payload,
                    message: payload['message'] ??
                        exception.message,
                });
            }
            return;
        }
        if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            const { status, message } = this.mapPrismaKnownError(exception);
            response
                .status(status)
                .json({ statusCode: status, message, error: 'PrismaError' });
            return;
        }
        if (exception instanceof client_1.Prisma.PrismaClientValidationError) {
            response.status(common_1.HttpStatus.BAD_REQUEST).json({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Invalid query or data for the database',
                error: 'PrismaValidationError',
            });
            return;
        }
        this.logger.error(exception instanceof Error ? exception.stack : String(exception));
        response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            error: 'InternalServerError',
        });
    }
    mapPrismaKnownError(exception) {
        switch (exception.code) {
            case 'P2002':
                return {
                    status: common_1.HttpStatus.CONFLICT,
                    message: 'A record with this unique field already exists',
                };
            case 'P2025':
                return {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'Record not found',
                };
            case 'P2003':
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Related record constraint failed',
                };
            default:
                this.logger.warn(`Unhandled Prisma error ${exception.code}: ${exception.message}`);
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Database request failed',
                };
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map