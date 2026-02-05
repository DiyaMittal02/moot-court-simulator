# 🤖 Setting Up Real Gemini AI

Your moot court simulator now has **REAL AI** integration! 🎉

But it needs a Gemini API key to work. Don't worry - it's **100% FREE** and takes **2 minutes**!

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: Get Your Free Gemini API Key

1. **Visit**: https://ai.google.dev/
2. **Click**: "Get API Key in Google AI Studio"
3. **Sign in**: With your Google account
4. **Create API Key**: Click "Create API Key"
5. **Copy**: Your new API key (looks like: `AIzaSyD...`)

### Step 2: Add to Environment Variables

#### For Local Development:

Create a file called `.env` in the `new-moot-court` root directory:

```bash
GEMINI_API_KEY=AIzaSyD_your_actual_key_here
JWT_SECRET=moot-court-secret-key-2024
PORT=4000
NODE_ENV=development
```

#### For Render Deployment:

1. Go to your Render dashboard
2. Click on your **Backend** service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your API key from Step 1

---

## ✅ What This Enables

With the real Gemini API:

### 🎯 Argument Analysis
- **Real-time AI feedback** on legal arguments
- **Dynamic scoring** based on actual content
- **Personalized suggestions** for each argument
- **Contextual improvements** specific to legal reasoning

### 📊 Case Strategy Generation
- **Intelligent case analysis** using AI
- **Custom strategies** for each case
- **Relevant precedents** suggested by AI
- **Winning path recommendations**

### 💡 Smart Insights
- Understands legal terminology
- Recognizes case structure
- Evaluates evidence quality
- Detects logical fallacies

---

## 🆓 Is It Really Free?

**YES!** Google Gemini offers:
- **60 requests per minute** (way more than you need)
- **1,500 requests per day** (more than enough)
- **FREE tier** with no credit card required

Perfect for development and testing!

---

## 🔒 Without API Key (Fallback Mode)

If you don't add an API key, the system will:
- Still work perfectly fine ✓
- Use intelligent fallback analysis ✓
- Provide basic scoring and feedback ✓
- NOT crash or error ✓

**But** the feedback won't be as personalized or intelligent.

---

## 🧪 Test It Works

After adding your API key:

### Local Test:
```bash
# Restart your dev server
npm run dev:all

# In another terminal, test the AI:
curl -X POST http://localhost:4000/api/ai-analyze \
  -H "Content-Type: application/json" \
  -d '{"argument": "The defendant's rights were violated when police interrogated him without reading Miranda warnings."}'
```

You should see AI-generated analysis!

### Production Test:
1. Deploy to Render with API key added
2. Go to your courtroom
3. Type an argument
4. Click "AI Feedback"
5. See real AI analysis! 🎉

---

## 📝 Example AI Responses

### Without API Key (Fallback):
```json
{
  "score": 75,
  "strengths": ["Good level of detail", "Professional language"],
  "improvements": ["Add more legal precedents", "Expand on key points"],
  "suggestion": "Consider citing specific case law..."
}
```

### With Real Gemini AI:
```json
{
  "score": 82,
  "strengths": [
    "Strong invocation of Miranda v. Arizona precedent",
    "Clear articulation of Fifth Amendment protections",
    "Excellent use of legal terminology"
  ],
  "improvements": [
    "Could strengthen by citing Escobedo v. Illinois",
    "Consider addressing potential counterargument regarding waiver",
    "Add specific facts about the interrogation context"
  ],
  "suggestion": "Bolster your argument by demonstrating how custodial interrogation without warnings creates inherently coercive circumstances, drawing parallels to the Supreme Court's reasoning in Miranda."
}
```

**See the difference?** 🚀

---

## 🐛 Troubleshooting

### "Gemini AI not initialized"
- Check that `GEMINI_API_KEY` is set in environment variables
- Restart your server after adding the key
- Verify the key is valid (no extra spaces)

### "API quota exceeded"
- You hit the free tier limit (rare)
- Wait 24 hours for quota to reset
- Or create a new API key

### "Invalid API key"
- Make sure you copied the entire key
- Check for extra spaces/newlines
- Generate a new key if needed

---

## 🎓 How It Works

```mermaid
┌─────────────┐
│   User      │ Types argument
│ Courtroom   │────────────────┐
└─────────────┘                │
                               ▼
                    ┌──────────────────┐
                    │  Backend Server  │
                    │   (Node.js)      │
                    └──────────────────┘
                               │
                               │ Send to Gemini
                               ▼
                    ┌──────────────────┐
                    │  Google Gemini   │
                    │   AI Model       │
                    └──────────────────┘
                               │
                               │ AI Analysis
                               ▼
                    ┌──────────────────┐
                    │  Structured      │
                    │  Feedback JSON   │
                    └──────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │   Frontend UI    │
                    │  Shows Results   │
                    └──────────────────┘
```

---

## 🌟 Pro Tips

1. **Rate Limiting**: The AI service includes automatic retries and fallbacks
2. **Caching**: Consider caching common arguments to save API calls
3. **Monitoring**: Check Render logs to see AI requests working
4. **Upgrading**: If you need more requests, Gemini has paid tiers (but you won't need them)

---

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Get API Key](https://ai.google.dev/)
- [Pricing & Limits](https://ai.google.dev/pricing)
- [Best Practices](https://ai.google.dev/docs/best_practices)

---

## ✨ You're All Set!

Your moot court simulator now has **real AI superpowers**! 🚀

Questions? Check the troubleshooting section or the main README.

**Enjoy teaching students with cutting-edge AI technology!** 🎓
