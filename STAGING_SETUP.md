# Staging Setup with Mock Data

This staging branch includes mock data for UX testing on mobile devices.

## Environment Variables for Staging

Set these environment variables in your Vercel staging environment:

```
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SHOW_DEV_LINKS=true
```

## Mock Data Features

### My Stats Section
- **Username**: alice.eth (displayed as "Alice")
- **Rank**: #15
- **Points**: 284
- **Accuracy**: 78%
- **Current Streak**: 7
- **Total Votes**: 23

### Leaderboard
- **15 mock users** with realistic stats
- **Current user (Alice)** appears at rank #15
- **Varied performance** across users (68-94% accuracy)
- **Realistic point ranges** (284-1247 points)
- **Avatar images** from DiceBear API

## Testing Instructions

1. Deploy this branch to Vercel staging
2. Set the environment variables above
3. Test on mobile devices to see:
   - Leaderboard with populated data
   - Your Stats section with real-looking numbers
   - Loading states and animations
   - Responsive design with data

## Production Safety

- Mock data is **only enabled** when `NEXT_PUBLIC_USE_MOCK_DATA=true`
- Production deployments will use real data
- No changes to production code or APIs
