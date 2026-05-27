import { useState, useEffect } from 'react';
import useLeadStore from '../../store/leadStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { ILead, LeadFormData, LeadSource, LeadStatus } from '../../types';

interface LeadFormProps {
  lead?: ILead | null;
  onClose: () => void;
}

const STATUS_OPTIONS: LeadStatus[] = ['Interested', 'Not Interested', 'Converted'];
const SOURCE_OPTIONS: LeadSource[] = ['Call', 'WhatsApp', 'Field'];

const LeadForm = ({ lead, onClose }: LeadFormProps) => {
  const { createLead, updateLeadStatus, isSubmitting } = useLeadStore();
  const [status, setStatus] = useState<LeadStatus>('Interested');
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    source: 'Call',
  });
  const [formErrors, setFormErrors] = useState<Partial<LeadFormData>>({});

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setFormData({
        name: lead.name,
        phone: lead.phone,
        source: lead.source,
      });
    }
  }, [lead]);

  const validate = (): boolean => {
    const errors: Partial<LeadFormData> = {};

    if (!formData.name || formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone || formData.phone.length < 7) {
      errors.phone = 'Phone must be at least 7 characters';
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

    try {
      if (lead) {
        await updateLeadStatus(lead.id, status);
      } else {
        if (!validate()) return;
        await createLead(formData);
      }
      onClose();
    } catch {
      // Error handled in store.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!lead && (
        <>
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
            label="Phone"
            type="tel"
            name="phone"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            error={formErrors.phone}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Source
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100
               "
            >
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {lead && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100
             "
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3 justify-end mt-2">
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {lead ? 'Update Status' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
