@ECHO OFF
REM ----------------------------------------------------------------------------
REM Maven Wrapper (mvnw.cmd) — lightweight, self-contained launcher for Windows.
REM
REM On first run this downloads the exact Maven version pinned in
REM .mvn\wrapper\maven-wrapper.properties into %USERPROFILE%\.m2\wrapper\dists
REM and then delegates to it, so you don't need Maven installed globally.
REM ----------------------------------------------------------------------------

SETLOCAL ENABLEDELAYEDEXPANSION

SET WRAPPER_DIR=%~dp0
SET PROPS_FILE=%WRAPPER_DIR%.mvn\wrapper\maven-wrapper.properties

IF NOT EXIST "%PROPS_FILE%" (
  ECHO ERROR: Could not find %PROPS_FILE%
  EXIT /B 1
)

FOR /F "usebackq tokens=1,* delims==" %%A IN ("%PROPS_FILE%") DO (
  IF "%%A"=="distributionUrl" SET DISTRIBUTION_URL=%%B
)

IF "%DISTRIBUTION_URL%"=="" (
  ECHO ERROR: distributionUrl not set in %PROPS_FILE%
  EXIT /B 1
)

FOR %%F IN ("%DISTRIBUTION_URL%") DO SET DIST_FILE=%%~nxF
SET DIST_NAME=%DIST_FILE:-bin.zip=%

SET CACHE_DIR=%USERPROFILE%\.m2\wrapper\dists\%DIST_NAME%
SET MAVEN_HOME=%CACHE_DIR%\%DIST_NAME%
SET MVN_BIN=%MAVEN_HOME%\bin\mvn.cmd

IF NOT EXIST "%MVN_BIN%" (
  ECHO Maven ^(%DIST_NAME%^) not found locally — downloading ^(one-time setup^)...
  IF NOT EXIST "%CACHE_DIR%" MKDIR "%CACHE_DIR%"
  SET TMP_ZIP=%CACHE_DIR%\%DIST_FILE%

  powershell -Command "Invoke-WebRequest -Uri '%DISTRIBUTION_URL%' -OutFile '%TMP_ZIP%'"

  ECHO Extracting...
  powershell -Command "Expand-Archive -Path '%TMP_ZIP%' -DestinationPath '%CACHE_DIR%' -Force"
  DEL "%TMP_ZIP%"
  ECHO Maven %DIST_NAME% ready at %MAVEN_HOME%
)

CALL "%MVN_BIN%" %*
