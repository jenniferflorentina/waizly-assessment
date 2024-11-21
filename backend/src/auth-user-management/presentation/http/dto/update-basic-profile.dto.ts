import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateBasicProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  gender: z.string(),
  dateOfBirth: z.string(),
});

export class UpdateBasicProfileDTO extends createZodDto(
  UpdateBasicProfileSchema,
) {}
