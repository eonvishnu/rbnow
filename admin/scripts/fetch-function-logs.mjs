const projectRef = 'xsdkpbvvbjzvchlsdizi';

async function fetchLogs() {
  const cliTokenRes = await fetch('https://api.supabase.com/v1/projects/' + projectRef + '/analytics/endpoints/logs.all?sql=select+timestamp%2C+event_message%2C+metadata+from+edge_logs+order+by+timestamp+desc+limit+30', {
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN || ''}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('Status:', cliTokenRes.status);
  const data = await cliTokenRes.json();
  console.log('Logs:', JSON.stringify(data, null, 2));
}

fetchLogs();
