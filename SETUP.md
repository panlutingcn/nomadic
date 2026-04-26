# Smart Search Setup

## Environment Variables

To use the smart search feature, you need to configure the Deepseek API key:

1. Get your API key from https://platform.deepseek.com/
2. Add it to `.env.local`:

```
DEEPSEEK_API_KEY=your_actual_api_key_here
```

3. Restart the dev server

## Testing the Feature

Once configured, test the following:

1. **First-time guide modal** - Clear localStorage and refresh to see the welcome guide
2. **Multi-line search** - Enter queries like:
   - "柏林"
   - "我想去佛罗伦萨的画廊工作"
   - "欧洲哪里适合一个人安静写作？"
3. **AI insights** - After search, check the insights page for:
   - AI context banner at the top
   - Highlighted relevant sections (green glow)
4. **Error handling** - Low confidence queries should show error state

## Implementation Complete

All 11 tasks from the smart search phase 1 plan have been implemented:
- ✅ Deepseek API client
- ✅ Search API route
- ✅ Generic insights data
- ✅ Utility functions
- ✅ AppContext extension
- ✅ Error toast component
- ✅ Guide modal component
- ✅ Enhanced search box
- ✅ Homepage integration
- ✅ Insights page enhancement
- ✅ Testing & verification
