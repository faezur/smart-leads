const axios = require('axios');

const API_URL = process.env.SEED_API_URL || 'http://localhost:5000/api';
const SEED_EMAIL = process.env.SEED_EMAIL;
const SEED_PASSWORD = process.env.SEED_PASSWORD;

const leads = [
  { name: 'KL Rahul', email: 'klrahul@example.com', status: 'New', source: 'Instagram' },
  { name: 'Shubman Gill', email: 'gill@example.com', status: 'Qualified', source: 'Website' },
  { name: 'Rishabh Pant', email: 'pant@example.com', status: 'Contacted', source: 'Referral' },
  { name: 'Jasprit Bumrah', email: 'bumrah@example.com', status: 'Lost', source: 'Instagram' },
  { name: 'Aarav Mehta', email: 'aarav@example.com', status: 'New', source: 'Website' },
  { name: 'Kabir Khan', email: 'kabir@example.com', status: 'Qualified', source: 'Instagram' },
  { name: 'Zoya Ali', email: 'zoya@example.com', status: 'Contacted', source: 'Referral' },
  { name: 'Ananya Sharma', email: 'ananya@example.com', status: 'Lost', source: 'Website' },
  { name: 'Vihaan Gupta', email: 'vihaan@example.com', status: 'New', source: 'Instagram' },
  { name: 'Sara Khan', email: 'sara@example.com', status: 'Contacted', source: 'Referral' },
  { name: 'Rohan Das', email: 'rohan@example.com', status: 'Qualified', source: 'Website' },
  { name: 'Tanya Singh', email: 'tanya@example.com', status: 'Lost', source: 'Instagram' },
];

const seedLeads = async () => {
  if (!SEED_EMAIL || !SEED_PASSWORD) {
    throw new Error('Set SEED_EMAIL and SEED_PASSWORD before running the seed script.');
  }

  const loginRes = await axios.post(`${API_URL}/auth/login`, {
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
  });

  const token = loginRes.data.data.token;

  for (const lead of leads) {
    await axios.post(`${API_URL}/leads`, lead, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`Added: ${lead.name}`);
  }

  console.log('Sample leads added successfully.');
};

seedLeads().catch((err) => {
  console.error('Seed failed:', err.response?.data || err.message);
  process.exit(1);
});
