import { NextResponse } from 'next/server';

/**
 * Retry logic for transient API failures
 * Retries once after 1 second delay if 503 or transient error occurs
 */
async function callGeminiWithRetry(
  url: string,
  options: RequestInit,
  retryCount: number = 0
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // If 503 Service Unavailable and we haven't retried yet, retry after 1 second
    if (response.status === 503 && retryCount === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return callGeminiWithRetry(url, options, 1);
    }
    
    return response;
  } catch (error: any) {
    // Retry on network/transient errors if not already retried
    if (retryCount === 0 && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return callGeminiWithRetry(url, options, 1);
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { birthdayName, age, habits } = await request.json();

    if (!birthdayName || !age || !habits || !Array.isArray(habits)) {
      return NextResponse.json({ error: 'Missing or invalid parameters.' }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY || '';
    if (!key) {
      return NextResponse.json({ error: 'API Key not configured on the server.' }, { status: 500 });
    }

    const prompt = `You are a ruthless, modern-day comedy roastmaster writing for a satirical digital newspaper. Your job is to take brief inputs about a person's birthday and write a hyper-aggressive, hilarious, and highly shareable front-page roast.

CRITICAL CONSTRAINTS:
1. NO VINTAGE OR ARCHAIC LANGUAGE. Do not use words like "speakeasy," "flapper," "mortal coil," or "alas." Speak like a modern Indian millennial or Gen Z internet user. Use modern sarcasm.
2. EXTREME BREVITY. Mobile users do not read long paragraphs. The article body MUST NOT exceed 3 sentences (maximum 40 words).
3. BE BRUTAL BUT FUNNY. Treat their minor quirks and annoying habits as massive character flaws or breaking news tragedies.

INPUT FORMAT:
Name: ${birthdayName}
Age: ${age}
Funny Habits/Offences: ${habits.filter(Boolean).join(', ') || 'No habit provided'}

OUTPUT STRICTLY IN JSON FORMAT matching this schema:
{
  "mainHeadline": "A short, aggressive, all-caps headline that punches hard (Max 8 words)",
  "subHeadline": "A witty secondary headline (Max 12 words)",
  "articleBody": "Exactly 3 sentences of brutal, modern roasting based on their habits. Max 40 words.",
  "sidebarHeadline1": "Short 2-3 word roast",
  "sidebarText1": "One punchy sentence",
  "sidebarHeadline2": "Short 2-3 word roast",
  "sidebarText2": "One punchy sentence"
}

EXAMPLE INPUT:
Name: Abhiram
Age: 26
Funny Habits/Offences: speaks about ducati all the time, always complaining, acts matured for a 25 year old

EXAMPLE OUTPUT:
{
  "mainHeadline": "LOCAL 26-YEAR-OLD STILL PRETENDS HE CAN AFFORD DUCATI",
  "subHeadline": "Medical marvel: Man survives solely on complaining and unsolicited motorcycle advice.",
  "articleBody": "In a shocking turn of events, 26-year-old Abhiram has spent another year acting like a retired uncle while bringing absolutely zero Ducatis to the group chat. Friends report his daily routine consists of dropping heavy Italian engine specs and whining about minor inconveniences. Experts recommend muting his WhatsApp until his bank account matches his attitude.",
  "sidebarHeadline1": "CAUGHT LACKING",
  "sidebarText1": "Still riding a basic commuter despite acting like a MotoGP champion.",
  "sidebarHeadline2": "PREMATURE AGING",
  "sidebarText2": "Acts 45, has the emotional maturity of a toddler when mildly inconvenienced."
}

Do not include any conversational intro or outro. Return ONLY a valid JSON object. Do not wrap in markdown codeblocks like \`\`\`json.`;

    const splitSentences = (text: string) => {
      return text
        .match(/[^.!?]+[.!?]+/g)
        ?.map((sentence) => sentence.trim())
        .filter(Boolean) || [];
    };

    let resultText = '';

    if (key.startsWith('sk-ant-')) {
      // Call Anthropic API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json({ error: `Anthropic API error: ${errText}` }, { status: response.status });
      }

      const resData = await response.json();
      resultText = resData.content[0]?.text || '';
    } else {
      // Call Gemini API with retry logic
      try {
        const response = await callGeminiWithRetry(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ]
            })
          }
        );

        if (!response.ok) {
          // If still 503 after retry, return clean error message
          if (response.status === 503) {
            return NextResponse.json({ error: 'Roastmaster busy' }, { status: 503 });
          }
          const errText = await response.text();
          return NextResponse.json({ error: 'Roastmaster busy' }, { status: 500 });
        }

        const resData = await response.json();
        resultText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (apiError: any) {
        console.error('Gemini API Error:', apiError);
        return NextResponse.json({ error: 'Roastmaster busy' }, { status: 500 });
      }
    }

    // Clean up output in case it wrapped in markdown
    let cleanText = resultText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();

    try {
      const parsedData = JSON.parse(cleanText) as Record<string, unknown>;

      const articleBody = String(parsedData.articleBody || parsedData.body || '');
      const sentences = splitSentences(articleBody);
      const [articleText1 = '', articleText2 = '', articleText3 = ''] = sentences;

      const responseData = {
        mainHeadline: String(parsedData.mainHeadline || parsedData.headline || 'ROAST ALERT'),
        articleText1: String(parsedData.articleText1 || articleText1 || ''),
        articleText2: String(parsedData.articleText2 || articleText2 || ''),
        articleText3: String(parsedData.articleText3 || articleText3 || ''),
        weatherForecast: String(
          parsedData.weatherForecast ||
            'Clear skies with a 100% chance of public embarrassment.'
        ),
        localAnnouncement: String(
          parsedData.localAnnouncement ||
            'Official notice: This roast is trending for a reason.'
        ),
        advertisement: String(
          parsedData.advertisement ||
            'Buy less clout, sell more chill — instant relief from attention-seeking.'
        ),
        reporterName: String(parsedData.reporterName || 'Roast Reporter'),
      };

      return NextResponse.json(responseData);
    } catch (parseError) {
      console.error('Failed to parse model response:', cleanText);
      return NextResponse.json({ 
        error: 'Model response was not valid JSON.',
        rawResponse: cleanText 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
