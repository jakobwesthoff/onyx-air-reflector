# Onyx Air Reflector

![Onyx Air Reflector in Action](https://github.com/jakobwesthoff/onyx-air-reflector/blob/main/onyx-air-reflector.gif?raw=true)

## About

An application to pull live screen grabs of an **Onyx Boox Note Air** EInk Tablet to be shared within video conferences for example.

The software might be compatible with other ePaper Tablets from Onyx, but was only tested with the Boox Note Air. If you have tested it with another one, please reach out, so that I can update this information.

Currently I have only tested the application using macOS. However it should work with Linux out of the box. A windows version would need a minimal adaption, regarding the location routines for the `adb` tool. Feel free to submit a PR for this.

## Reasoning

I bought myself an Onyx Boox Note Air tablet, which I wanted to use as a *digital whiteboard* within a video call one day. Unfortunately the screen sharing of the tablet is somewhat buggy and does only seem to function with windows 10. As I am using macOS or Linux primarily I needed some other solution. After fruitless searches and different tests with other software like *scrcpy* I decided to hack together my own solution.

The software utilizes the Android debugging tool **adb**, in order to invoke the `screencap` utility on the device and pull a stream of screenshots from there. Once the screenshot has been retrieved it is displayed on the screen.

Due to the way the Tablet updates the EInk during note taking, strokes will only appear once they are complete.

## Requirements

The Android tool `adb` needs to be installed within your **PATH** for this application to work. Furthermore the tablet needs to be connected via a USB cable.

## Build / Install

In order to build the application the following prerequisites are needed:

* nvm
* nodejs
* npm

1. Use `nvm` to install/activate the proper nodejs version: `nvm use`
2. Install needed dependencies: `npm install`
3. Either run the app directly: `npm start`
4. **or** build an application package: `npm run make`

## Be aware

I created this piece of software in about an hour, because I had a specific problem I wanted to quickly solve. The software is neither extremely feature rich, nor unbelievably stable. I am publishing it, because I can imagine there are other people out there, which find this tool useful as well.
