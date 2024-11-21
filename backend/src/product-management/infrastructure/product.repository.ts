import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { IdVO } from 'src/common/vo/id.vo';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { ShortNameVO } from 'src/common/vo/short-name.vo';
import { ProductModel } from '../core/domain/product/model/product.model';
import { ProductResponse } from '../presentation/http/dto/product-response.dto';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async getDetailProduct(
    id: IdVO,
  ): Promise<ProductResponse> {
    const product = await this.txHost.tx.products.findFirst({
      where:{
        id: id.getValue()
      },
    });

    if (!product){
      throw new NotFoundException("Product not found");
    }

    return new ProductResponse(
      product.id,
      product.name,
      product.code,
    )
  }

  async createProduct(
    product: ProductModel,
  ): Promise<void> {
    await this.txHost.tx.products.create({
      data: {
        id: product.getId().getValue(),
        name: product.getName().getValue(),
        code: product.getCode().getValue(),
        created_at: new Date(),
        created_by: product.getAuditTrail().getCreatedBy()?.getValue() ?? IdVO.generate().getValue(),
        updated_at: new Date(),
        updated_by: product.getAuditTrail().getUpdatedBy()?.getValue() ?? IdVO.generate().getValue(),
      },
    });
  }

  async updateProduct(
    product: ProductModel,
  ): Promise<boolean> {
    const updated = await this.txHost.tx.products.update({
      where:{
        id: product.getId().getValue()
      },
      data: {
        name: product.getName().getValue(),
        code: product.getCode().getValue(),
        updated_at: new Date(),
        updated_by: product.getAuditTrail().getUpdatedBy()?.getValue(),
      },
    });

    return !!(updated)
  }

  async findById(
    id: IdVO,
  ): Promise<ProductModel | null> {
    const product = await this.txHost.tx.products.findFirst({
      where:{
        id: id.getValue()
      },
    });

    if (!product){
      return null
    }

    return new ProductModel(
      new IdVO(product.id),
      new ShortNameVO(product.name),
      new ShortNameVO(product.code),
      new AuditTrailVO(
        product.created_at,
        new IdVO(product.created_by),
        product.updated_at,
        new IdVO(product.updated_by),
        product.deleted_at,
        product.deleted_by ? new IdVO(product.deleted_by) : null,
      )
    )
  }

  async deleteProduct(
    userId: IdVO,
    productId: IdVO
  ): Promise<void> {
    await this.txHost.tx.products.update({
      where:{
        id: productId.getValue()
      },
      data: {
        deleted_at: new Date(),
        deleted_by: userId.getValue(),
      },
    });
  }
}
