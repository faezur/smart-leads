import { useState, useEffect } from 'react';
import useLeadStore from '../store/leadStore';
import useAuthStore from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import LeadFilters from '../components/layout/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import type { ILead } from '../types';

interface DashboardPageProps {
  onToggleDark: () => void;
  isDark: boolean;
}

const DashboardPage = ({ onToggleDark, isDark }: DashboardPageProps) => {
  const { fetchLeads, leads, pagination } = useLeadStore();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleEdit = (lead: ILead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar onToggleDark={onToggleDark} isDark={isDark} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Leads Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pagination?.total ?? 0} total leads
            </p>
          </div>
          <Button onClick={handleCreate}>+ Add Lead</Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: pagination?.total ?? 0, color: 'blue' },
            {
              label: 'New',
              value: leads.filter((l) => l.status === 'New').length,
              color: 'blue',
            },
            {
              label: 'Qualified',
              value: leads.filter((l) => l.status === 'Qualified').length,
              color: 'green',
            },
            {
              label: 'Lost',
              value: leads.filter((l) => l.status === 'Lost').length,
              color: 'red',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4">
          <LeadFilters />
        </div>

        {/* Table */}
        <LeadTable onEdit={handleEdit} />
      </main>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedLead ? 'Edit Lead' : 'Create New Lead'}
      >
        <LeadForm lead={selectedLead} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default DashboardPage;