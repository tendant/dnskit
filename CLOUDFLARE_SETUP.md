# Cloudflare API Setup Guide

## Creating an API Token (Recommended)

API Tokens are more secure and provide fine-grained permissions compared to API Keys.

### Step 1: Log in to Cloudflare

Go to [https://dash.cloudflare.com/](https://dash.cloudflare.com/) and log in.

### Step 2: Navigate to API Tokens

1. Click on your profile icon (top right)
2. Select **My Profile**
3. Click on **API Tokens** in the left sidebar
4. Click **Create Token**

### Step 3: Create Token

**Option A: Use a Template (Easiest)**
1. Find the **Edit zone DNS** template
2. Click **Use template**
3. Under **Zone Resources**, select:
   - Include → Specific zone → Select your domain
   - OR Include → All zones (if managing multiple domains)
4. Click **Continue to summary**
5. Click **Create Token**
6. **COPY THE TOKEN** - you won't be able to see it again!

**Option B: Custom Token**
1. Click **Create Custom Token**
2. Give it a name (e.g., "dnskit")
3. Add these permissions:
   - Zone → Zone → Read
   - Zone → DNS → Edit
4. Under **Zone Resources**:
   - Include → All zones (or select specific zones)
5. Click **Continue to summary**
6. Click **Create Token**
7. **COPY THE TOKEN** - you won't be able to see it again!

### Step 4: Configure dnskit

1. Copy the credentials template:
   ```bash
   cp config/creds.json.template config/creds.json
   ```

2. Edit `config/creds.json`:
   ```json
   {
     "cloudflare": {
       "TYPE": "CLOUDFLAREAPI",
       "apitoken": "paste-your-token-here"
     }
   }
   ```

3. Test your connection:
   ```bash
   bin/dnskit test
   ```

## Required Permissions for API Token

For full dnskit functionality, your API token needs these permissions:

| Permission | Access Level | Required For |
|------------|--------------|--------------|
| Zone → Zone | Read | Listing zones, validating domains |
| Zone → DNS | Read | Fetching existing DNS records |
| Zone → DNS | Edit | Applying DNS changes |

## Troubleshooting

### Error: "No route for that URI" (Code 7000)

This usually means:
- You're using an API Key format instead of API Token
- The token is malformed (extra spaces, quotes, or line breaks)
- The credentials file has incorrect JSON format

**Solution:**
1. Make sure you're using an **API Token**, not an API Key
2. The token should be a single continuous string (no spaces or line breaks)
3. Verify your JSON syntax with: `cat config/creds.json | jq .`

### Error: "Authentication error" (Code 10000)

Your token is invalid or expired.

**Solution:**
- Generate a new token in Cloudflare dashboard
- Make sure you copied the entire token

### Error: "Zone not found"

The domain doesn't exist in your Cloudflare account.

**Solution:**
1. Run `bin/dnskit list` to see available zones
2. Make sure the domain is added to your Cloudflare account
3. Check spelling of the domain name

### Error: "Insufficient permissions"

Your token doesn't have the required permissions.

**Solution:**
- Go back to API Tokens in Cloudflare
- Edit your token
- Add Zone:Read and DNS:Edit permissions

## API Key vs API Token

**API Keys (Legacy - Not Recommended):**
- Global access to entire account
- Less secure
- Format: `email` + `key`

**API Tokens (Recommended):**
- Scoped permissions
- More secure
- Can be limited to specific zones
- Format: Single token string

**dnskit supports both**, but API Tokens are strongly recommended.

If you must use API Keys, your `creds.json` should look like:
```json
{
  "cloudflare": {
    "TYPE": "CLOUDFLAREAPI",
    "email": "your-email@example.com",
    "apikey": "your-global-api-key"
  }
}
```

But again, **use API Tokens instead** for better security!
