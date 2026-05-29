import Badge from '../ui/Badge';
import { formatDate, getSourceColor, getStatusColor } from '../../utils/helpers';
import type { ILead } from '../../types';

interface LeadDetailsProps {
  lead: ILead;
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
    <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-900 dark:text-white">
      {value}
    </span>
  </div>
);

const LeadDetails = ({ lead }: LeadDetailsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {lead.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge label={lead.status} className={getStatusColor(lead.status)} />
        <Badge label={lead.source} className={getSourceColor(lead.source)} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailRow label="Created At" value={formatDate(lead.createdAt)} />
        <DetailRow label="Updated At" value={formatDate(lead.updatedAt)} />
        <DetailRow label="Owner" value={lead.createdBy?.name || 'Unknown'} />
        <DetailRow label="Owner Email" value={lead.createdBy?.email || 'Unknown'} />
      </div>
    </div>
  );
};

export default LeadDetails;
