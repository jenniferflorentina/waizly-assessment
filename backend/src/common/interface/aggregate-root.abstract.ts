import { AuditTrailVO } from '../vo/audit-trail.vo';
import { IdVO } from '../vo/id.vo';

export abstract class AggregateRoot {
  id: IdVO;

  auditTrail: AuditTrailVO;

  constructor(id: IdVO, auditTrail: AuditTrailVO) {
    this.id = id;
    this.auditTrail = auditTrail;
  }

  getId(): IdVO {
    return this.id;
  }

  getAuditTrail(): AuditTrailVO {
    return this.auditTrail;
  }
}
