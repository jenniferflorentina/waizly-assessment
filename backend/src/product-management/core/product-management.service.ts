import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ProductModel } from './domain/product/model/product.model';
import { IdVO } from 'src/common/vo/id.vo';
import { ProductRepository } from '../infrastructure/product.repository';

@Injectable()
export class ProductManagementService {
  private logger: Logger = new Logger(ProductManagementService.name);

  constructor(
    private productRepository: ProductRepository,
    private eventBus: EventBus,
  ) {}

  async createProduct(
    product: ProductModel,
  ): Promise<void> {
    await this.productRepository.createProduct(product);
  }

  async updateProduct(
    product: ProductModel,
  ): Promise<ProductModel> {
    const isUpdated = await this.productRepository.updateProduct(product);

    if (!isUpdated) {
      throw new BadRequestException('Failed to update product profile');
    }

    const productUpdated = await this.productRepository.findById(
      product.getId(),
    );

    if (!productUpdated) {
      throw new NotFoundException('Product not found');
    }

    return productUpdated;
  }


  async deleteProduct(
    userId: IdVO,
    productId: IdVO,
  ): Promise<void> {
    await this.productRepository.deleteProduct(userId, productId);
  }
}
