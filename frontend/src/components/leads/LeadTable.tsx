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
  const {
    leads,
    isLoading,
    deleteLead,
    pagination,
    setPage // ✅ IMPORTANT
  } = useLeadStore();

  const { user } = useAuthStore();

  if (isLoading) return <Spinner />;

  if (!isLoading && leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-12 text-center">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-lg font-medium">No leads found</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    await deleteLead(id);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Source</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="px-6 py-4">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>

                  <td className="px-6 py-4">
                    <Badge label={lead.status} className={getStatusColor(lead.status)} />
                  </td>

                  <td className="px-6 py-4">
                    <Badge label={lead.source} className={getSourceColor(lead.source)} />
                  </td>

                  <td className="px-6 py-4">
                    {formatDate(lead.createdAt)}
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    <Button size="sm" onClick={() => onEdit(lead)}>
                      Edit
                    </Button>

                    {user?.role === 'admin' && (
                      <Button size="sm" variant="danger" onClick={() => handleDelete(lead._id)}>
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">

          <p className="text-sm">
            Showing {leads.length} of {pagination.total} leads
          </p>

          <div className="flex items-center gap-2">

            <Button
              size="sm"
              variant="secondary"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage(pagination.page - 1)} // ✅ FIX
            >
              Previous
            </Button>

            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              size="sm"
              variant="secondary"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage(pagination.page + 1)} // ✅ FIX
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