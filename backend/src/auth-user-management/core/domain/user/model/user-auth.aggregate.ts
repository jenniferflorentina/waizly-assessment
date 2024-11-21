import { AggregateRoot } from 'src/common/interface/aggregate-root.abstract';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { PhoneNumberVO } from 'src/common/vo/phone-number.vo';
import { ShortNameVO } from 'src/common/vo/short-name.vo';
import { GenderVO } from 'src/common/vo/gender.vo';
import { DateVO } from 'src/common/vo/date.vo';
import { IdVO } from 'src/common/vo/id.vo';
import { EmailVO } from 'src/common/vo/email.vo';
import { CredentialModel } from './credential.model';
import { FirstNameVO } from '../vo/first-name.vo';

export class UserAuthModel extends AggregateRoot {
  private firstName: FirstNameVO;

  private lastName: ShortNameVO;

  private credentials: CredentialModel;

  private gender: GenderVO;

  private dateOfBirth: DateVO;

  private phoneNumber: PhoneNumberVO | null;

  constructor(
    id: IdVO,
    firstName: FirstNameVO,
    lastName: ShortNameVO,
    gender: GenderVO,
    dateOfBirth: DateVO,
    phoneNumber: PhoneNumberVO | null,
    credentials: CredentialModel,
    auditTrail: AuditTrailVO,
  ) {
    super(id, auditTrail);
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
    this.credentials = credentials;
  }

  getFirstName(): FirstNameVO {
    return this.firstName;
  }

  getLastName(): ShortNameVO {
    return this.lastName;
  }

  getGender(): GenderVO {
    return this.gender;
  }

  getDateOfBirth(): DateVO {
    return this.dateOfBirth;
  }

  getCredentials(): CredentialModel {
    return this.credentials;
  }

  getAuditTrail(): AuditTrailVO {
    return this.auditTrail;
  }

  getPhoneNumber(): PhoneNumberVO | null {
    return this.phoneNumber;
  }

  setCredentialEmail(email: EmailVO) {
    this.credentials.setEmail(email);
  }
}
