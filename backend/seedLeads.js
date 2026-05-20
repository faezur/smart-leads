const axios = require("axios");

const API_URL = "https://smart-leads-backend-k5to.onrender.com/api";

const seedLeads = async () => {
  try {
    // ✅ STEP 1: LOGIN
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: "faezur@gmail.com",
      password: "Faezur",
    });

    const token = loginRes.data.data.token;
    console.log("✅ Logged in successfully");
    console.log("TOKEN:", token);

    // ✅ STEP 2: SAMPLE LEADS
    const leads = [
       { name: "KL Rahul", email: "klrahul@gmail.com", status: "New", source: "Instagram" },
  { name: "Shubman Gill", email: "gill@gmail.com", status: "Qualified", source: "Website" },
  { name: "Rishabh Pant", email: "pant@gmail.com", status: "Contacted", source: "Referral" },
  { name: "Jasprit Bumrah", email: "bumrah@gmail.com", status: "Lost", source: "Instagram" },
  { name: "Suryakumar Yadav", email: "sky@gmail.com", status: "New", source: "Website" },
  { name: "Ishan Kishan", email: "ishan@gmail.com", status: "Qualified", source: "Referral" },
  { name: "Ravindra Jadeja", email: "jadeja@gmail.com", status: "Contacted", source: "Website" },
  { name: "Shreyas Iyer", email: "iyer@gmail.com", status: "Lost", source: "Instagram" },
  { name: "Axar Patel", email: "axar@gmail.com", status: "New", source: "Referral" },
  { name: "Kuldeep Yadav", email: "kuldeep@gmail.com", status: "Qualified", source: "Website" },
  { name: "Mohammed Shami", email: "shami@gmail.com", status: "Contacted", source: "Instagram" },
  { name: "Bhuvneshwar Kumar", email: "bhuvi@gmail.com", status: "Lost", source: "Website" },
  { name: "Sanju Samson", email: "sanju@gmail.com", status: "New", source: "Instagram" },
  { name: "Deepak Chahar", email: "chahar@gmail.com", status: "Qualified", source: "Referral" },
  { name: "Yuzvendra Chahal", email: "chahal@gmail.com", status: "Contacted", source: "Website" },
  { name: "Arshdeep Singh", email: "arshdeep@gmail.com", status: "Lost", source: "Instagram" },
   { name: "Aarav Mehta", email: "aarav@gmail.com", status: "New", source: "Website" },
  { name: "Kabir Khan", email: "kabir@gmail.com", status: "Qualified", source: "Instagram" },
  { name: "Zoya Ali", email: "zoya@gmail.com", status: "Contacted", source: "Referral" },
  { name: "Ananya Sharma", email: "ananya@gmail.com", status: "Lost", source: "Website" },
  { name: "Vihaan Gupta", email: "vihaan@gmail.com", status: "New", source: "Instagram" },
  { name: "Ibrahim Sheikh", email: "ibrahim@gmail.com", status: "Qualified", source: "Website" },
  { name: "Sara Khan", email: "sara@gmail.com", status: "Contacted", source: "Referral" },
  { name: "Reyansh Jain", email: "reyansh@gmail.com", status: "Lost", source: "Instagram" },
  { name: "Aditi Verma", email: "aditi@gmail.com", status: "New", source: "Website" },
  { name: "Arjun Reddy", email: "arjun@gmail.com", status: "Qualified", source: "Referral" },
  { name: "Meera Iyer", email: "meera@gmail.com", status: "Contacted", source: "Website" },
  { name: "Dev Malhotra", email: "dev@gmail.com", status: "Lost", source: "Instagram" },
  { name: "Nisha Kapoor", email: "nisha@gmail.com", status: "New", source: "Referral" },
  { name: "Rohan Das", email: "rohan@gmail.com", status: "Qualified", source: "Website" },
  { name: "Tanya Singh", email: "tanya@gmail.com", status: "Contacted", source: "Instagram" },
  { name: "Kunal Arora", email: "kunal@gmail.com", status: "Lost", source: "Website" },
  { name: "Pooja Nair", email: "pooja@gmail.com", status: "New", source: "Instagram" },
  { name: "Aditya Roy", email: "aditya@gmail.com", status: "Qualified", source: "Referral" },
  { name: "Simran Kaur", email: "simran@gmail.com", status: "Contacted", source: "Website" },
  { name: "Faizan Ahmed", email: "faizan@gmail.com", status: "Lost", source: "Instagram" }
    ];

    // ✅ STEP 3: ADD LEADS
    for (let lead of leads) {
      await axios.post(`${API_URL}/leads`, lead, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`✅ Added: ${lead.name}`);
    }

    console.log("🔥 All leads added successfully!");
  } catch (err) {
    console.log("❌ Error:", err.response?.data || err.message);
  }
};

seedLeads();