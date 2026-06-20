const Groq = require('groq-sdk');


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const buildSystemPrompt = () => `
You are an expert personal finance assistant for an AI Expense Tracker app.
You help users understand their spending patterns, save money, and make better financial decisions.
Always respond in the same language the user writes in (Hindi or English).
Keep responses concise, actionable, and friendly.
Format responses with bullet points when listing suggestions.
Always use Indian Rupee (₹) for amounts.
`;

const buildUserContext = (userQuestion, { expenses, categoryTotals, totalSpent }) => {
    const categoryBreakdown = categoryTotals
        .map((c) => `${c._id}: ₹${c.total.toLocaleString('en-IN')} (${Math.round((c.total / totalSpent) * 100)}%)`)
        .join('\n');

    const recentExpenses = expenses
        .slice(0, 10)
        .map((e) => `- ${e.title} | ₹${e.amount} | ${e.category} | ${new Date(e.date).toLocaleDateString('en-IN')}`)
        .join('\n');

    return `
USER FINANCIAL DATA (Last 3 months):


Total Spent: ₹${totalSpent.toLocaleString('en-IN')}

Category Breakdown:
${categoryBreakdown}

Recent Transactions:
${recentExpenses}

User Question: ${userQuestion}
`;
};

const askGroq = async (userQuestion, financialContext) => {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: 'system', content: buildSystemPrompt() },
            { role: 'user', content: buildUserContext(userQuestion, financialContext) },
        ],
        temperature: 0.7,
        max_tokens: 1024,

    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
};

module.exports ={askGroq};