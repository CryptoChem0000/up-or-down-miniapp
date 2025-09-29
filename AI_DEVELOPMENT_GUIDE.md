# AI Development Guide for Farcaster Mini Apps

## 🤖 AI-Friendly Development Setup

This project is optimized for AI-assisted development using the official Farcaster Mini Apps documentation.

### 📚 Documentation Access
- **Complete Docs**: `farcaster-miniapps-docs.txt` (166KB) - Full documentation in LLM-friendly format
- **Online Docs**: https://miniapps.farcaster.xyz/docs/
- **AI Integration**: Documentation designed for LLM context windows

### ✅ Current Compliance Status

| Component | Status | Details |
|-----------|--------|---------|
| **Node.js** | ✅ Compliant | v24.4.1 (exceeds 22.11.0+ requirement) |
| **SDK** | ✅ Installed | @farcaster/miniapp-sdk@0.1.10 |
| **Ready Call** | ✅ Implemented | sdk.actions.ready() in FarcasterReadyFrame |
| **Frame Format** | ✅ Valid | Farcaster v2 JSON format |
| **CORS Headers** | ✅ Configured | Proper headers for Frame requests |

### 🚀 Key Implementation Details

#### SDK Ready() Call (Critical)
```typescript
// In FarcasterReadyFrame.tsx
import { sdk } from '@farcaster/miniapp-sdk'
await sdk.actions.ready() // Hides splash screen
```

#### Frame Format (Farcaster v2)
```json
{
  "version": "next",
  "imageUrl": "https://up-or-down-miniapp.vercel.app/api/results/today/image",
  "button": {
    "label": "🚀 Start",
    "action": "post"
  },
  "postUrl": "https://up-or-down-miniapp.vercel.app/api/vote"
}
```

### 🛠️ Development Tools

#### Local Testing
- **Frames.js Debugger**: Installed globally (`frames` command)
- **Local Server**: http://localhost:3000
- **Debugger UI**: http://localhost:42164

#### Production Deployment
- **Production URL**: https://up-or-down-miniapp.vercel.app/
- **Staging URL**: https://up-or-down-miniapp-git-staging-*.vercel.app/

### 📋 Next Steps for AI Development

1. **Enable Developer Mode**
   - Visit: https://farcaster.xyz/~/settings/developer-tools
   - Toggle on "Developer Mode"

2. **Publish App**
   - Provide creator information
   - Configure display settings
   - Make shareable in feeds

3. **Testing & Validation**
   - Use local frames.js debugger
   - Test with Farcaster debugger
   - Validate Frame format compliance

### 🔧 AI Development Best Practices

- Use the complete documentation (`farcaster-miniapps-docs.txt`) for context
- Follow the official SDK patterns exactly
- Test locally before deploying
- Validate Frame format with debugger tools
- Ensure proper CORS headers for Frame requests

### 📖 Documentation References

- **Getting Started**: https://miniapps.farcaster.xyz/docs/getting-started
- **Loading Guide**: https://miniapps.farcaster.xyz/docs/guides/loading
- **Publishing**: https://miniapps.farcaster.xyz/docs/guides/publishing
- **Full Docs**: `farcaster-miniapps-docs.txt`

---
*Generated for AI-assisted development of Farcaster Mini Apps*
