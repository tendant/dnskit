#!/bin/bash
# Cloudflare-specific functions for dnskit

# Source common functions
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

# Get Cloudflare API token from creds.json
get_cf_token() {
  if ! command -v jq &> /dev/null; then
    log_error "jq is required for this operation. Please install jq."
    exit 1
  fi

  local token=$(jq -r '.cloudflare.apitoken' "$CREDS_FILE" 2>/dev/null | tr -d '[:space:]')
  if [ -z "$token" ] || [ "$token" == "null" ]; then
    log_error "Cloudflare API token not found in $CREDS_FILE"
    exit 1
  fi
  echo "$token"
}

# Get Cloudflare account ID from creds.json
get_cf_account_id() {
  if ! command -v jq &> /dev/null; then
    log_error "jq is required for this operation. Please install jq."
    exit 1
  fi

  local account_id=$(jq -r '.cloudflare.accountid' "$CREDS_FILE" 2>/dev/null)
  if [ -z "$account_id" ] || [ "$account_id" == "null" ]; then
    log_warn "Cloudflare account ID not found in $CREDS_FILE"
    echo ""
  else
    echo "$account_id"
  fi
}

# List all zones in Cloudflare account
list_cf_zones() {
  local token=$(get_cf_token)

  log_info "Fetching zones from Cloudflare..."

  # Debug: show token length and first/last chars
  if [ "${DEBUG:-0}" == "1" ]; then
    log_info "Token length: ${#token}"
    log_info "Token first 10 chars: ${token:0:10}"
    log_info "Token last 10 chars: ${token: -10}"
  fi

  local response=$(curl -s -w "\n%{http_code}" -X GET "https://api.cloudflare.com/client/v4/zones" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json")

  local http_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')

  if [ "${DEBUG:-0}" == "1" ]; then
    log_info "HTTP Status Code: $http_code"
  fi

  echo "$body" | jq '.'
}

# Get zone ID by domain name
get_zone_id() {
  local domain=$1
  local token=$(get_cf_token)

  curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" | jq -r '.result[0].id'
}

# Fetch all DNS records for a zone
fetch_dns_records() {
  local zone_id=$1
  local token=$(get_cf_token)

  curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json"
}

# Export all DNS records for a domain
export_domain_records() {
  local domain=$1
  local format=${2:-json}

  log_info "Fetching DNS records for $domain..."

  local zone_id=$(get_zone_id "$domain")
  if [ -z "$zone_id" ] || [ "$zone_id" == "null" ]; then
    log_error "Zone not found for domain: $domain"
    log_info "Make sure the domain is added to your Cloudflare account"
    log_info "Run 'dnskit list' to see all available zones"
    return 1
  fi

  local records=$(fetch_dns_records "$zone_id")

  case $format in
    json)
      echo "$records" | format_json
      ;;
    yaml)
      echo "$records" | format_yaml
      ;;
    *)
      log_error "Unsupported format: $format (use json or yaml)"
      return 1
      ;;
  esac
}
