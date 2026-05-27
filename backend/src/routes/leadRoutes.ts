import { Router } from 'express';
import { z } from 'zod';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLeadStatus,
  deleteLead,
} from '../controllers/leadController';
import validate from '../middleware/validate';

const router = Router();

const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Phone must be at least 7 characters'),
  source: z.string().min(2, 'Source is required'),
});

const updateStatusSchema = z.object({
  status: z.enum(['Interested', 'Not Interested', 'Converted']),
});

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', validate(createLeadSchema), createLead);
router.put('/:id', validate(updateStatusSchema), updateLeadStatus);
router.delete('/:id', deleteLead);

export default router;
