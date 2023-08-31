import {
  Subjects,
  Publisher,
  ExpirationCompletedEvent,
} from '@alibabatickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompletedEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
