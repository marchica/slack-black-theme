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