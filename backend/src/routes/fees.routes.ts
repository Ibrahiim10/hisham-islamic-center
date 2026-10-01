import { Router } from 'express';
import {
  computeMonthlyFeeSummary,
  computeMonthlyFeeTrend,
  listStudentFeeAccounts,
} from '../services/feeCalculation.service.js';
import { buildActiveClassFeeMap } from '../services/feeLookup.service.js';
import { getStudentFeeDetails, listFeePayments, recordFeePayment } from '../services/fee.service.js';
import {
  feeAccountsQuerySchema,
  feePaymentsQuerySchema,
  feeSummaryQuerySchema,
  feeTrendQuerySchema,
  recordPaymentBodySchema,
} from '../validators/fee.validators.js';

export const feesRouter = Router();

function resolveMonthYear(query: { month?: number; year?: number }): { month: number; year: number } {
  const now = new Date();
  return {
    month: query.month ?? now.getMonth() + 1,
    year: query.year ?? now.getFullYear(),
  };
}

feesRouter.get('/summary', async (req, res, next) => {
  try {
    const query = feeSummaryQuerySchema.parse(req.query);
    const { month, year } = resolveMonthYear(query);
    const data = await computeMonthlyFeeSummary(month, year);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

feesRouter.get('/trends', async (req, res, next) => {
  try {
    const query = feeTrendQuerySchema.parse(req.query);
    const { month, year } = resolveMonthYear(query);
    const data = await computeMonthlyFeeTrend(month, year, query.months);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

feesRouter.get('/config', async (_req, res, next) => {
  try {
    const classFeeMap = await buildActiveClassFeeMap();
    const data = [...classFeeMap.values()].sort((a, b) => a.className.localeCompare(b.className));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

feesRouter.get('/accounts', async (req, res, next) => {
  try {
    const query = feeAccountsQuerySchema.parse(req.query);
    const { month, year } = resolveMonthYear(query);
    const data = await listStudentFeeAccounts({
      month,
      year,
      search: query.search,
      classId: query.classId,
      status: query.status,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

feesRouter.get('/student/:studentId', async (req, res, next) => {
  try {
    const query = feeSummaryQuerySchema.parse(req.query);
    const { month, year } = resolveMonthYear(query);
    const data = await getStudentFeeDetails(req.params.studentId, month, year);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

feesRouter.post('/payments', async (req, res, next) => {
  try {
    const body = recordPaymentBodySchema.parse(req.body);
    if (!req.authUser) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    const data = await recordFeePayment(body, req.authUser.id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

feesRouter.get('/', async (req, res, next) => {
  try {
    const query = feePaymentsQuerySchema.parse(req.query);
    const data = await listFeePayments({
      month: query.month,
      year: query.year,
      search: query.search,
      classId: query.classId,
      studentId: query.studentId,
      page: query.page,
      limit: query.limit,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
