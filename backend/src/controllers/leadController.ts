import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prisma';
import AppError from '../utils/AppError';
import { sendSuccess } from '../utils/responseHelper';

export const getLeads = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    sendSuccess(res, 'Leads fetched successfully', { leads });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    sendSuccess(res, 'Lead fetched successfully', { lead });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone, source } = req.body;

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        source,
      },
    });

    sendSuccess(res, 'Lead created successfully', { lead }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    sendSuccess(res, 'Lead status updated successfully', { lead });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      next(new AppError('Lead not found', 404));
      return;
    }

    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.lead.delete({
      where: { id },
    });

    sendSuccess(res, 'Lead deleted successfully');
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      next(new AppError('Lead not found', 404));
      return;
    }

    next(error);
  }
};
