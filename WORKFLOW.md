# Complete DNS Management Workflow

## Two Ways to Get DNS Records

### 1. `dnskit fetch` - Raw Data (JSON/YAML)
For backups, auditing, or data processing:

```bash
# Get raw JSON data
dnskit fetch example.com

# Save to file
dnskit fetch example.com -o backup.json

# Get YAML format
dnskit fetch example.com -f yaml
```

**Use this when:**
- Creating backups
- Auditing DNS records
- Processing data with scripts
- Comparing DNS configurations

### 2. `dnskit export` - Editable Format
For managing and updating DNS records:

```bash
# Export to dnscontrol format
dnskit export example.com

# Creates config/dnsconfig.js that looks like:
# D("example.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
#   A("@", "192.0.2.1"),
#   CNAME("www", "example.com"),
#   MX("@", 10, "mail.example.com")
# );
```

**Use this when:**
- You want to edit and update DNS records
- Managing DNS as code
- Making changes to existing DNS

## Complete Workflow: From Export to Update

### Step 1: Export Existing DNS

```bash
# Export your domain's DNS to dnscontrol format
bin/dnskit export example.com
```

This creates `config/dnsconfig.js` with your current DNS records.

### Step 2: Review the Configuration

```bash
cat config/dnsconfig.js
```

You'll see something like:

```javascript
D("example.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  CNAME("test", "www.example.com")
);
```

### Step 3: Edit the Configuration

```bash
vim config/dnsconfig.js
```

Add, modify, or remove records:

```javascript
D("example.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  // Add new A record
  A("@", "192.0.2.1"),
  A("www", "192.0.2.1"),

  // Keep existing CNAME
  CNAME("test", "www.example.com"),

  // Add mail server
  MX("@", 10, "mail.example.com"),

  // Add SPF record
  TXT("@", "v=spf1 mx ~all")
);
```

### Step 4: Validate Configuration

```bash
bin/dnskit validate
```

This checks:
- JSON syntax in credentials
- JavaScript syntax in dnsconfig.js
- API connectivity

### Step 5: Preview Changes

```bash
bin/dnskit preview
```

This shows you **exactly what will change** without making any changes:
- Records to be created (shown in green)
- Records to be modified (shown in yellow)
- Records to be deleted (shown in red)

### Step 6: Create Backup (Optional but Recommended)

```bash
bin/dnskit backup example.com
```

This saves a timestamped backup to `backups/` directory.

### Step 7: Apply Changes

```bash
bin/dnskit apply
```

This applies the changes to your live DNS. You'll be asked to confirm unless you use `--force`.

## Managing Multiple Domains

Export all domains to one configuration file:

```bash
# First domain (creates file)
bin/dnskit export domain1.com -o config/dnsconfig.js

# Additional domains (append to file)
bin/dnskit export domain2.com -o config/dnsconfig.js -a
bin/dnskit export domain3.com -o config/dnsconfig.js -a
```

Your `config/dnsconfig.js` will contain all domains:

```javascript
D("domain1.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  A("@", "192.0.2.1")
);

D("domain2.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  A("@", "192.0.2.2")
);

D("domain3.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  A("@", "192.0.2.3")
);
```

Then manage all at once:
```bash
bin/dnskit preview   # Preview all changes
bin/dnskit apply     # Apply all changes
```

## Quick Reference

| Task | Command |
|------|---------|
| Test connection | `bin/dnskit test` |
| List all domains | `bin/dnskit list` |
| Get raw JSON data | `bin/dnskit fetch domain.com` |
| Export for editing | `bin/dnskit export domain.com` |
| Create backup | `bin/dnskit backup domain.com` |
| Validate config | `bin/dnskit validate` |
| Preview changes | `bin/dnskit preview` |
| Apply changes | `bin/dnskit apply` |

## File Formats Explained

### JSON (from `fetch`)
```json
{
  "result": [
    {
      "type": "A",
      "name": "example.com",
      "content": "192.0.2.1",
      "ttl": 1,
      "proxied": false
    }
  ]
}
```
**Use for:** Backups, data processing

### dnscontrol JS (from `export`)
```javascript
D("example.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  A("@", "192.0.2.1"),
  CNAME("www", "example.com")
);
```
**Use for:** Editing and updating DNS

## Tips

1. **Always preview before applying:** `dnskit preview` shows you exactly what will change
2. **Create backups:** Before making major changes, run `dnskit backup`
3. **Start small:** Test with one domain first, then expand to multiple domains
4. **Version control:** Consider putting your `config/` directory in git (but exclude `creds.json`)
5. **Use comments:** Document your DNS records in `dnsconfig.js`

## Example: Complete Migration

Let's say you want to migrate from manually managing DNS to using dnskit:

```bash
# 1. Export all your domains
bin/dnskit list | jq -r '.result[].name' > domains.txt

# 2. Export each domain
while read domain; do
  bin/dnskit export "$domain" -o config/dnsconfig.js -a
done < domains.txt

# 3. Review the complete configuration
cat config/dnsconfig.js

# 4. Test that everything works
bin/dnskit preview

# You should see "No changes" since we just exported existing records

# 5. Now you can manage all DNS as code!
# Make changes to config/dnsconfig.js
# Then: bin/dnskit preview && bin/dnskit apply
```

## Troubleshooting

**"No changes" when you expect changes:**
- Make sure you're editing the correct file
- Check that the domain name matches exactly
- Run `bin/dnskit validate` to check for syntax errors

**Preview shows unexpected changes:**
- dnscontrol may normalize some values (like lowercasing)
- TTL defaults may differ
- Proxied status (CF_PROXY_ON/OFF) affects A/CNAME records

**"Zone not found" error:**
- Check domain spelling
- Run `bin/dnskit list` to see available zones
- Ensure domain is in your Cloudflare account
