#!/bin/bash

source ./internal-scripts/common.sh

add_bridge() {
  title "Adding External Adapter #$1 to Chainlink node..."

  CL_URL="http://localhost:669$1"

  login_cl "$CL_URL"

  THIS_VM_IP=$(hostname -I | cut -d' ' -f1)
  payload=$(
    cat <<EOF
{
  "name": "agoric",
  "url": "http://$THIS_VM_IP:3000/adapter"
}
EOF
  )

  curl -s -b ./tmp/cookiefile -d "$payload" -X POST -H 'Content-Type: application/json' "$CL_URL/v2/bridge_types" &>/dev/null

  echo "EA has been added to Chainlink node"
  title "Done adding EA #$1"
}
