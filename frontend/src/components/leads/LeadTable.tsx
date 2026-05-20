import useAuthStore from '../../store/authStore';
import useLeadStore from '../../store/leadStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { getStatusColor, getSourceColor, formatDate } from '../../utils/helpers';
import type { ILead } from '../../types';

interface LeadTableProps {
  onEdit: (lead: ILead) => void;
}

const LeadTable = ({ onEdit }: LeadTableProps) => {
  const { leads, isLoading, deleteLead, pagination, filters, setFilters } =
    useLeadStore();
  const { user } = useAuthStore();

  if (isLoading) return <Spinner />;

  // Empty state
  if (!isLoading && leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          No leads found
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Try changing filters or create a new lead
        </p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    await deleteLead(id);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header */}
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {lead.email}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      label={lead.status}
                      className={getStatusColor(lead.status)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      label={lead.source}
                      className={getSourceColor(lead.source)}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(lead)}
                      >
                        Edit
                      </Button>
                      {/* Only admin can delete */}
                      {user?.role === 'admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(lead._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {leads.length} of {pagination.total} leads
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => handlePageChange(filters.page! - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-300 px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(filters.page! + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTable;