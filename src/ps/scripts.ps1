function Get-ManuallyDownloadedSlackFolder {
    $latestVersionFolder = GetLatestSlackVersionFolder
    return "$env:LOCALAPPDATA\slack\$latestVersionFolder"
}

function Get-SlackFolder {
    if (Test-Path "$env:LOCALAPPDATA\slack\slack.exe") {
        return Get-ManuallyDownloadedSlackFolder
    }

    if (Test-Path "$env:ProgramFiles\slack\slack.exe") {
        return "$env:ProgramFiles\slack"
    }

    # TODO: Windows Store slack folder path
}

function GetLatestSlackVersionFolder {
    $latestVersionFolder = $filename = cmd /c "dir $env:LOCALAPPDATA\slack\app* /ad /on /b" | select -last 1
    return $latestVersionFolder
}
$global:latestVersionFolder = GetLatestSlackVersionFolder

function StartSlack {
    [System.Environment]::SetEnvironmentVariable('SLACK_DEVELOPER_MENU', 'true', 'Process')

    $slackFolder = Get-SlackFolder

    & $slackFolder\slack.exe
}

function InstallSlackPatch([switch] $DevMode = $false) {
    # Find correct Slack folder
    $slackFolder = Get-SlackFolder
    $slackFolder = "$slackFolder\resources\app.asar.unpacked\src\static"

    $slackFile = Join-Path $slackFolder ssb-interop.js

    # Backup original files
    if ((Test-Path -Path "$slackFile.bak") -eq $False) {
        Copy-Item -Path $slackFile -Destination "$slackFile.bak"	
    }

    # Read slack file into memory
    $fileContents = Get-Content $slackFile

    # Check if files have already been patched
    $patchIdentifier = '//Patch from https://github.com/marchica/slack-black-theme'

    if ($fileContents | Select-String -Pattern $patchIdentifier -SimpleMatch -Quiet) {
        Write-Host 'Already patched!'
        exit
    }

    Write-Host "Patching $slackFile..."

    # Read patch into memory and replace URL
    $urlPlaceholder = 'URL_TO_CSS'
    if ($DevMode) {
        $url = 'http://127.0.0.1:8080/custom.css'
    } else {
        $url = 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/dist/custom.css';
    }

    $patchContents = (Invoke-WebRequest 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/js/SlackPatch.js' -UseBasicParsing).Content.Replace($urlPlaceholder, $url)

    # Add patch to end of slack file
    Add-Content -Path $slackFile -Value $patchContents

    # If dev mode, add dev patch to auto-reload CSS
    if ($DevMode) {
        $pathPlaceholder = 'PATH_TO_LOCAL_CSS'
        $path = (Join-Path (Resolve-Path $PSScriptRoot\..\..) dist\custom.css).Replace('\', '\\')

        $devPatchContents = (Invoke-WebRequest 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/js/DevSlackPatch.js' -UseBasicParsing).Content.Replace($pathPlaceholder, $path)

        # Add patch to end of slack file
        Add-Content -Path $slackFile -Value $devPatchContents
    }
}

function UninstallSlackPatch() {
    $slackFolder = Get-SlackFolder
    $slackFolder = "$slackFolder\resources\app.asar.unpacked\src\static"

    if(Test-Path -Path $slackFolder\ssb-interop.js.bak) {
        Move-Item -Path $slackFolder\ssb-interop.js.bak -Destination $slackFolder\ssb-interop.js -Force
    }
}
