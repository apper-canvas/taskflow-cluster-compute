// Cloudflare Workers globals
// Custom action for generating AI-powered task descriptions
// Uses apper.serve() pattern for edge function deployment

// Declare globals for Cloudflare Workers environment
const Response = globalThis.Response || global.Response;
const fetch = globalThis.fetch || global.fetch;
const apper = globalThis.apper || global.apper;

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      // Parse request body
      const { title } = await request.json();

      // Validate input
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Title is required and must be a non-empty string'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Get OpenAI API key from environment
      const apiKey = await apper.getSecret('OPENAI_API_KEY');
      if (!apiKey) {
        return new Response(JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Prepare OpenAI API request
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that generates concise, professional task descriptions based on task titles. Keep descriptions between 1-3 sentences, focused on what needs to be accomplished, and suitable for project management contexts.'
            },
            {
              role: 'user',
              content: `Generate a professional task description for this task title: "${title.trim()}"`
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.text();
        console.error('OpenAI API error:', errorData);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to generate description from AI service'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      const openaiData = await openaiResponse.json();
      
      // Extract generated description
      const description = openaiData.choices?.[0]?.message?.content?.trim();
      
      if (!description) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No description generated from AI service'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Return successful response
      return new Response(JSON.stringify({
        success: true,
        description: description
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Error in generate-task-description function:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }
};

// Edge Functions entry point
if (typeof apper !== 'undefined') {
  apper.serve(async (request) => {
    const module = await import('@/apper/functions/generate-task-description.js');
    return module.default.fetch(request);
  });
}