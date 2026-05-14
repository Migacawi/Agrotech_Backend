param(
  [string]$ResourceGroup = "api",
  [string]$ContainerAppName = "api",
  [string]$AcrName = "agrotech",
  [string]$ImageName = "mi-api",
  [string]$ImageTag = "v2",
  [string]$EnvFile = ".env"
)

$ErrorActionPreference = "Stop"

function Read-DotEnv {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    throw "No se encontro el archivo $Path. Copia .env.example a .env y completa los valores."
  }

  $vars = @{}
  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) {
      return
    }

    $parts = $line -split "=", 2
    if ($parts.Count -lt 2) {
      return
    }

    $key = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"').Trim("'")
    $vars[$key] = $value
  }

  return $vars
}

$requiredKeys = @(
  "DATABASE_URL",
  "PORT",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GOOGLE_CLIENT_ID",
  "GMAIL_USER",
  "GMAIL_PASS"
)

$envVars = Read-DotEnv -Path $EnvFile
foreach ($key in $requiredKeys) {
  if (-not $envVars.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($envVars[$key])) {
    throw "Falta la variable $key en $EnvFile"
  }
}

$loginServer = az acr show --name $AcrName --query loginServer -o tsv
$imageRef = "$loginServer/${ImageName}:$ImageTag"

Write-Host "Iniciando sesion en Azure Container Registry..."
az acr login --name $AcrName | Out-Null

Write-Host "Construyendo imagen $imageRef..."
docker build -t $imageRef .

Write-Host "Publicando imagen en ACR..."
docker push $imageRef

$secretArgs = @(
  "database-url=$($envVars.DATABASE_URL)",
  "jwt-secret=$($envVars.JWT_SECRET)",
  "cloudinary-api-secret=$($envVars.CLOUDINARY_API_SECRET)",
  "gmail-pass=$($envVars.GMAIL_PASS)"
)

Write-Host "Actualizando secretos de Container Apps..."
az containerapp secret set `
  --resource-group $ResourceGroup `
  --name $ContainerAppName `
  --secrets $secretArgs | Out-Null

Write-Host "Actualizando revision de Container Apps..."
az containerapp update `
  --resource-group $ResourceGroup `
  --name $ContainerAppName `
  --image $imageRef `
  --set-env-vars `
    "PORT=$($envVars.PORT)" `
    "DATABASE_URL=secretref:database-url" `
    "JWT_SECRET=secretref:jwt-secret" `
    "CLOUDINARY_CLOUD_NAME=$($envVars.CLOUDINARY_CLOUD_NAME)" `
    "CLOUDINARY_API_KEY=$($envVars.CLOUDINARY_API_KEY)" `
    "CLOUDINARY_API_SECRET=secretref:cloudinary-api-secret" `
    "GOOGLE_CLIENT_ID=$($envVars.GOOGLE_CLIENT_ID)" `
    "GMAIL_USER=$($envVars.GMAIL_USER)" `
    "GMAIL_PASS=secretref:gmail-pass" | Out-Null

$fqdn = az containerapp show `
  --resource-group $ResourceGroup `
  --name $ContainerAppName `
  --query properties.configuration.ingress.fqdn `
  -o tsv

Write-Host ""
Write-Host "Despliegue completado."
Write-Host "URL publica: https://$fqdn"
