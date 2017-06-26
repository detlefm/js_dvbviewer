# js_dvbviewer
Javascript routines to deal with the dvbviewer REST api


## Why ?

I am learning javascript / html / vue. All in one step and to do it with a real life app which makes hopefully my live a little bit easier I had decided to start with a web app for starting "autotimers" on the dvbviewer recording service.

I have to deal with a lot of new themes (for me) and here is the starting point to convert the propritary xml format from dvbviewer into javacript objects.

## Status

The dvbviewer_xlm.js works fine with my test program and the test data - but I have only test data from Astra 19.2 and there might be a lot of others EPG data outside of the one satellite.

To make it easy I decided to import the data as js string - so it is not necessary to start up a server. DVBViewer didn't provide CORS access as of now.

## Whats next

1. Get the data from the DVBViewer service
2. Filtering, Sorting based on time and user input
3. and so on.
