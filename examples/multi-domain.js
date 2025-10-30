// Multiple Domains Configuration
// Managing several domains in one configuration

var REG_NONE = NewRegistrar("none");
var DSP_CLOUDFLARE = NewDnsProvider("cloudflare");

// Main business domain
D("mybusiness.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  A("@", "203.0.113.10"),
  A("www", "203.0.113.10"),
  A("api", "203.0.113.20"),
  A("admin", "203.0.113.30"),
  MX("@", 10, "mail.mybusiness.com."),
  TXT("@", "v=spf1 mx include:_spf.google.com ~all")
);

// Blog on separate domain
D("myblog.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  A("@", "203.0.113.40"),
  A("www", "203.0.113.40"),
  // Use same mail server as main domain
  MX("@", 10, "mail.mybusiness.com."),
  TXT("@", "v=spf1 mx include:_spf.google.com ~all")
);

// Development domain
D("dev.mybusiness.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  A("@", "203.0.113.100"),
  A("staging", "203.0.113.101"),
  A("test", "203.0.113.102")
);

// Marketing landing page
D("promo.mybusiness.com", REG_NONE, DnsProvider(DSP_CLOUDFLARE),
  // Using a third-party landing page service
  CNAME("@", "custom-domain.landingpage-service.com.")
);
