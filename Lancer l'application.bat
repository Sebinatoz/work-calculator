@echo off
title Work Calculator
echo ====================================================
echo   Lancement de votre Calculateur d'Heures
echo   (Sauvegarde automatique & fonctionnement hors-ligne)
echo ====================================================

set "HTML_PATH=%~dp0index.html"

:: 1. Tente de lancer en mode application dediee (fenetre sans barre d'adresse) via Edge
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="file:///%HTML_PATH:\=/%"
    exit
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="file:///%HTML_PATH:\=/%"
    exit
)

:: 2. Sinon ouvre dans le navigateur par defaut
start "" "%HTML_PATH%"
exit
