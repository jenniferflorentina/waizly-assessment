import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateProductSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export class CreateProductDTO extends createZodDto(CreateProductSchema) {}