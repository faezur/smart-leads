import { Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import AppError from '../utils/AppError';
import { sendSuccess, sendError, sendPaginated } from '../utils/responseHelper';
import { AuthRequest, LeadQuery, ILeadDocument } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Parser } = require('json2csv') as {
  Parser: new () => {
    parse: (data: Array<Record<string, string>>) => string;
  };
};

// Get all leads with filtering, search, sort and pagination
export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sort = 'latest',
    } = req.query as LeadQuery;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object based on query params
    const filter: Record<string, unknown> = {};

    // Role based filter — sales user sees only their leads
    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.userId;
    }

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // Filter by source if provided
    if (source) {
      filter.source = source;
    }

    // Search by name or email using regex
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort by latest or oldest
    const sortOrder = sort === 'latest' ? -1 : 1;

    // Run both queries in parallel for better performance
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    sendPaginated(res, 'Leads fetched successfully', leads, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

// Get single lead by id
export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Sales user can only view their own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      throw new AppError('Access denied', 403);
    }

    sendSuccess(res, 'Lead fetched successfully', { lead });
  } catch (error) {
    next(error);
  }
};

// Create new lead
export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user?.userId,
    });

    sendSuccess(res, 'Lead created successfully', { lead }, 201);
  } catch (error) {
    next(error);
  }
};

// Update lead by id
export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Sales user can only update their own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      throw new AppError('Access denied', 403);
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true } // return updated doc and run schema validators
    );

    sendSuccess(res, 'Lead updated successfully', { lead: updatedLead });
  } catch (error) {
    next(error);
  }
};

// Delete lead by id
export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Only admin can delete leads
    if (req.user?.role !== 'admin') {
      throw new AppError('Only admin can delete leads', 403);
    }

    await Lead.findByIdAndDelete(req.params.id);

    sendSuccess(res, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Export leads as CSV file
export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Build same filter as getLeads
    const filter: Record<string, unknown> = {};

    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.userId;
    }

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Format data for CSV
    const csvData = leads.map((lead: ILeadDocument) => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      'Created At': new Date(lead.createdAt).toLocaleDateString(),
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    // Set headers so browser downloads the file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).end(csv);
  } catch (error) {
    next(error);
  }
};
