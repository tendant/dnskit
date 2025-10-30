# dnskit

A DNS management toolkit built on top of [dnscontrol](https://github.com/StackExchange/dnscontrol), providing easy-to-use commands for fetching, managing, and backing up DNS records.

## Features

- Fetch existing DNS records from Cloudflare
- Create timestamped backups of DNS records
- Preview DNS changes before applying them
- Validate DNS configurations
- Apply DNS changes with safety confirmations
- Export records in JSON or YAML format
- Extensible design for multiple DNS providers (currently supports Cloudflare)

## Prerequisites

- **dnscontrol**: See [INSTALL.md](INSTALL.md) for installation instructions
- **jq**: Required for JSON processing (install via `brew install jq` on macOS or `apt-get install jq` on Linux)
- **curl**: For API calls (usually pre-installed)

Optional:
- **yq**: For YAML output support
- **python3**: Alternative for YAML conversion

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd dnskit
   ```

2. Install dnscontrol (see [INSTALL.md](INSTALL.md))

3. Set up your Cloudflare credentials:
   ```bash
   cp config/creds.json.template config/creds.json
   # Edit config/creds.json with your Cloudflare API token and account ID
   ```

4. Add dnskit to your PATH:
   ```bash
   export PATH="$PATH:$(pwd)/bin"
   # Or add to your ~/.bashrc or ~/.zshrc
   ```

## Configuration

### Cloudflare Credentials

Create `config/creds.json` from the template:

```json
{
  "cloudflare": {
    "TYPE": "CLOUDFLAREAPI",
    "accountid": "your-cloudflare-account-id",
    "apitoken": "your-cloudflare-api-token"
  }
}
```

To get your Cloudflare API token:
1. Log in to Cloudflare Dashboard
2. Go to My Profile > API Tokens
3. Create a token with Zone:Read and Zone:DNS:Edit permissions

### DNS Configuration

Create `config/dnsconfig.js` to define your DNS records. See `config/dnsconfig.js.sample` for examples.

Example:
```javascript
var REG_NONE = NewRegistrar("none");
var DSP_CLOUDFLARE = NewDnsProvider("cloudflare");

D("example.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  A("@", "192.0.2.1"),
  A("www", "192.0.2.1"),
  CNAME("blog", "example.com."),
  MX("@", 10, "mail.example.com."),
  TXT("@", "v=spf1 include:_spf.example.com ~all")
);
```

## Usage

### Test Connection

Test your Cloudflare API credentials:

```bash
dnskit test
```

This verifies that your API token is working and shows a sample of your zones.

### List Zones

List all zones in your Cloudflare account:

```bash
dnskit list
```

### Fetch DNS Records

Fetch and display DNS records from Cloudflare in raw JSON format:

```bash
# Fetch records in JSON format (default)
dnskit fetch example.com

# Fetch records in YAML format
dnskit fetch example.com -f yaml

# Save to a file
dnskit fetch example.com -o records.json
```

### Export DNS Records

Export DNS records to dnscontrol format (JavaScript) that you can edit and reapply:

```bash
# Export to default location (config/dnsconfig.js)
dnskit export example.com

# Export to custom file
dnskit export example.com -o my-dns-config.js

# Append multiple domains to one file
dnskit export example.com -o config/dnsconfig.js
dnskit export another-domain.com -o config/dnsconfig.js -a
```

This creates a `dnsconfig.js` file that you can:
1. Edit to add/remove/modify DNS records
2. Validate with `dnskit validate`
3. Preview changes with `dnskit preview`
4. Apply with `dnskit apply`

### Backup DNS Records

Create timestamped backups:

```bash
# Backup to default directory (./backups)
dnskit backup example.com

# Backup to custom directory
dnskit backup example.com -d /path/to/backups

# Backup in YAML format
dnskit backup example.com -f yaml
```

### Preview Changes

Preview what changes would be made without applying them:

```bash
dnskit preview
```

This is useful to verify your changes before applying them to production.

### Validate Configuration

Validate your DNS configuration and credentials:

```bash
dnskit validate
```

This checks:
- JSON syntax in credentials file
- Cloudflare API credentials validity
- DNS configuration syntax

### Apply Changes

Apply DNS changes to Cloudflare:

```bash
# Interactive mode (asks for confirmation)
dnskit apply

# Skip confirmation
dnskit apply --force
```

**WARNING**: This modifies your live DNS records. Always run `dnskit preview` first!

## Workflow Examples

### Starting Fresh: Export Existing DNS

If you want to manage existing DNS records with dnskit:

```bash
# 1. Test your connection
dnskit test

# 2. Export existing DNS to dnscontrol format
dnskit export example.com

# 3. Review the generated configuration
cat config/dnsconfig.js

# 4. Make changes to the file
vim config/dnsconfig.js

# 5. Preview what will change
dnskit preview

# 6. Apply the changes
dnskit apply
```

### Regular DNS Management

Typical workflow for managing DNS:

```bash
# 1. Create a backup before making changes
dnskit backup example.com

# 2. Edit your DNS configuration
vim config/dnsconfig.js

# 3. Validate the configuration
dnskit validate

# 4. Preview the changes
dnskit preview

# 5. Apply the changes
dnskit apply
```

### Managing Multiple Domains

Export and manage multiple domains in one configuration file:

```bash
# Export all your domains
dnskit export example.com -o config/dnsconfig.js
dnskit export another-domain.com -o config/dnsconfig.js -a
dnskit export third-domain.com -o config/dnsconfig.js -a

# Now you can manage all domains together
dnskit preview
dnskit apply
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `dnskit test` | Test Cloudflare API connection and credentials |
| `dnskit list` | List all zones in your Cloudflare account |
| `dnskit fetch <domain>` | Fetch DNS records in JSON/YAML format |
| `dnskit export <domain>` | Export DNS records to dnscontrol format (editable) |
| `dnskit backup <domain>` | Create timestamped backup of DNS records |
| `dnskit preview` | Preview DNS changes without applying |
| `dnskit apply` | Apply DNS changes to Cloudflare |
| `dnskit validate` | Validate DNS configuration |
| `dnskit version` | Show version information |
| `dnskit help` | Show help message |

## Project Structure

```
dnskit/
├── bin/              # CLI executables
│   ├── dnskit        # Main CLI entry point
│   ├── dnskit-fetch
│   ├── dnskit-backup
│   ├── dnskit-preview
│   ├── dnskit-apply
│   └── dnskit-validate
├── lib/              # Helper libraries
│   ├── common.sh     # Common functions
│   └── cloudflare.sh # Cloudflare-specific functions
├── config/           # Configuration files
│   ├── creds.json.template
│   ├── dnsconfig.js.sample
│   └── .gitignore
├── examples/         # Example configurations
├── backups/          # Default backup directory (created automatically)
├── INSTALL.md        # Installation instructions
└── README.md         # This file
```

## Troubleshooting

### "dnscontrol is not installed"

Install dnscontrol following the instructions in [INSTALL.md](INSTALL.md).

### "Credentials file not found"

Copy the template and fill in your credentials:
```bash
cp config/creds.json.template config/creds.json
```

### "jq is not installed"

Install jq:
- macOS: `brew install jq`
- Linux: `apt-get install jq` or `yum install jq`

### "Zone not found for domain"

Make sure:
1. The domain is added to your Cloudflare account
2. Your API token has the correct permissions
3. The domain name is spelled correctly

## Future Enhancements

- Support for additional DNS providers (AWS Route53, Google Cloud DNS, etc.)
- Batch operations for multiple domains
- DNS record templates
- Integration tests
- Migration to Go for better performance (if needed)

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

See [LICENSE](LICENSE) file for details.

## Resources

- [dnscontrol Documentation](https://docs.dnscontrol.org/)
- [Cloudflare API Documentation](https://developers.cloudflare.com/api/)
