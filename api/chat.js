export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body;

  try {
    const openaiMessages = [
      { role: 'system', content: system },
      ...messages
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: openaiMessages
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Unable to process your request.';
    return res.status(200).json({ content: [{ text: reply }] });
  } catch (err) {
    return res.status(500).json({ error: 'API request failed' });
  }
}
