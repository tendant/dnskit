# Example Configurations

This directory contains example DNS configurations for common use cases.

## Examples

### 1. Basic Website (`basic-website.js`)
Simple configuration for a website with web and mail servers.

### 2. Multiple Domains (`multi-domain.js`)
Managing multiple domains in a single configuration file.

### 3. Advanced Records (`advanced-records.js`)
Examples of various DNS record types including CAA, SRV, and more.

## Usage

1. Copy an example file to `../config/dnsconfig.js`:
   ```bash
   cp examples/basic-website.js config/dnsconfig.js
   ```

2. Edit the configuration to match your needs:
   ```bash
   vim config/dnsconfig.js
   ```

3. Preview your changes:
   ```bash
   dnskit preview
   ```

4. Apply when ready:
   ```bash
   dnskit apply
   ```

## Learning Resources

- [dnscontrol Language Reference](https://docs.dnscontrol.org/language-reference/top-level-functions)
- [dnscontrol Record Types](https://docs.dnscontrol.org/language-reference/domain-modifiers)
