#!/bin/bash

# Script seed 100 bệnh
# Sử dụng: chmod +x seed-benh.sh && ./seed-benh.sh

echo "🌿 Bắt đầu seed dữ liệu bệnh y học cổ truyền..."
echo ""

# Kiểm tra xem có secret không
SECRET=${ADMIN_SECRET:-""}
URL_BASE="http://localhost:3000/api/admin/seed"

# Seed 50 bệnh đầu tiên
echo "📝 1/2: Seeding 50 bệnh đầu tiên..."
if [ -n "$SECRET" ]; then
  curl -X POST "$URL_BASE/benh-50?secret=$SECRET&reset=true" -s | jq .
else
  curl -X POST "$URL_BASE/benh-50?reset=true" -s | jq .
fi

sleep 2

# Seed 50 bệnh bổ sung
echo ""
echo "📝 2/2: Seeding 50 bệnh bổ sung..."
if [ -n "$SECRET" ]; then
  curl -X POST "$URL_BASE/benh-50-extra?secret=$SECRET" -s | jq .
else
  curl -X POST "$URL_BASE/benh-50-extra" -s | jq .
fi

echo ""
echo "✅ Hoàn thành! Kiểm tra tại http://localhost:3000/benh"
echo "📊 Hoặc kiểm tra: http://localhost:3000/api/admin/seed/benh-check"
