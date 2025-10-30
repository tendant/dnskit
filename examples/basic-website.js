// Basic Website Configuration
// A simple configuration for a typical website with email

var REG_NONE = NewRegistrar("none");
var DSP_CLOUDFLARE = NewDnsProvider("cloudflare");

D("example.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  // Root domain and www subdomain pointing to the same server
  A("@", "203.0.113.10"),
  A("www", "203.0.113.10"),

  // Mail server configuration
  MX("@", 10, "mail.example.com."),
  A("mail", "203.0.113.20"),

  // SPF record to specify authorized mail servers
  TXT("@", "v=spf1 mx ~all"),

  // DKIM record (example - you'll get this from your email provider)
  TXT("default._domainkey", "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3..."),

  // DMARC policy
  TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@example.com"),

  // Optional: Verification records for various services
  TXT("@", "google-site-verification=abcdef123456"),

  // FTP server (if needed)
  CNAME("ftp", "example.com.")
);
