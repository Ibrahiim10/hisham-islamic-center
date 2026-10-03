import { Router } from 'express';
import {
  changeAdminPassword,
  createAdmin,
  deleteAdmin,
  listAdmins,
  updateAdmin,
} from '../services/admin.service.js';
import {
  changeAdminPasswordBodySchema,
  createAdminBodySchema,
  updateAdminBodySchema,
} from '../validators/admin.validators.js';

export const adminsRouter = Router();

adminsRouter.get('/', async (_req, res, next) => {
  try {
    const data = await listAdmins();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminsRouter.post('/', async (req, res, next) => {
  try {
    const body = createAdminBodySchema.parse(req.body);
    const data = await createAdmin(body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminsRouter.patch('/:id', async (req, res, next) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    const body = updateAdminBodySchema.parse(req.body);
    const data = await updateAdmin(req.params.id, body, req.authUser.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminsRouter.delete('/:id', async (req, res, next) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    await deleteAdmin(req.params.id, req.authUser.id);
    res.json({ success: true, message: 'Administrator deleted successfully' });
  } catch (error) {
    next(error);
  }
});

adminsRouter.post('/:id/change-password', async (req, res, next) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    const body = changeAdminPasswordBodySchema.parse(req.body);
    await changeAdminPassword(req.params.id, req.authUser.id, body);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});
