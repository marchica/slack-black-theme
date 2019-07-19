function Get-SlackFolder {
    # Windows Slack install from Slack website
    if (Test-Path "$env:LOCALAPPDATA\slack\slack.exe") {
        return Get-ManuallyDownloadedSlackFolder
    }

    # Windows Chocolatey Slack install
    if (Test-Path "$env:PROGRAMFILES\slack\slack.exe") {
        return "$env:PROGRAMFILES\slack"
    }

    # TODO: Windows Store slack folder path

    [Console]::ForegroundColor = 'red'
    [Console]::Error.WriteLine('Unable to locate Slack install')
    [Console]::ResetColor()
}

function Get-ManuallyDownloadedSlackFolder {
    return "$env:LOCALAPPDATA\slack\$(Get-LatestSlackVersionFolder)"
}

function Get-LatestSlackVersionFolder {
    $versions =
        { [int]($_.Name -replace '.*?-(\d+)\.(\d+)\.(\d+)', '$1') },
        { [int]($_.Name -replace '.*?-(\d+)\.(\d+)\.(\d+)', '$2') },
        { [int]($_.Name -replace '.*?-(\d+)\.(\d+)\.(\d+)', '$3') }

    $latestVersionFolder = Get-ChildItem -Directory $env:LOCALAPPDATA\slack\app-* | Sort-Object $versions -Descending | Select-Object -First 1 -ExpandProperty Name

    return $latestVersionFolder
}

function Invoke-SlackDevMode {
    [System.Environment]::SetEnvironmentVariable('SLACK_DEVELOPER_MENU', 'true', 'Process')

    $slackBasePath = Get-SlackFolder

    if (!$slackBasePath) {
        return
    }

    & "$slackBasePath\slack.exe"
}

function Install-SlackPatch([switch] $DevMode = $false) {
    # Find correct Slack folder
    $slackBasePath = Get-SlackFolder

    if (!$slackBasePath) {
        return
    }

    $slackFolder = "$slackBasePath\resources\app.asar.unpacked\src\static"

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
        Write-Output 'Already patched! Will re-apply...'
        Copy-Item -Path "$slackFile.bak" -Destination $slackFile
    }

    Write-Output "Patching file: $slackFile"

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

    Write-Output 'Successfully patched!'
    Write-Output '** Ctrl-R in Slack to refresh **'
}

function Uninstall-SlackPatch() {
    $slackBasePath = Get-SlackFolder

    if (!$slackBasePath) {
        return
    }

    $slackFolder = "$slackBasePath\resources\app.asar.unpacked\src\static"

    if(Test-Path -Path $slackFolder\ssb-interop.js.bak) {
        Move-Item -Path $slackFolder\ssb-interop.js.bak -Destination $slackFolder\ssb-interop.js -Force
    }
}

function Install-SlackIconPatch() {
    $slackBasePath = Get-SlackFolder

    if (!$slackBasePath) {
        return
    }

    # TODO - download
    if ((Test-Path -Path $slackBasePath\slack-logo-transparent.ico) -eq $False) {
        Copy-Item -Path $PSScriptRoot\..\..\resources\slack-logo-transparent.ico -Destination $slackBasePath
    }

    $startMenuPath = [Environment]::GetFolderPath('StartMenu')
    $slackShortcut = Join-Path $startMenuPath 'Programs\Slack Technologies\Slack.lnk'

    if ((Test-Path -Path $slackShortcut) -eq $False) {
        [Console]::ForegroundColor = 'red'
        [Console]::Error.WriteLine('Unable to locate Slack''s Start Menu shortcut')
        [Console]::ResetColor()
        return
    }

    $shell = New-Object -COM WScript.Shell
    $shortcut = $shell.CreateShortcut($slackShortcut)
    $shortcut.IconLocation = "$slackBasePath\slack-logo-transparent.ico"
    $shortcut.Save()

    Write-Output 'Successfully patched Slack''s icon!'
}
