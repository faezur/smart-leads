import { useState, useEffect } from 'react';
import useLeadStore from '../../store/leadStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { ILead, LeadFormData, LeadSource, LeadStatus } from '../../types';

interface LeadFormProps {
  lead?: ILead | null;
  onClose: () => void;
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const LeadForm = ({ lead, onClose }: LeadFormProps) => {
  const { createLead, updateLead, isSubmitting } = useLeadStore();

  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    status: 'New',
    source: 'Website',
  });

  const [formErrors, setFormErrors] = useState<Partial<LeadFormData>>({});

  // Prefill form if editing existing lead
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    }
  }, [lead]);

  const validate = (): boolean => {
    const errors: Partial<LeadFormData> = {};

    if (!formData.name || formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof LeadFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (lead) {
        await updateLead(lead._id, formData);
      } else {
        await createLead(formData);
      }
      onClose();
    } catch {
      // Error handled in store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        error={formErrors.name}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="john@example.com"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
      />

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Source */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Source
        </label>
        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {SOURCE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end mt-2">
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;