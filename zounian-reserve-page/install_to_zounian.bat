@echo off
set TARGET=C:\academia\src\zounian\zounian-reserve
mkdir "%TARGET%"
xcopy /E /I /Y "%~dp0*" "%TARGET%\"
echo Created %TARGET%
pause
