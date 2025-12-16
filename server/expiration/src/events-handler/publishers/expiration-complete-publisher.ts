import {
  Subjects,
  Publisher,
  ExpirationCompletedEvent,
} from '@alibabatickets/common';

export class ExpirationCompletedPublisher extends Publisher<
  ExpirationCompletedEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
