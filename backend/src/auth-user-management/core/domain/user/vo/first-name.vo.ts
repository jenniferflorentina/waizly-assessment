import { ShortNameVO } from 'src/common/vo/short-name.vo';

export class FirstNameVO extends ShortNameVO {
  constructor(value: string) {
    super(value);
    if (!value) {
      throw new Error('FirstName is required.');
    }
  }
}
