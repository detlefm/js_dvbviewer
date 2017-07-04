
"use strict";

// Parses DVBViewer XML (2017) to Json
// Global functions for xml


// get the text of child elements, 
// if firstonly only the first child is taken

function el_gettext(doc, tagName, firstonly) {
  let tag = doc.getElementsByTagName(tagName);
  if (tag.length > 0) {
    if (firstonly === false) {
      let res = [];
      for (let i = 0; i < tag.length; i++) {
        res.push(tag[i].textContent);
      }
      return res;
    } else {
      return tag[0].textContent;
    }
  }
  return "";
}


// add attributes from an element to the given object 'dict'
// if prefix === true, the attribute name is prefixed with the
// elements nodeName

function el_getattributes(node, dict, prefix = false) {
  if (node.nodeType == 1) { // element
    // fetch attributes
    if (node.attributes.length > 0) {
      let tagname = node.nodeName + "_";
      for (let i = 0; i < node.attributes.length; i++) {
        let attribute = node.attributes.item(i);
        let nodename = attribute.nodeName;
        if (prefix)
          nodename = tagname + attribute.nodeName;
        dict[nodename.toLowerCase()] = attribute.nodeValue;
      }
    }
  }
}



// Timers
//<Timer Type="1" ID="{90577760-A685-42D6-99F6-5CC530623BAC}" Enabled="-1" Priority="50" Charset="255" Date="01.07.2017" Start="20:10:00" Dur="110" End="22:00:00" PreEPG="5" PostEPG="10" Action="0" EPGEventID="31415" PDC="48399"> 
//  <Descr>Sherlock - Das letzte Problem - (Sherlock - The Final Problem) - Spielfilm Großbri</Descr> 
//  <Options AdjustPAT="-1" AllAudio="-1"/> 
//  <Format>2</Format> 
//  <Folder>Auto</Folder> 
//  <NameScheme>%name_%year-%date_%time_%station</NameScheme> 
//  <Source>Search:test_1</Source> 
//  <Channel ID="2359890668641593480|ONE HD (deu)"/> 
//  <Executeable>-1</Executeable> 
//  <Recording>0</Recording> 
//  <ID>24</ID> 
//  <GUID>{90577760-A685-42D6-99F6-5CC530623BAC}</GUID>
// </Timer>


function ms_timer_entry(entry) {
  // attributes Type="1" ID="{90577760-A685-42D6-99F6-5CC530623BAC}" Enabled="-1" Priority="50" Charset="255" Date="01.07.2017" Start="20:10:00" Dur="110" End="22:00:00" PreEPG="5" PostEPG="10" Action="0" EPGEventID="31415" PDC="48399"
  let result = {}
  if (entry.nodeType == 1) { // element
    // fetch attributes
    el_getattributes(entry, result);
    // there are two entries "ID", we have to distinguish it
    if (result.id) {
      result['timer_id'] = result.id;
    }

    for (let i = 0; i < entry.childNodes.length; i++) {
      let child = entry.childNodes.item(i);
      let name = child.nodeName.toLowerCase();
      let content = child.textContent;
      if (content.trim().length > 0) {
        result[name] = content;
      }
    }

  } else {
    result['errorcode'] = 'wrong nodeType in ms_epg_entry - xmlparser.js';
  }
  return result;
}




// Status2
// <?xml version="1.0" encoding="utf-8" ?>
// <status>
//  <timercount>0</timercount>
//  <reccount>0</reccount>
//  <nexttimer>-1</nexttimer>
//  <nextrec>-1</nextrec>
//  <streamclientcount>0</streamclientcount>+
//  <rtspclientcount>0</rtspclientcount>
//  <unicastclientcount>0</unicastclientcount>
//  <lastuiaccess>12</lastuiaccess>
//  <standbyblock>0</standbyblock>
//  <tunercount>0</tunercount>
//  <streamtunercount>0</streamtunercount>
//  <rectunercount>0</rectunercount>
//  <epgudate>0</epgudate>
//  <rights>full</rights>
//  <recfiles>0</recfiles>
//  <recfolders>
//    <folder size="136912564224" free="108234047488">C:\Users\Public\Videos\</folder>
//  </recfolders>
//</status>


function ms_status_entry(element) {
  let result = {};
  for (let i = 0; i < element.childNodes.length; i++) {
    let child = element.childNodes.item(i);
    let name = child.nodeName.toLowerCase();
    let content = child.textContent;
    if (content.trim().length > 0) {
      result[name] = child.textContent;
    }
  }
  let felements = element.getElementsByTagName('folder');
  if (felements.length > 0) {
    el_getattributes(felements[0], result, true);
  }
  return result;
}



// EPG Area, Format DVBViewer 2017


// eventid might be suddenly changed  - I will ignore it
//<eventid>33248</eventid>
// charset is always the same - I will ignore it, the reqest is always utf-8
//<charset>255</charset>
// I will take only the first title from the list of titles
//<titles>
//  <title>kabel eins late news</title>
//</titles>
// I will take only the first event from the list of events
//<events>
//  <event>Kurznachrichten, D 2017</event>
//</events>
//<descriptions>
//  <description>[16:9]  |[stereo] [deu]</description>
//</descriptions>



function ms_epg_entry(prg) {
  // attributes start="20170623025000" stop="20170623025300" channel="562954320954462"
  let result = {}
  if (prg.nodeType == 1) { // element
    // fetch attributes
    el_getattributes(prg, result);
    result['title'] = el_gettext(prg, 'title', true);
    result['event'] = el_gettext(prg, 'event', true);
    result['description'] = el_gettext(prg, 'description');

  } else {
    result['errorcode'] = 'wrong nodeType in ms_epg_entry - xmlparser.js';
  }
  return result;
}


// channel area, Format DVBViewer

// <channel nr="-25" name="Das Erste HD (deu)" EPGID="562954315180093" flags="24" ID="2359890582721931325">
// <logo>Logos/das%20erste%20hd.png</logo>
// </channel>


function ms_channel_entry(ch) {
  // attributes nr="-25" name="Das Erste HD (deu)" EPGID="562954315180093" flags="24" ID="2359890582721931325"
  let result = {}
  if (ch.nodeType == 1) { // element
    // fetch attributes
    el_getattributes(ch, result);
    result['logo'] = el_gettext(ch, 'logo', true);
  } else {
    result['errorcode'] = 'wrong nodeType in ms_channel_entry - xmlparser.js'
  }
  return result;
}




function ms_xml_load(xmlString) {
  let knowndocs = [
    { 'tag': 'status', 'worker': ms_status_entry },
    { 'tag': 'channel', 'worker': ms_channel_entry },
    { 'tag': 'programme', 'worker': ms_epg_entry },
    { 'tag': 'Timer', 'worker': ms_timer_entry }
  ];

  let doc = new DOMParser().parseFromString(xmlString, "text/xml");
  let result = [];

  knowndocs.forEach(function (item) {
    // as long as we had found nothing
    if (result.length === 0) {
      let elements = doc.getElementsByTagName(item.tag);
      // if we found fitting tags, we can compute them
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          let entry = item.worker(elements[i]);
          result.push(entry);
        }
      }
    }
  });
  return result;
}


function ms_epgs_sort(lst) {
  lst.sort(function (a, b) { return a.start.localeCompare(b.start) });
}


function ms_channels_map(lst) {
  let map = new Map();
  lst.forEach(function (element) {
    map.set(element.epgid, element);
  });
  return map;
}



// mediaserver datetime routines

function JulianDay(year, month, day) {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  return jdn
}


// mediaserver - get days since start of delphi epoch

function ms_days(year, month, day) {
  return JulianDay(year, month, day) - JulianDay(1899, 12, 30);
}


// mediaserver - get time as percent of day

function ms_time(hour, minute, second) {
  const secperday = 86400;
  let sh = hour * 60 * 60;
  let sm = minute * 60;
  let secs = sh + sm + second;
  return (secs / secperday);
}

// mediaserver - get datetime used from epg routines

function ms_datetime(year, month, day, hour = 0, minute = 0, second = 0) {
  let days = ms_days(year, month, day);
  let time = ms_time(hour, minute, second);
  return {
    days: days,
    time: time,
    total: days + time
  }
}

function ms_now() {
  let dt = new Date();
  return ms_datetime(dt.getFullYear(),
    dt.getMonth() + 1,
    dt.getDate(),
    dt.getHours(),
    dt.getMinutes(),
    dt.getSeconds());
}

function addDays(date, days) {
    let result = new Date(date.getTime());
    result.setDate(result.getDate() + days);
    return result;
}




