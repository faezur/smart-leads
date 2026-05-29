import { useState, useEffect } from 'react';
import useLeadStore from '../store/leadStore';
import Navbar from '../components/layout/Navbar';
import LeadFilters from '../components/layout/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import LeadDetails from '../components/leads/LeadDetails';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import type { ILead } from '../types';

interface DashboardPageProps {
  onToggleDark: () => void;
  isDark: boolean;
}

const DashboardPage = ({ onToggleDark, isDark }: DashboardPageProps) => {
  const { fetchLeads, leads, pagination, error, clearError } = useLeadStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleEdit = (lead: ILead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(false);
    setIsModalOpen(true);
  };

  const handleView = (lead: ILead) => {
    setSelectedLead(lead);
    setIsModalOpen(false);
    setIsDetailsOpen(true);
  };

  const handleCreate = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar onToggleDark={onToggleDark} isDark={isDark} />

      {/* 🔥 FIXED CONTAINER */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: pagination?.total ?? 0 },
            {
              label: 'New',
              value: leads.filter((l) => l.status === 'New').length,
            },
            {
              label: 'Qualified',
              value: leads.filter((l) => l.status === 'Qualified').length,
            },
            {
              label: 'Lost',
              value: leads.filter((l) => l.status === 'Lost').length,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 w-full"
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
        <div className="mb-4 w-full">
          <LeadFilters />
        </div>

        {error && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="font-medium text-red-800 hover:underline dark:text-red-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <LeadTable onEdit={handleEdit} onView={handleView} />
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedLead ? 'Edit Lead' : 'Create New Lead'}
      >
        <LeadForm lead={selectedLead} onClose={handleCloseModal} />
      </Modal>

      <Modal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        title="Lead Details"
      >
        {selectedLead && <LeadDetails lead={selectedLead} />}
      </Modal>
    </div>
  );
};

export default DashboardPage;
