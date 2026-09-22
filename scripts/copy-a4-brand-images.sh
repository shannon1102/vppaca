#!/usr/bin/env bash
# Copy user-provided brand photos into public/products/brands/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="/home/ubuntu/.cursor/projects/workspace/assets"
DEST="$ROOT/public/products/brands"
mkdir -p "$DEST"

copy() {
  local src="$1" dest="$2"
  cp "$ASSETS/$src" "$DEST/$dest"
}

copy "01a0ca90-858d-7533-9b08-1a4627d5b0e6.jpg" "clever-up-a4-70gsm-ream-grey.jpg"
copy "01a0ca90-85d1-77c0-a807-60fb8220e836.jpg" "clever-up-a4-70gsm-ream-green.jpg"
copy "01a0ca90-8602-7e43-98dc-1c72f6645d13.jpg" "supreme-a4-70gsm-set.jpg"
copy "01a0ca90-864c-77bf-ad2e-f53cff620fde.jpg" "bai-bang-office-a4-70gsm-ream.jpg"
copy "01a0ca90-867e-74ae-8063-a10463e071db.jpg" "bai-bang-office-a4-70gsm-alt.jpg"
copy "01a0ca90-86b3-7c9e-8c2f-8f7f03032fa3.jpg" "idea-max-a4-70gsm-set.jpg"
copy "01a0ca90-86e4-7981-a6fd-45dca37baf92.jpg" "idea-max-a4-70gsm-ream.jpg"
copy "01a0ca90-874b-796a-8f7d-8994a1729ce9.jpg" "idea-max-a4-70gsm-set-scgp.jpg"
copy "01a0ca90-877c-72e7-8641-0281ec9cbf8a.jpg" "idea-max-a4-70gsm-carton.jpg"
copy "01a0ca90-8817-74fd-9432-f6627ee0a064.jpg" "paperone-a4-70gsm-premium-set.jpg"
copy "01a0ca90-884d-7a02-a99e-b52e72ef6c1c.jpg" "paperone-a4-70gsm-copier-ream.jpg"
copy "01a0ca90-887f-75bd-bd8b-a38c52622c2a.jpg" "paperone-a4-70gsm-carton.jpg"
copy "01a0ca90-890d-7f05-ab57-8e0b77a570f1.jpg" "ik-plus-a4-70gsm-set.jpg"
copy "01a0ca90-893f-7e1a-81ff-8419378d23ad.jpg" "ik-plus-a4-70gsm-ream.jpg"
copy "01a0ca90-8892-78fe-8f82-0f59d7cf3891.jpg" "ik-plus-a4-70gsm-stack.jpg"
copy "01a0ca90-8974-7032-9499-493428a5bc1d.jpg" "quality-a4-70gsm-set.jpg"
copy "01a0ca90-89aa-703f-b4fd-242e2830e25c.jpg" "quality-a4-70gsm-carton.jpg"
copy "01a0ca90-89f1-7633-b9ad-74ad3d43683b.jpg" "quality-a4-70gsm-ream.jpg"
copy "01a0ca90-8a22-7262-91bc-4bd2d4ff4ee0.jpg" "double-a-a4-70gsm-everyday-ream.jpg"
copy "01a0ca90-8a57-7cd3-bfd9-0797750af18f.jpg" "double-a-a4-premium-ream.jpg"
copy "01a0ca90-8aa2-7b46-b6bd-12fee3451a5c.jpg" "double-a-a4-70gsm-carton.jpg"
copy "01a0ca90-8a6b-7bf2-87e2-5a833516c3a4.jpg" "ik-copy-a4-70gsm-carton.jpg"

# Bổ sung từ shop (UUID assets)
if [[ -f "$ASSETS/E630C0AC-5D14-4243-89CB-8A98A4D681A0_L0_001.jpg" ]]; then
  copy "E630C0AC-5D14-4243-89CB-8A98A4D681A0_L0_001.jpg" "bai-bang-office-a4-70gsm-ream.jpg"
fi
if [[ -f "$ASSETS/03C88A06-FEF9-46E0-ACE8-B403BFF58AB4_L0_001.jpg" ]]; then
  copy "03C88A06-FEF9-46E0-ACE8-B403BFF58AB4_L0_001.jpg" "excel-a4-70gsm-stack.jpg"
fi

echo "Copied $(ls -1 "$DEST" | wc -l) brand images to public/products/brands/"
