const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function runAgent(input: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `
            You are an Autonomous Enterprise Pipeline Agent.
            
            INPUT: ${JSON.stringify(input)}

            PIPELINE RULES:
            1. NO DUPLICATES: Every task ID must be unique. Do not repeat task types.
            2. LOG ORDER: Logs must follow the chronological sequence of the pipeline.
            3. FAILURE & RECOVERY: 
               - If "vendor_name" is missing or "amount" <= 0, the 'validation' task MUST have status: "failed".
               - If ANY task is "failed", you MUST append a 'recovery' task to the pipeline.
            4. PIPELINE STRUCTURE: Always include 'validation', 'processing', and 'finalization' stages.
          `
        }]
      }],
      generationConfig: {
        response_mime_type: "application/json",
        response_schema: {
          type: "object",
          properties: {
            reasoning: { type: "string" },
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string", enum: ["validation", "invoice_processing", "approval_required", "recovery_action", "finalization"] },
                  status: { type: "string", enum: ["completed", "failed", "pending", "in_progress"] },
                  created_at: { type: "string" }
                },
                required: ["id", "type", "status", "created_at"]
              }
            },
            logs: {
              type: "array",
              description: "Chronological audit trail of the pipeline execution",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  event: { type: "string" },
                  details: { type: "string" },
                  timestamp: { type: "string" }
                },
                required: ["id", "event", "details", "timestamp"]
              }
            }
          },
          required: ["reasoning", "tasks", "logs"]
        }
      }
    }),
  });

  if (!res.ok) throw new Error(`Gemini API Error: ${res.status}`);

  const data = await res.json();
  try {
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(content || '{"reasoning": "Error", "tasks": [], "logs": []}');
  } catch (e) {
    return { reasoning: "Parsing failed", tasks: [], logs: [] };
  }
}