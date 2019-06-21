# If getting error about -Show parameter not being found, you need a newer version of Pester.
# At a PS admin prompt, run: Install-Module -Name Pester -Force -SkipPublisherCheck

Import-Module -Force $PSScriptRoot\scripts.ps1

Describe 'Slack Scripts' {
    
    Context 'Test' { 

        It 'Should return 3.4.3' {
            Get-LatestSlackVersionFolder | Should be 'app-3.4.3'
        }

    }
}
