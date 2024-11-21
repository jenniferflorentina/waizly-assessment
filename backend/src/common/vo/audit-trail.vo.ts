import { IValueObject } from '../interface/value-object.interface';
import { EmailVO } from './email.vo';
import { IdVO } from './id.vo';

export class AuditTrailVO implements IValueObject {
  private readonly createdAt: Date;

  private readonly createdBy: IdVO | null;

  private readonly updatedAt: Date;

  private readonly updatedBy: IdVO | null;

  private readonly deletedAt: Date | null;

  private readonly deletedBy: IdVO | null;

  constructor(
    createdAt: Date,
    createdBy: IdVO,
    updatedAt: Date,
    updatedBy: IdVO | null = null,
    deletedAt: Date | null = null,
    deletedBy: IdVO | null = null,
  ) {
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;

    this.isValid();
  }

  public static createEmpty() {
    const curDate = new Date();

    return new AuditTrailVO(
      curDate,
      IdVO.generate(), // TODO change this
      curDate,
      null,
    );
  }

  public isValid(): boolean {
    const errors: string[] = [];

    if (!(this.createdAt instanceof Date)) {
      errors.push('createdAt must be a valid Date');
    }
    if (!(this.createdBy instanceof IdVO)) {
      errors.push('createdBy must be a valid IdVO');
    }
    if (!(this.updatedAt instanceof Date)) {
      errors.push('updatedAt must be a valid Date');
    }
    if (this.updatedBy !== null && !(this.updatedBy instanceof IdVO)) {
      errors.push('updatedBy must be null or a valid IdVO');
    }
    if (this.updatedAt < this.createdAt) {
      errors.push('updatedAt must be greater than or equal to createdAt');
    }

    if (errors.length > 0) {
      throw new Error(`Invalid audit trail: ${errors.join(', ')}`);
    }

    return true;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getCreatedBy(): IdVO | null {
    return this.createdBy;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getUpdatedBy(): IdVO | null {
    return this.updatedBy;
  }

  public getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  public getDeletedBy(): IdVO | null {
    return this.deletedBy;
  }

  public static mapFromPrisma(prismaObject: any) {
    // if (prismaObject === null) return null;

    return new AuditTrailVO(
      new Date(prismaObject.created_at),
      IdVO.generate(), // TODO use real email once everything is settled
      new Date(prismaObject.updated_at),
      null, // new EmailVO(prismaObject.updated_by),
      prismaObject.deleted_at ? new Date(prismaObject.deleted_at) : null,
      null, // prismaObject.deleted_by ? new EmailVO(prismaObject.deleted_by) : null,
    );
  }
}
