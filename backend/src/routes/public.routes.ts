import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AdmissionApplicationModel } from '../models/AdmissionApplication.model.js';
import { ContactInquiryModel } from '../models/ContactInquiry.model.js';
import {
  admissionApplicationBodySchema,
  contactInquiryBodySchema,
} from '../validators/public.validators.js';

const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});

export const publicRouter = Router();

publicRouter.use(publicFormLimiter);

publicRouter.post('/admissions', async (req, res, next) => {
  try {
    const body = admissionApplicationBodySchema.parse(req.body);
    const doc = await AdmissionApplicationModel.create({
      ...body,
      dateOfBirth: new Date(`${body.dateOfBirth}T00:00:00.000Z`),
      notes: body.notes ?? '',
    });
    res.status(201).json({
      success: true,
      message: 'Admission request received. Our team will contact you.',
      data: { id: doc._id.toString() },
    });
  } catch (error) {
    next(error);
  }
});

publicRouter.post('/contact', async (req, res, next) => {
  try {
    const body = contactInquiryBodySchema.parse(req.body);
    const doc = await ContactInquiryModel.create({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone ?? '',
      subject: body.subject ?? '',
      message: body.message,
    });
    res.status(201).json({
      success: true,
      message: 'Thank you. Your message has been received.',
      data: { id: doc._id.toString() },
    });
  } catch (error) {
    next(error);
  }
});
