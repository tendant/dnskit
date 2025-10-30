#!/bin/bash
# Common functions and utilities for dnskit

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
DNSKIT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_DIR="${DNSKIT_ROOT}/config"
CREDS_FILE="${CONFIG_DIR}/creds.json"
DNSCONFIG_FILE="${CONFIG_DIR}/dnsconfig.js"

# Logging functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check if dnscontrol is installed
check_dnscontrol() {
  if ! command -v dnscontrol &> /dev/null; then
    log_error "dnscontrol is not installed"
    log_info "Please install dnscontrol first. See INSTALL.md for instructions."
    exit 1
  fi
}

# Check if credentials file exists
check_credentials() {
  if [ ! -f "$CREDS_FILE" ]; then
    log_error "Credentials file not found: $CREDS_FILE"
    log_info "Please copy config/creds.json.template to config/creds.json and fill in your credentials"
    exit 1
  fi
}

# Check if dnsconfig file exists
check_dnsconfig() {
  if [ ! -f "$DNSCONFIG_FILE" ]; then
    log_error "DNS configuration file not found: $DNSCONFIG_FILE"
    log_info "Please create config/dnsconfig.js. See config/dnsconfig.js.sample for an example"
    exit 1
  fi
}

# Validate JSON file
validate_json() {
  local file=$1
  if ! command -v jq &> /dev/null; then
    log_warn "jq is not installed, skipping JSON validation"
    return 0
  fi

  if ! jq empty "$file" 2>/dev/null; then
    log_error "Invalid JSON in file: $file"
    return 1
  fi
  return 0
}

# Run dnscontrol command with common options
run_dnscontrol() {
  local cmd=$1
  shift

  check_dnscontrol
  check_credentials
  check_dnsconfig

  cd "$CONFIG_DIR" || exit 1
  dnscontrol "$cmd" --creds creds.json "$@"
}

# Format output as JSON
format_json() {
  if command -v jq &> /dev/null; then
    jq '.'
  else
    cat
  fi
}

# Format output as YAML
format_yaml() {
  if command -v yq &> /dev/null; then
    yq eval -P '.'
  elif command -v python3 &> /dev/null; then
    python3 -c 'import sys, yaml, json; yaml.safe_dump(json.load(sys.stdin), sys.stdout, default_flow_style=False)'
  else
    log_warn "Neither yq nor python3 found, outputting as JSON"
    format_json
  fi
}
