function GetLatestSlackVersionFolder {
    $versions = 
        { [int]($_.Name -replace '.*?-(\d+)\.(\d+)\.(\d+)', '$1') }, 
        { [int]($_.Name -replace '.*?-(\d+)\.(\d+)\.(\d+)', '$2') }, 
        { [int]($_.Name -replace '.*?-(\d+)\.(\d+)\.(\d+)', '$3') }

    $latestVersionFolder = Get-ChildItem $env:LOCALAPPDATA\slack\app-* | Sort-Object $versions -Descending | Select-Object -First 1 -ExpandProperty Name
    return $latestVersionFolder
}

function StartSlack {
    [System.Environment]::SetEnvironmentVariable('SLACK_DEVELOPER_MENU', 'true', 'Process')

    $latestVersionFolder = GetLatestSlackVersionFolder

    & $env:LOCALAPPDATA\slack\$latestVersionFolder\slack.exe
}

function InstallSlackPatch([switch] $DevMode = $false) {
    # Find correct Slack folder
    $latestVersionFolder = GetLatestSlackVersionFolder
    $slackFolder = Join-Path $env:LOCALAPPDATA slack $latestVersionFolder resources\app.asar.unpacked\src\static

    # TODO - only patch one file?
    $slackFile = Join-Path $slackFolder ssb-interop.js

    # Backup original files
    #Copy-Item -Path $slackFolder\index.js -Destination $slackFolder\index.js.bak
    if ((Test-Path -Path "$slackFile.bak") -eq $False) {
        Copy-Item -Path $slackFile -Destination "$slackFile.bak"
    }

    # Read slack file into memory
    $fileContents = Get-Content $slackFile

    # Check if files have already been patched
    $patchIdentifier = "//Patch from https://github.com/marchica/slack-black-theme"

    if ($fileContents | Select-String -Pattern $patchIdentifier -SimpleMatch -Quiet) {
        Write-Host "Already patched!"
        exit
    }

    Write-Host "Patching $slackFile..."

    # Read patch into memory and replace URL
    $urlPlaceholder = "URL_TO_CSS"
    $url = "http://127.0.0.1:8080/custom.css"

    # TODO - need to get from URL!!

    $patchContents = (Get-Content "C:\Users\Marcy\Code\slack\slack-black-theme\SlackPatch.js").Replace($urlPlaceholder, $url)

    # Add patch to end of slack file
    Add-Content -Path $slackFile -Value $patchContents
}

function UninstallSlackPatch() {
    $latestVersionFolder = GetLatestSlackVersionFolder
    $slackFolder = "$env:LOCALAPPDATA\slack\$latestVersionFolder\resources\app.asar.unpacked\src\static"

    # if(Test-Path -Path $slackFolder\index.js.bak) {
    #     Move-Item -Path $slackFolder\index.js.bak -Destination $slackFolder\index.js -Force
    # }
    if(Test-Path -Path $slackFolder\ssb-interop.js.bak) {
        Move-Item -Path $slackFolder\ssb-interop.js.bak -Destination $slackFolder\ssb-interop.js -Force
    }
}