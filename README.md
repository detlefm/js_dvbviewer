# js_dvbviewer
Javascript routines to deal with the dvbviewer REST api


## Why ?

I am learning javascript / html / vue. All in one step and to do it with a real life app which makes hopefully my live a little bit easier I had decided to start with a web app for starting "autotimers" on the dvbviewer recording service.

I have to deal with a lot of new themes (for me) and here is the starting point to convert the propritary xml format from dvbviewer into javacript objects.

## How to use

Copy the "extra" folder to your  DvbViewer path (default: C:\Program Files (x86)\DVBViewer\SVCweb ), afterwards you can call the
index.html from your browser with "http://[ipaddress]/extra/index.html" like "http://localhost/extra/index.html.
Or for using the static mock files for testing you can copy the extra folder where ever you want. Install the http-server (https://www.npmjs.com/package/http-server) or any other local http server and open the index file - don't forget to check the offline checkbox.

## Routines for sharing

The dvbviewer.js contains functions to deal with the xml output of the MediaServer API and the date format of the API ( Delphi date format)

## Status

In development

## Whats next

1. ~~Get the data from the DVBViewer service~~ - done
2. Filtering, Sorting based on time and user input
3. View templates depending on the data to provide pretty output beside the raw view.
4. ... 


4.7.2017