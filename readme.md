# :warning: :construction: Work in Progress :construction: :warning:
# Slack Dark Theme

A dark [Slack](https://slack.com/) theme based on Visual Studio's dark theme that's an easy install for Windows users!

![image](https://user-images.githubusercontent.com/141490/57653431-c8c34100-759f-11e9-8e6a-aec8df7de6f3.png)

# Installing into Slack

On Windows, open a command prompt and run this command:

```batch
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression "$(Invoke-WebRequest https://raw.githubusercontent.com/marchica/slack-black-theme/master/scripts.ps1 -UseBasicParsing); InstallSlackPatch""
```
That's it! Restart Slack and check it out.

**Note:** You'll need to run this command *every* time Slack updates:exclamation:

# Background

This project was forked from the work of many others. :pray:

### Goals
  * Create a theme to match Visual Studio's dark theme
  * Allow Windows users to easily install without having to find and edit files manually
  * Learn about SCSS, PowerShell, Gulp, Markdown, and Git

Check out my [project board](https://github.com/marchica/slack-black-theme/projects/1) to see what's left.

# Development

`git clone` the project and `cd` into it.

Run `npm i` and then run `gulp` to start a dev server and launch Slack in dev mode!