import { useState, useEffect } from 'react';
import useLeadStore from '../store/leadStore';
import Navbar from '../components/layout/Navbar';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import type { ILead, LeadSource, LeadStatus } from '../types';

const STATUS_OPTIONS: LeadStatus[] = ['Interested', 'Not Interested', 'Converted'];
const SOURCE_OPTIONS: LeadSource[] = ['Call', 'WhatsApp', 'Field'];

const DashboardPage = () => {
  const { fetchLeads, leads } = useLeadStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | ''>('');

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

  const filteredLeads = leads.filter((lead) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      lead.name.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesSource = !sourceFilter || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Leads Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {leads.length} total leads
            </p>
          </div>
          <Button onClick={handleCreate}>+ Add Lead</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: leads.length },
            {
              label: 'Interested',
              value: leads.filter((l) => l.status === 'Interested').length,
            },
            {
              label: 'Not Interested',
              value: leads.filter((l) => l.status === 'Not Interested').length,
            },
            {
              label: 'Converted',
              value: leads.filter((l) => l.status === 'Converted').length,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-4 w-full"
            >
              <p className="text-sm text-gray-500">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px_auto] gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or phone"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as LeadStatus | '')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value as LeadSource | '')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Sources</option>
                {SOURCE_OPTIONS.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setSourceFilter('');
              }}
            >
              Reset
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <LeadTable leads={filteredLeads} onEdit={handleEdit} />
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedLead ? 'Update Status' : 'Create New Lead'}
      >
        <LeadForm lead={selectedLead} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default DashboardPage;
