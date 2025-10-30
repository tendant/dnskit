// Modern Web Application Configuration
// Configuration for a modern web app with API, CDN, and third-party services

var REG_NONE = NewRegistrar("none");
var DSP_CLOUDFLARE = NewDnsProvider("cloudflare");

D("myapp.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  // Main application (with Cloudflare proxy enabled)
  A("@", "203.0.113.10", CF_PROXY_ON),
  A("www", "203.0.113.10", CF_PROXY_ON),

  // API endpoints (load balanced)
  A("api", "203.0.113.20", CF_PROXY_ON),
  A("api", "203.0.113.21", CF_PROXY_ON),
  A("api", "203.0.113.22", CF_PROXY_ON),

  // Static assets CDN
  CNAME("cdn", "myapp.cloudfront.net."),
  CNAME("static", "myapp.cloudfront.net."),

  // Microservices
  A("auth", "203.0.113.30", CF_PROXY_ON),
  A("payments", "203.0.113.31", CF_PROXY_ON),
  A("notifications", "203.0.113.32", CF_PROXY_ON),

  // Websocket server (proxy OFF for websockets)
  A("ws", "203.0.113.40", CF_PROXY_OFF),

  // Status page (external service)
  CNAME("status", "myapp.statuspage.io."),

  // Documentation (hosted on GitHub Pages)
  CNAME("docs", "myapp.github.io."),

  // Email configuration (using Google Workspace)
  MX("@", 1, "aspmx.l.google.com."),
  MX("@", 5, "alt1.aspmx.l.google.com."),
  MX("@", 5, "alt2.aspmx.l.google.com."),
  MX("@", 10, "alt3.aspmx.l.google.com."),
  MX("@", 10, "alt4.aspmx.l.google.com."),

  // Email security
  TXT("@", "v=spf1 include:_spf.google.com ~all"),
  TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@myapp.com; pct=100"),
  TXT("google._domainkey", "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."),

  // Verification records
  TXT("@", "google-site-verification=abcdef123456"),
  TXT("@", "apple-domain-verification=xyz789"),

  // Environment-specific subdomains
  A("staging", "203.0.113.100", CF_PROXY_ON),
  A("dev", "203.0.113.101", CF_PROXY_OFF),
  A("preview", "203.0.113.102", CF_PROXY_ON),

  // Monitoring and observability
  A("grafana", "203.0.113.50", CF_PROXY_OFF),
  A("prometheus", "203.0.113.51", CF_PROXY_OFF),

  // Security headers and policies
  CAA("@", "issue", 0, "letsencrypt.org"),
  CAA("@", "issuewild", 0, ";"),  // Prevent wildcard certificates
  CAA("@", "iodef", 0, "mailto:security@myapp.com")
);
