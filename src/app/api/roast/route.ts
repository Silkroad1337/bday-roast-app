import { NextResponse } from 'next/server';

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

    const prompt = `You are a satirical writer for a 1920s newspaper tabloid "The Daily Roast".
Write a front-page birthday roast of a person with the following details:
Name: ${birthdayName}
Age: ${age}
Three funny habits:
1. ${habits[0] || 'No habit provided'}
2. ${habits[1] || 'No habit provided'}
3. ${habits[2] || 'No habit provided'}

Return a JSON object with these EXACT keys:
{
  "mainHeadline": "A sensationalist, dramatic, uppercase 1920s tabloid style headline",
  "articleText1": "Paragraph 1: Introduce the subject and age. Satirize their survival despite their questionable life decisions.",
  "articleText2": "Paragraph 2: Elaborate on the three funny habits in a detailed, exaggerated tabloid mock-investigation style.",
  "articleText3": "Paragraph 3: Conclude with a fake quote from an eyewitness or family member expressing shock or amusement.",
  "weatherForecast": "A 2-sentence humorous weather forecast tailored to the subject's habits (e.g., 90% chance of joint groans and sighing).",
  "localAnnouncement": "A funny public notice or announcement related to the subject.",
  "advertisement": "A funny vintage ad headline and text selling a fake solution for their habits (e.g., Miracle Balm No. 9 for Dad Jokes).",
  "reporterName": "A clever 1920s pen name (e.g., Snoop Sterling, Scoop McGee)"
}

Do not include any conversational intro or outro. Return ONLY a valid JSON object. Do not wrap in markdown codeblocks like \`\`\`json.`;

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
      // Call Gemini API
      const response = await fetch(
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
        const errText = await response.text();
        return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: response.status });
      }

      const resData = await response.json();
      resultText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
      const parsedData = JSON.parse(cleanText);
      return NextResponse.json(parsedData);
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
