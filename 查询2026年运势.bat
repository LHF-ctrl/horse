@echo off
chcp 65001 >nul

set "API_URL=https://dashscope.aliyuncs.com/api/v1/apps/20f12f4e30f3495f8a69cbb00aafcfc5/completion"
set "API_KEY=sk-156a6786ce8545548561ac2b188cfc5c"

echo 正在查询2026年运势...

REM 直接在curl命令中嵌入JSON数据
curl -X POST "%API_URL%" ^
  --header "Authorization: Bearer %API_KEY%" ^
  --header "Content-Type: application/json" ^
  --data "{\"input\": {\"prompt\": \"我想算一下我在2026年的运势？\"}, \"parameters\": {}, \"debug\": {}}"

echo.
echo 查询完成！
pause
