import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDetailProductQuery } from './product-management.query';
import { ProductResponse } from 'src/product-management/presentation/http/dto/product-response.dto';
import { ProductRepository } from '../product.repository';

@QueryHandler(GetDetailProductQuery)
export class GetDetailProductQueryHandler
  implements IQueryHandler<GetDetailProductQuery>
{
  constructor(public readonly productRepository: ProductRepository) {}

  async execute(
    query: GetDetailProductQuery,
  ): Promise<ProductResponse> {
    return await this.productRepository.getDetailProduct(query.id)
  }
}

export const ProductManagementQueryHandlers = [
  GetDetailProductQueryHandler,
];
