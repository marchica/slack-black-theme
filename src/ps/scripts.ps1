
    # TODO: Test Windows Chocolatey Slack install

    # TODO: Windows Store slack folder path



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
