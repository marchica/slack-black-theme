# Slack Dark Theme

A dark [Slack](https://slack.com/) theme based on Visual Studio's dark theme that's an easy install for Windows users!

![image](https://user-images.githubusercontent.com/141490/57653431-c8c34100-759f-11e9-8e6a-aec8df7de6f3.png)

# Install

No need for downloading or editing files by hand! On Windows with Slack already installed, open a command prompt and run this command:

```batch
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression "$(Invoke-WebRequest https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/ps/scripts.ps1 -UseBasicParsing); Install-SlackPatch""
```
That's it! If Slack was open, then hit `ctrl-R` in Slack to refresh and check it out. :eyes:

**Note:** You'll need to run this command ***every*** time Slack updates. If the theme is gone, then it's time to run the command above again.

# Uninstall

Run the command below and `ctrl-R` in Slack. Or reinstall Slack.

```batch
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression "$(Invoke-WebRequest https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/ps/scripts.ps1 -UseBasicParsing); Uninstall-SlackPatch""
```

# Background

This project was forked from the work of many others. :pray:

### Goals
  * Create a theme to match Visual Studio's dark theme
  * Allow Windows users to easily install without having to find and edit files manually
  * Learn about SCSS, PowerShell, Gulp, Markdown, and Git

# Issues

Check out my [project board](https://github.com/marchica/slack-black-theme/projects/1) to see what's left. If it's not there, please submit issues, ideas, or suggestions [here](https://github.com/marchica/slack-black-theme/issues).

# Development

`git clone` the project and `cd` into it.

At a PowerShell prompt run `. .\src\ps\scripts.ps1; Install-SlackPatch -DevMode` to patch Slack for development.

Run `npm i` for the initial install and then run `gulp` which will start a dev server, launch Slack in dev mode, and watch the files to rebuild and run unit tests.

Write some code and then send me a pull request to the dev branch!
