
import { createClient } from './src/utils/supabase/server';

async function checkStatuses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tables')
    .select('status');

  if (error) {
    console.error('Error fetching statuses:', error);
    return;
  }

  const uniqueStatuses = Array.from(new Set(data.map(t => t.status)));
  console.log('Unique statuses in database:', uniqueStatuses);
}

checkStatuses();
