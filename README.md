# STREAME ![Build Status](https://travis-ci.org/Judahh/streame.svg?branch=master)

## Development

![Image of Development](https://github.com/judahh/streame/blob/master/Server.png)

## Installation

### Software

#### Visual Studio Code

[https://code.visualstudio.com/]

#### Git

##### Windows
[http://git-scm.com/download/win]

##### Linux
Fedora:
```sh
$ sudo dnf install git git-all network-manager chromium-browser xinit mongodb ttf-mscorefonts-installer unclutter x11-xserver-utils mesa-vdpau-drivers
```
Debian/Ubuntu:
```sh
$ sudo apt-get install git git-all network-manager chromium-browser xinit mongodb ttf-mscorefonts-installer unclutter x11-xserver-utils  mesa-vdpau-drivers
```
If Raspberry Language Error:
```sh
$ export LC_ALL="en_GB.UTF-8"
$ export LANGUAGE="en_GB.UTF-8"
```
If Raspberry WIFI Error:
```sh
sudo systemctl disable dhcpcd
sudo systemctl stop dhcpcd
```

### Project
[https://github.com/creationix/nvm]
```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
nvm install node
npm install -g typescript concurrently
npm install
npm run tsc
npm run webpack
```

## App

It uses the framework backApp [https://github.com/Judahh/backApp]

### Code

### Frame

### Icon

In this folder is where icon are stored.

### Images

In this folder is where image are stored.

### Videos

## Api

It uses the framework backApp [https://github.com/Judahh/backApi]
