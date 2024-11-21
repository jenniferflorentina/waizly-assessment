import { IdVO } from 'src/common/vo/id.vo';
import { ProductModel } from 'src/product-management/core/domain/product/model/product.model';


export class CreateProductCommand {
  constructor(public readonly payload: ProductModel) {}
}

export class UpdateProductCommand {
  constructor(public readonly payload: ProductModel) {}
}

export class DeleteProductCommand {
  constructor(
    public readonly userId: IdVO,
    public readonly productId: IdVO,
  ) {}
}
