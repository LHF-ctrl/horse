@echo off
chcp 65001 >nul

set "API_URL=https://dashscope.aliyuncs.com/api/v1/tasks/2ae1e10d-3c5a-444f-a298-7d96f72d4888"
set "API_KEY=sk-156a6786ce8545548561ac2b188cfc5c"

echo 正在查询任务状态...
curl --location --request GET "%API_URL%" --header "Authorization: Bearer %API_KEY%"

echo.
echo 查询完成！
pause
