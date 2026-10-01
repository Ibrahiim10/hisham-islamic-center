import { Router } from 'express';
import {
  createStudent,
  getStudentById,
  listStudentClasses,
  listStudents,
  updateStudent,
} from '../services/student.service.js';
import {
  createStudentBodySchema,
  listStudentsQuerySchema,
  updateStudentBodySchema,
} from '../validators/student.validators.js';

export const studentsRouter = Router();

studentsRouter.get('/classes', async (_req, res, next) => {
  try {
    const data = await listStudentClasses();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

studentsRouter.get('/', async (req, res, next) => {
  try {
    const query = listStudentsQuerySchema.parse(req.query);
    const data = await listStudents(query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

studentsRouter.get('/:id', async (req, res, next) => {
  try {
    const data = await getStudentById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

studentsRouter.post('/', async (req, res, next) => {
  try {
    const body = createStudentBodySchema.parse(req.body);
    const data = await createStudent(body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

studentsRouter.put('/:id', async (req, res, next) => {
  try {
    const body = updateStudentBodySchema.parse(req.body);
    const data = await updateStudent(req.params.id, body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
