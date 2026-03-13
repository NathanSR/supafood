
const https = require('https');

const url = 'https://vvjwivwmrquzjnmhveit.supabase.co/rest/v1/tables?select=status';
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2andpdndtcnF1empubWh2ZWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjQ4MTIsImV4cCI6MjA4ODc0MDgxMn0.G3352nWYP4qTn0zcjsD65W6jTzYkzjmzHMDpjql_M84';

const options = {
  headers: {
    'apikey': apikey,
    'Authorization': `Bearer ${apikey}`
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const statuses = [...new Set(json.map(i => i.status))];
      console.log('STATUSES:', JSON.stringify(statuses));
    } catch (e) {
      console.error('Error parsing:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
