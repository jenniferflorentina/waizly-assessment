import { IdVO } from '../vo/id.vo';

enum EventName {
  USER_REGISTERED = 'USER_REGISTERED',
  EMAIL_UPDATED = 'EMAIL_UPDATED',
}

abstract class EventHeader {
  readonly name: EventName;

  readonly actor: IdVO;

  readonly createdAt: Date;

  constructor(name: EventName, actor: IdVO, createdAt: Date) {
    this.name = name;
    this.actor = actor;
    this.createdAt = createdAt;
  }
}

abstract class EventPayload {
  readonly id: IdVO;
}

export abstract class Event<T extends EventPayload> {
  readonly header: EventHeader;

  readonly payload: T;

  constructor(header: EventHeader, payload: T) {
    this.header = header;
    this.payload = payload;
  }
}
