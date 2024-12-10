@echo off

:: Iniciar servidor de React
cd C:\sudcra-manager\site-sudcra
start npm start

:: Iniciar servidor de Express
cd C:\sudcra-manager\site-sudcra\backend
node index.js

