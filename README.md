# Daily One-Tap Poll

A Farcaster Mini App + Frame that runs daily ETH UP/DOWN polls with streak multipliers.

## Features

- 🗳️ **ETHEREUM Polls** - Vote UP or DOWN on daily ETH price movements
- 🔐 **Neynar Validation** - Secure FID-based voting with identity verification
- 📊 **Price Snapshots** - Automated ETH price collection from Coinbase, Kraken, and Binance
- 🎯 **Streak Multipliers** - Exponential point rewards for consecutive correct predictions
- 🛡️ **Rate Limiting** - Protection against abuse with per-FID and per-IP limits
- 📱 **Mini App Interface** - Clean 424×695 modal-friendly design
- 🖼️ **Frame Integration** - Full Farcaster frame support with OG images

## Quick Start

### Prerequisites

- **Node.js 20 LTS** (required - Node 24+ causes native build issues)
- **pnpm** (recommended package manager)
- **Upstash Redis** account
- **Neynar API** key

### 1. Environment Setup

```bash
# Use Node 20 LTS
nvm install 20
nvm use 20

# Install pnpm
npm i -g pnpm

# Verify versions
node -v  # v20.x
pnpm -v  # 10.x
```

### 2. Install Dependencies

```bash
cd /Users/maxmckendry/Desktop/daily-one-tap-poll
pnpm install
```

### 3. Environment Configuration

```bash
cp env.example .env.local
```

Fill in your `.env.local`:

```env
APP_BASE_URL=http://localhost:3010
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
NEYNAR_API_KEY=your_neynar_api_key
```

### 4. Development

```bash
pnpm dev
```

Visit `http://localhost:3010` to see the mini app interface.

## API Endpoints

### Frame Endpoints
- `GET /api/frames` - Render the voting frame
- `POST /api/frames` - Process votes with Neynar validation

### Cron Endpoints
- `GET /api/cron/open` - Snapshot ETH price at 00:00:15 UTC
- `GET /api/cron/close` - Snapshot ETH price at 23:59:45 UTC and settle results

### Results
- `GET /api/results/[date]/image` - Generate OG image for results
- `GET /.well-known/farcaster.json` - Mini app manifest

## Rules & Mechanics

### Price Snapshots
- **Open**: 00:00:15 UTC (15 seconds after midnight)
- **Close**: 23:59:45 UTC (45 seconds before midnight)
- **Sources**: Coinbase, Kraken, Binance (median ETH mid-price)
- **Dead Zone**: ε = 0.10% (if |return| ≤ ε, result = FLAT)

### Point System
- **Base Points**: 1,000 per correct prediction
- **Streak Multiplier**: `min(32, 2^((streak-1) * 0.6))`
- **Streak Reset**: On FLAT days or incorrect predictions
- **Capped**: Maximum 32x multiplier

### Rate Limits
- **Per FID**: 5 votes per day
- **Per IP**: 100 requests per hour
- **Idempotency**: Second vote from same FID on same day doesn't increment counts

## Deployment

### Vercel Deployment

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Connect your GitHub repository
   - Add environment variables:
     - `APP_BASE_URL` (your Vercel domain)
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
     - `NEYNAR_API_KEY`

3. **Configure Crons**
   The `vercel.json` file includes cron jobs:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/open",
         "schedule": "15 0 * * *"
       },
       {
         "path": "/api/cron/close", 
         "schedule": "45 23 * * *"
       }
     ]
   }
   ```

4. **Update Assets**
   - Replace `/public/icon-1024.png` with your app icon
   - Replace `/public/splash-200.png` with your splash screen

5. **Sign Manifest**
   Update `/.well-known/farcaster.json` with your domain and sign the `accountAssociation`:

   ```json
   {
     "accountAssociation": {
       "header": "your_signed_header",
       "payload": "your_signed_payload", 
       "signature": "your_signature"
     },
     "frame": {
       "version": "1",
       "name": "Daily One-Tap Poll",
       "iconUrl": "https://your-domain.com/icon-1024.png",
       "homeUrl": "https://your-domain.com",
       "splashImageUrl": "https://your-domain.com/splash-200.png",
       "splashBackgroundColor": "#0b0b0b"
     }
   }
   ```

## Testing

### Manual Testing

1. **Frame Testing**
   ```bash
   curl http://localhost:3010/api/frames
   ```

2. **Cron Testing**
   ```bash
   curl http://localhost:3010/api/cron/open
   curl http://localhost:3010/api/cron/close
   ```

3. **Results Image**
   ```bash
   curl http://localhost:3010/api/results/today/image
   ```

### Acceptance Tests

- **A1**: Vote idempotency - Same FID voting twice increments only once
- **A2**: Close without open - Close cron errors with open missing (500)
- **A3**: FLAT day - With open=50000, close=50045 (+0.09%), result=FLAT; all streaks reset
- **A4**: Streak growth - Correct 3 days in a row awards exponential points
- **A5**: Locking - Calling close cron twice only settles once
- **A6**: Mini App meta - fc:miniapp present in rendered HTML

## Data Retention

Redis keys are organized as follows:

```
poll:{date}              # Poll configuration
poll:{date}:votes        # FID -> vote mapping
poll:{date}:counts       # Vote counts by option
price:{date}:open        # Opening price
price:{date}:close       # Closing price
result:{date}            # Daily result (UP/DOWN/FLAT)
settled:{date}           # Settlement flag
user:{fid}:streak        # User's current streak
user:{fid}:points        # User's total points
user:{fid}:ledger        # Transaction history
```

## Troubleshooting

### Common Issues

1. **Node Version Issues**
   ```bash
   # Ensure you're using Node 20 LTS
   node -v
   nvm use 20
   ```

2. **Dependency Conflicts**
   ```bash
   # Clean install
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

3. **TypeScript Errors**
   ```bash
   pnpm typecheck
   ```

4. **Rate Limit Issues**
   - Check Redis connection
   - Verify rate limit keys in Redis
   - Adjust limits in `src/lib/rate-limit.ts`

### Environment Variables

Required environment variables:
- `APP_BASE_URL` - Your app's base URL
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- `NEYNAR_API_KEY` - Neynar API key for validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.