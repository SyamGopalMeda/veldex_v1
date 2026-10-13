#!/usr/bin/env bash
# Pre-generate optimised hero images after a deploy so the first visitors never
# wait for a cold resize. Usage: bash scripts/warm-images.sh [baseUrl]
B="${1:-https://veldex-web--veldex-c8a64.asia-southeast1.hosted.app}"
for f in public/images/hero/desktop/*.jpg public/images/hero/mobile/*.jpg; do
  name=${f#public/images/hero/}; name=${name////%2F}
  for w in 640 750 828 1080 1200 1920 2048 2560 2880 3840; do
    curl -s -o /dev/null -H "Accept: image/webp" -w "%{http_code} %{time_total}s w=$w $name\n" \
      "$B/_next/image?url=%2Fimages%2Fhero%2F$name&w=$w&q=75" &
  done
  wait
done
