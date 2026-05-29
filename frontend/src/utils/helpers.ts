// Format date to readable string
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Get status badge color
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    Interested: 'bg-blue-100 text-blue-700',
    'Not Interested': 'bg-red-100 text-red-700',
    Converted: 'bg-green-100 text-green-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

// Get source badge color
export const getSourceColor = (source: string): string => {
  const colors: Record<string, string> = {
    Call: 'bg-purple-100 text-purple-700',
    WhatsApp: 'bg-green-100 text-green-700',
    Field: 'bg-orange-100 text-orange-700',
  };
  return colors[source] || 'bg-gray-100 text-gray-700';
};

// Truncate long text
export const truncate = (text: string, length: number): string => {
  return text.length > length ? text.slice(0, length) + '...' : text;
};
