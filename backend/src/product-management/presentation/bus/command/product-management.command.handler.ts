import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProductManagementService } from 'src/product-management/core/product-management.service';
import { CreateProductCommand, DeleteProductCommand, UpdateProductCommand } from './product-management.command';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    public readonly productManagementService: ProductManagementService,
  ) {}

  async execute(command: CreateProductCommand) {
    return this.productManagementService.createProduct(command.payload);
  }
}

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    public readonly productManagementService: ProductManagementService,
  ) {}

  async execute(command: UpdateProductCommand) {
    return this.productManagementService.updateProduct(command.payload);
  }
}

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler
  implements ICommandHandler<DeleteProductCommand>
{
  constructor(
    public readonly productManagementService: ProductManagementService,
  ) {}


  async execute({ userId, productId }: DeleteProductCommand) {
    return this.productManagementService.deleteProduct(userId, productId);
  }
}

export const ProductManagementCommandHandlers = [
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  DeleteProductCommandHandler,
];
