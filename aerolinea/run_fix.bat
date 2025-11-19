@echo off
echo Aplicando fix para tabla Metodo_Pago...
echo.
echo INSTRUCCIONES:
echo 1. Abrir MySQL Workbench o cliente MySQL
echo 2. Ejecutar el contenido del archivo fix_metodo_pago.sql
echo 3. O ejecutar estos comandos:
echo.
echo USE aerolinea;
echo ALTER TABLE Metodo_Pago ADD COLUMN activo TINYINT(1) DEFAULT 1;
echo UPDATE Metodo_Pago SET activo = 1 WHERE activo IS NULL;
echo.
pause