import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// eslint-disable-next-line
import { Request, Response, NextFunction } from 'express';
import { JWTTokenVO } from 'src/auth-user-management/core/domain/user/vo/jwt-token';
import { JwtPayloadVO } from '../vo/jwt-payload.vo';

@Injectable()
export class JwtDecodeMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtDecodeMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.error(
        'Authorization header missing or does not start with Bearer',
      );
      return res
        .status(401)
        .json({ message: 'Unauthorized, missing or invalid token' });
    }

    const token = authHeader.substring(7);
    try {
      const jwt = new JWTTokenVO(token);

      const decoded = jwt.decode();
      (req as any).jwtPayload = new JwtPayloadVO(
        decoded.userId,
        decoded.email,
        decoded.firstName,
        decoded.lastName,
        decoded.username,
        new Date(decoded.eAt),
        new Date(decoded.iAt),
      );
    } catch (error) {
      this.logger.error(`Invalid token: ${error.message}`);
      return res.status(401).json({ message: 'Invalid token' });
    }

    next();
    return null;
  }
}
