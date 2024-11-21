import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export class RefreshTokenDTO extends createZodDto(RefreshTokenSchema) {}
