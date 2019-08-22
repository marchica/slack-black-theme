# Slack Dark Theme Installer

[![GitHub release](https://img.shields.io/github/v/release/marchica/slack-black-theme?color=%238b5eb3&include_prereleases&sort=semver)](https://github.com/marchica/slack-black-theme/releases/latest) [![Donate](https://img.shields.io/badge/donate-paypal-%2348a74b)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=WJU67EEEDWB42&currency_code=USD&source=url) [![Gitter](https://img.shields.io/gitter/room/marchica/slack-black-theme?color=blue)](https://gitter.im/marchica/slack-black-theme)

A dark theme for [Slack](https://slack.com/) **_4.0+_** with an easy installer for Windows users!

<p align="center"><a href="https://github.com/marchica/slack-black-theme/releases/latest"><img src="https://raw.githubusercontent.com/marchica/slack-black-theme/dev/resources/download-button.png" /></a></p>

![image](https://user-images.githubusercontent.com/141490/57653431-c8c34100-759f-11e9-8e6a-aec8df7de6f3.png)

# Install

On Windows with Slack 4.0+ already installed, [download the latest exe](https://github.com/marchica/slack-black-theme/releases/latest) and double click to run.

That's it! If Slack was open, then hit `ctrl-R` in Slack to refresh and check it out. :eyes:

**Note:** You'll need to run this exe ***every*** time Slack updates. If the theme is gone, then it's time to run the command above again.

# Commands

If you double click to launch the exe, it will automatically run the `install` command. Here's some other commands you can use at the command line.

  * `install` - Install the Slack patch
  * `uninstall` - Uninstall the Slack patch
  * `updatecss` - Update CSS with latest fixes
  * `update` - Update this exe to the latest version
  * `version` - Show version
  * `help [command]` - Show help menu for a command

# Background

This project was forked from the work of many others. :pray:

### Goals
  * Create a theme to match Visual Studio's dark theme
  * Allow Windows users to easily install without having to find and edit files manually
  * Learn about SCSS, PowerShell, Gulp, Markdown, Git, NodeJS, and ESLint

# Issues

Need help? Let's [chat](https://gitter.im/marchica/slack-black-theme)! :speech_balloon:

Check out my [project board](https://github.com/marchica/slack-black-theme/projects/1) to see what's left. If it's not there, please submit issues, ideas, or suggestions [here](https://github.com/marchica/slack-black-theme/issues).

# Development

## Theme CSS

After running the installer, it will print out the location of a CSS file that you can modify and Slack will automatically reload your changes.

Exit Slack then run `slack-patcher launchSlack` to open Slack in developer mode. Then press `ctrl-i` to open Dev Tools.

If you want to help test the latest fixes, run `slack-patcher install --devBranch` to use the CSS from the dev branch.

Pull requests for fixes or custom themes are welcome!

## Installer code
`git clone` the project and `cd` into it.

Run `npm i` for the initial install and then run `gulp` which will launch Slack in dev mode, and watch the files to rebuild and copy them to your Slack install.

Then run `slackpatcher install --devMode` to patch Slack for development.

Write some code and then send me a pull request to the dev branch!