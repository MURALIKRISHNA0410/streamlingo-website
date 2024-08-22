export async function POST(req) {
    const response = await fetch('http://127.0.0.1:8000/Audio', {
      method: 'POST',
      body: req.body,
      duplex:'half'
    });
  
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }