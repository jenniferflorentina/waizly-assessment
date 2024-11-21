import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const RegisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  gender: z.string(),
  dateOfBirth: z.dateString(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  password: z.string(),
  email: z.string(),
});

export class RegisterDTO extends createZodDto(RegisterSchema) {}