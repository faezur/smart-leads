import useLeadStore from '../../store/leadStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { getStatusColor, getSourceColor, formatDate } from '../../utils/helpers';
import type { ILead } from '../../types';

interface LeadTableProps {
  leads: ILead[];
  onEdit: (lead: ILead) => void;
}

const LeadTable = ({ leads, onEdit }: LeadTableProps) => {
  const { isLoading, deleteLead } = useLeadStore();

  if (isLoading) return <Spinner />;

  if (!isLoading && leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-lg font-medium text-gray-700">
          No leads found
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first lead to get started
        </p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    await deleteLead(id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {lead.name}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {lead.phone}
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
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(lead)}
                    >
                      Status
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(lead.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
