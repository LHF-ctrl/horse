@echo off
echo ========================================
echo 马年新春贺词生成器启动脚本
echo ========================================
echo.

echo 正在启动CORS代理服务器...
start "CORS代理服务器" cmd /k "node proxy-server.js"

timeout /t 2 /nobreak >nul

echo 正在启动前端页面...
start "" "standalone.html"

echo.
echo ========================================
echo 启动完成！
echo.
echo CORS代理服务器运行在: http://localhost:3001
echo 前端页面已在新窗口中打开
echo.
echo 使用说明：
echo 1. 点击"生成贺词"按钮生成马年新春贺词
echo 2. 点击"生成图片"按钮生成贺卡图片
echo 3. 图片会直接显示在页面上
echo 4. 点击"下载图片"按钮保存生成的贺卡
echo.
echo 注意：请保持代理服务器窗口打开
echo ========================================
pause
