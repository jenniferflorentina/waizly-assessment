import {
  Get,
  Body,
  Controller,
  Param,
  Post,
  Put,
  Request,
  ForbiddenException,
  Delete,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { ShortNameVO } from 'src/common/vo/short-name.vo';
import { IdVO } from 'src/common/vo/id.vo';
import { BaseResponse } from 'src/common/interface/response.abstract';
import {
  CreateProductDTO,
} from './dto/create-product-request.dto';
import { ProductResponse } from './dto/product-response.dto';
import { ProductModel } from 'src/product-management/core/domain/product/model/product.model';
import { CreateProductCommand, DeleteProductCommand, UpdateProductCommand } from '../bus/command/product-management.command';

@Controller('/product-management')
export default class ProductManagementHTTPController {
  private readonly logger = new Logger(ProductManagementHTTPController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('')
  async createProduct(
    @Request() req: any,
    @Body() dto: CreateProductDTO,
  ): Promise<BaseResponse<null>> {
    const { jwtPayload } = req;

    const auditTrail = new AuditTrailVO(
      new Date(),
      new IdVO(jwtPayload.userId),
      new Date(),
      new IdVO(jwtPayload.userId),
      null,
      null,
    );

    return new BaseResponse(
      await this.commandBus.execute(
        new CreateProductCommand(
          new ProductModel(
            IdVO.generate(),
            new ShortNameVO(dto.name),
            new ShortNameVO(dto.code),
            auditTrail,
          ),
        ),
      ),
    );
  }


  @Put('/:id')
  async updateProduct(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateProductDTO,
  ): Promise<BaseResponse<ProductResponse>> {
    const { jwtPayload } = req;

    const auditTrail = new AuditTrailVO(
      new Date(),
      new IdVO(jwtPayload.userId),
      new Date(),
      new IdVO(jwtPayload.userId),
      null,
      null,
    );

    return new BaseResponse(
      await this.commandBus.execute(
        new UpdateProductCommand(
          new ProductModel(
            new IdVO(id),
            new ShortNameVO(dto.name),
            new ShortNameVO(dto.code),
            auditTrail,
          ),
        ),
      ),
    );
  }

  @Put('/:id')
  async deleteProduct(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<BaseResponse<null>> {
    const { jwtPayload } = req;

    return new BaseResponse(
      await this.commandBus.execute(
        new DeleteProductCommand(
          new IdVO(jwtPayload.userId),
          new IdVO(id)
        ),
      ),
    );
  }
}