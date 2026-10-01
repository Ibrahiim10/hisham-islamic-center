export { UserModel } from './User.model.js';
export { ClassModel } from './Class.model.js';
export { FeeStructureModel } from './FeeStructure.model.js';
export { StudentModel } from './Student.model.js';
export { PaymentModel } from './Payment.model.js';
export { AttendanceModel } from './Attendance.model.js';
export { NotificationModel } from './Notification.model.js';
export { IslamicContentModel } from './IslamicContent.model.js';
export { QuranLearningRecordModel } from './QuranLearningRecord.model.js';
export { QuranLessonRecordModel } from './QuranLessonRecord.model.js';

import { AttendanceModel } from './Attendance.model.js';
import { ClassModel } from './Class.model.js';
import { FeeStructureModel } from './FeeStructure.model.js';
import { IslamicContentModel } from './IslamicContent.model.js';
import { NotificationModel } from './Notification.model.js';
import { PaymentModel } from './Payment.model.js';
import { QuranLearningRecordModel } from './QuranLearningRecord.model.js';
import { QuranLessonRecordModel } from './QuranLessonRecord.model.js';
import { StudentModel } from './Student.model.js';
import { UserModel } from './User.model.js';

const allModels = [
  UserModel,
  ClassModel,
  FeeStructureModel,
  StudentModel,
  PaymentModel,
  AttendanceModel,
  NotificationModel,
  IslamicContentModel,
  QuranLearningRecordModel,
  QuranLessonRecordModel,
];

/** Ensures all schema indexes are created in the database. */
export async function syncAllModelIndexes(): Promise<void> {
  await Promise.all(allModels.map((model) => model.syncIndexes()));
}
