import { Model } from 'src/common/interface/model.abstract';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { IdVO } from 'src/common/vo/id.vo';
import { ShortNameVO } from 'src/common/vo/short-name.vo';

export class ProductModel extends Model {
  private name: ShortNameVO;

  private code: ShortNameVO;

  constructor(
    id: IdVO,
    name: ShortNameVO,
    code: ShortNameVO,
    auditTrail: AuditTrailVO,
  ) {
    super(id, auditTrail);
    this.code = code;
    this.name = name;
  }

  public getName(): ShortNameVO {
    return this.name;
  }

  public getCode(): ShortNameVO {
    return this.code;
  }
}
