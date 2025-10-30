# Quick Start Guide

Get started with dnskit in 5 minutes!

## Step 1: Install dnscontrol

macOS:
```bash
brew install dnscontrol
```

Linux:
```bash
curl -sL https://github.com/StackExchange/dnscontrol/releases/latest/download/dnscontrol-Linux -o /usr/local/bin/dnscontrol
chmod +x /usr/local/bin/dnscontrol
```

See [INSTALL.md](INSTALL.md) for more options.

## Step 2: Install jq (for JSON processing)

macOS:
```bash
brew install jq
```

Linux:
```bash
sudo apt-get install jq  # Debian/Ubuntu
# or
sudo yum install jq      # RHEL/CentOS
```

## Step 3: Set up Cloudflare credentials

1. Get your Cloudflare API token:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to **My Profile > API Tokens**
   - Click **Create Token**
   - Use the "Edit zone DNS" template or create custom token with:
     - Zone:Zone:Read
     - Zone:DNS:Edit

2. Create credentials file:
   ```bash
   cp config/creds.json.template config/creds.json
   ```

3. Edit `config/creds.json` with your credentials:
   ```json
   {
     "cloudflare": {
       "TYPE": "CLOUDFLAREAPI",
       "accountid": "your-cloudflare-account-id",
       "apitoken": "your-api-token-here"
     }
   }
   ```

## Step 4: Create your first DNS configuration

Option A: Start with an example:
```bash
cp examples/basic-website.js config/dnsconfig.js
# Edit config/dnsconfig.js to match your domain
```

Option B: Use the sample:
```bash
cp config/dnsconfig.js.sample config/dnsconfig.js
# Edit config/dnsconfig.js with your DNS records
```

## Step 5: Try it out!

1. **Validate your setup:**
   ```bash
   ./bin/dnskit validate
   ```

2. **Fetch existing DNS records:**
   ```bash
   ./bin/dnskit fetch yourdomain.com
   ```

3. **Preview changes:**
   ```bash
   ./bin/dnskit preview
   ```

4. **Create a backup:**
   ```bash
   ./bin/dnskit backup yourdomain.com
   ```

5. **Apply changes (when ready):**
   ```bash
   ./bin/dnskit apply
   ```

## Optional: Add to PATH

For easier access, add dnskit to your PATH:

```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$PATH:/path/to/dnskit/bin"
```

Then you can use `dnskit` from anywhere:
```bash
dnskit fetch example.com
dnskit preview
dnskit apply
```

## Need Help?

- See [README.md](README.md) for full documentation
- Check [examples/](examples/) for configuration examples
- Visit [dnscontrol docs](https://docs.dnscontrol.org/) for advanced features

## Common First Tasks

### Fetch and backup all records from existing domain
```bash
dnskit fetch example.com -o my-current-dns.json
dnskit backup example.com
```

### Set up new domain from scratch
```bash
cp examples/basic-website.js config/dnsconfig.js
# Edit config/dnsconfig.js
dnskit validate
dnskit preview
dnskit apply
```

### Update existing DNS records
```bash
# Backup first!
dnskit backup example.com

# Edit configuration
vim config/dnsconfig.js

# Preview changes
dnskit preview

# Apply if everything looks good
dnskit apply
```
