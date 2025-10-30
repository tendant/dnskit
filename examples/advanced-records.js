// Advanced DNS Records Configuration
// Examples of various DNS record types and advanced configurations

var REG_NONE = NewRegistrar("none");
var DSP_CLOUDFLARE = NewDnsProvider("cloudflare");

D("example.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  // Basic records
  A("@", "203.0.113.10"),
  A("www", "203.0.113.10"),
  AAAA("@", "2001:db8::1"),  // IPv6 address
  AAAA("www", "2001:db8::1"),

  // CNAME records
  CNAME("blog", "example.com."),
  CNAME("shop", "shops.shopify.com."),
  CNAME("docs", "example-org.github.io."),

  // CAA records (Certificate Authority Authorization)
  CAA("@", "issue", 0, "letsencrypt.org"),
  CAA("@", "issuewild", 0, "letsencrypt.org"),
  CAA("@", "iodef", 0, "mailto:security@example.com"),

  // SRV records (for services like XMPP, SIP, etc.)
  SRV("_xmpp-client._tcp", 5, 10, 5222, "xmpp.example.com."),
  SRV("_xmpp-server._tcp", 5, 10, 5269, "xmpp.example.com."),

  // Multiple MX records with different priorities
  MX("@", 10, "mx1.example.com."),
  MX("@", 20, "mx2.example.com."),
  MX("@", 30, "mx3.example.com."),

  // Mail server addresses
  A("mx1", "203.0.113.20"),
  A("mx2", "203.0.113.21"),
  A("mx3", "203.0.113.22"),

  // TXT records for various purposes
  TXT("@", "v=spf1 mx include:_spf.google.com ~all"),
  TXT("_dmarc", "v=DMARC1; p=reject; rua=mailto:dmarc@example.com; ruf=mailto:forensics@example.com"),
  TXT("default._domainkey", "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ..."),

  // Service verification records
  TXT("@", "google-site-verification=1234567890abcdef"),
  TXT("@", "MS=ms12345678"),
  TXT("@", "facebook-domain-verification=abcdefghijklmnop"),

  // Subdomain delegation (if you want to delegate a subdomain to different nameservers)
  NS("subdomain", "ns1.other-provider.com."),
  NS("subdomain", "ns2.other-provider.com."),

  // PTR records are typically managed by your hosting provider
  // but can be defined if you have reverse DNS control

  // Wildcard records (use with caution)
  A("*", "203.0.113.10"),  // Catch-all subdomain

  // Geographic/load-balanced records (using Cloudflare's features)
  A("cdn", "203.0.113.50", CF_PROXY_ON),  // Enable Cloudflare proxy
  A("api", "203.0.113.60", CF_PROXY_OFF)  // Disable Cloudflare proxy
);
