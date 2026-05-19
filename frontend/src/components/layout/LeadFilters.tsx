import { useCallback, useEffect, useRef } from 'react';
import useLeadStore from '../../store/leadStore';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { LeadStatus, LeadSource } from '../../types';

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const LeadFilters = () => {
  const { filters, setFilters, exportCSV } = useLeadStore();
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search — waits 500ms after user stops typing
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (searchRef.current) clearTimeout(searchRef.current);

      searchRef.current = setTimeout(() => {
        setFilters({ search: value, page: 1 });
      }, 500);
    },
    [setFilters]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ status: e.target.value as LeadStatus | '', page: 1 });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ source: e.target.value as LeadSource | '', page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ sort: e.target.value as 'latest' | 'oldest' });
  };

  const handleReset = () => {
    setFilters({ status: '', source: '', search: '', sort: 'latest', page: 1 });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Input
            label="Search"
            type="text"
            placeholder="Search by name or email..."
            defaultValue={filters.search}
            onChange={handleSearch}
          />
        </div>

        {/* Status filter */}
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100
              dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Source filter */}
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Source
          </label>
          <select
            value={filters.source}
            onChange={handleSourceChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100
              dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Sources</option>
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort
          </label>
          <select
            value={filters.sort}
            onChange={handleSortChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100
              dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" size="md" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;