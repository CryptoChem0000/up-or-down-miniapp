# Mobile Notifications Setup

This document outlines the mobile notification system implemented for the Farcaster Mini App.

## Features

- **Farcaster Mentions**: Native Warpcast notifications via @mentions
- **Web Push**: Browser notifications for desktop/PWA users
- **Opt-in Consent**: Users must explicitly enable notifications
- **Rate Limited**: Respects API limits with proper delays
- **Cron Jobs**: Automated daily reminders and result notifications

## Environment Variables

Add these to your Vercel environment variables:

```bash
# Farcaster/Neynar API
NEYNAR_API_KEY=your_neynar_api_key
NEYNAR_SIGNER_UUID=your_signer_uuid

# Web Push (VAPID Keys)
VAPID_PUBLIC_KEY=BLAATtKeBnOhUUiEzZleFbqas0xzAg6Cg6lJ17Hl_DlBTV3NejhMDAkNxy6IL6yASCCVl0A2iETtJ0NA1jeJNMY
VAPID_PRIVATE_KEY=3Yb6u1f6FGUorG2NSCJW-lMx6PJZ2Qcm7N4BdmML0A8
VAPID_SUBJECT=mailto:admin@up-or-down-miniapp.vercel.app

# Admin/Testing
ADMIN_TOKEN=your_super_long_random_admin_token
DEBUG_NOTIFS=1

# App URL
APP_BASE_URL=https://up-or-down-miniapp.vercel.app
```

## API Endpoints

### Consent Management
- `GET /api/notifications/consent` - Get user notification preferences
- `POST /api/notifications/consent` - Update user notification preferences

### Web Push
- `GET /api/push/publicKey` - Get VAPID public key
- `POST /api/push/subscribe` - Subscribe user to push notifications
- `POST /api/push/send` - Admin endpoint to send push notifications

### Cron Jobs
- `POST /api/cron/send-reminders` - Send daily vote reminders (20:00 UTC)
- `POST /api/cron/send-results` - Send daily results (00:05 UTC)

### Testing
- `POST /api/test-notifications` - Send test notifications

## Cron Schedule

- **Reminders**: 20:00 UTC daily (8 PM)
- **Results**: 00:05 UTC daily (12:05 AM)

## Testing

### Dry Run
```bash
curl -X POST https://your-app.vercel.app/api/cron/send-reminders?dry=1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Test Notifications
```bash
# Test mention
curl -X POST https://your-app.vercel.app/api/test-notifications \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fid": "13840", "type": "mention"}'

# Test push
curl -X POST https://your-app.vercel.app/api/test-notifications \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fid": "13840", "type": "push"}'
```

## Data Storage

### Redis Keys
- `notif:consent:<fid>` - User notification preferences
- `push:subs:<fid>` - Web push subscriptions
- `results:lastNotified:<fid>` - Last result notification date
- `vote:lastRemindedDate:<fid>` - Last reminder date

## User Experience

1. **Settings UI**: Users can enable/disable notifications in the app
2. **Mobile WebView**: Web push is disabled in Warpcast mobile app
3. **Consent Required**: No notifications without explicit user consent
4. **Rate Limited**: Prevents spam and respects API limits

## Security

- All cron endpoints require admin token
- User consent is required for all notifications
- Expired push subscriptions are automatically cleaned up
- Debug logging is gated by `DEBUG_NOTIFS` environment variable
