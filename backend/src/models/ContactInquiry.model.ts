import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const contactInquirySchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    subject: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true },
);

contactInquirySchema.index({ createdAt: -1 });

export type ContactInquiry = InferSchemaType<typeof contactInquirySchema>;
export type ContactInquiryDocument = HydratedDocument<ContactInquiry>;

export const ContactInquiryModel = model('ContactInquiry', contactInquirySchema);
