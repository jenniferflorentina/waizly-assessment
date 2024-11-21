import { Model } from 'src/common/interface/model.abstract';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { IdVO } from 'src/common/vo/id.vo';
import { ShortNameVO } from 'src/common/vo/short-name.vo';
import { PhoneNumberVO } from 'src/common/vo/phone-number.vo';
import { FirstNameVO } from '../vo/first-name.vo';
import { UrlVO } from 'src/common/vo/url.vo';
import { GenderVO } from 'src/common/vo/gender.vo';
import { DateVO } from 'src/common/vo/date.vo';

export class UserBasicModel extends Model {
  private firstName: FirstNameVO;

  private lastName: ShortNameVO;

  private phoneNumber: PhoneNumberVO | null;

  private imagePath: UrlVO | null;

  private gender: GenderVO | null;

  private dateOfBirth: DateVO | null;

  constructor(
    id: IdVO,
    firstName: FirstNameVO,
    lastName: ShortNameVO,
    phoneNumber: PhoneNumberVO | null,
    gender: GenderVO | null,
    dateOfBirth: DateVO | null,
    auditTrail: AuditTrailVO,
    imagePath?: UrlVO | null,
  ) {
    super(id, auditTrail);
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.imagePath = imagePath ?? null;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
  }

  public getFirstName(): FirstNameVO {
    return this.firstName;
  }

  public getLastName(): ShortNameVO {
    return this.lastName;
  }

  public getPhoneNumber(): PhoneNumberVO | null {
    return this.phoneNumber;
  }

  public getGender(): GenderVO | null {
    return this.gender;
  }

  public getDateOfBirth(): DateVO | null {
    return this.dateOfBirth;
  }

  public getImagePath(): UrlVO | null {
    return this.imagePath;
  }
}
