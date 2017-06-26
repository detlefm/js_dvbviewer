
"use strict";

// Parses DVBViewer XML (2017) to Json
// Global functions for xml


// returns a Parses for a xml string
function str2doc(xmlString) {
  let myParser = new DOMParser();
  return myParser.parseFromString(xmlString, "text/xml");
}


// get the text of child elements, 
// if firstonly only the first child is taken

function get_text(doc, tagstring, firstonly) {
  let tag = doc.getElementsByTagName(tagstring);
  if (tag.length > 0) {
    if (firstonly === false) {
      let res = []
      for (let i = 0; i < tag.length; i++) {
        res.push(tag[i].textContent)
      }
      return res;
    } else {
      return tag[0].textContent;
    }
  }
  return "";
}


// get attributes from an element

function get_attributes(node, dict) {
  if (node.nodeType == 1) { // element
    // fetch attributes
    if (node.attributes.length > 0) {
      for (var i = 0; i < node.attributes.length; i++) {
        var attribute = node.attributes.item(i);
        dict[attribute.nodeName.toLowerCase()] = attribute.nodeValue;
      }
    }
  }
}


// EPG Area, Format DVBViewer 2017

function epg_list(xmlString) {
  let doc = str2doc(xmlString);
  let prgs = doc.getElementsByTagName('programme');
  return prgs;
}


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



function epg_entry(prg) {
  // attributes start="20170623025000" stop="20170623025300" channel="562954320954462"
  let result = {}
  if (prg.nodeType == 1) { // element
    // fetch attributes
    get_attributes(prg, result);
    result['title'] = get_text(prg, 'title', true);
    result['event'] = get_text(prg, 'event', true);
    result['description'] = get_text(prg, 'description');

  } else {
    result['errorcode'] = 'wrong nodeType in epg_entry - xmlparser.js';
  }
  return result;
}



// channel area, Format DVBViewer

// <channel nr="-25" name="Das Erste HD (deu)" EPGID="562954315180093" flags="24" ID="2359890582721931325">
// <logo>Logos/das%20erste%20hd.png</logo>
// </channel>


function channel_list(xmlString) {
  let doc = str2doc(xmlString);
  let prgs = doc.getElementsByTagName('channel');
  return prgs;
}



function channel_entry(ch) {
  // attributes nr="-25" name="Das Erste HD (deu)" EPGID="562954315180093" flags="24" ID="2359890582721931325"
  let result = {}
  if (ch.nodeType == 1) { // element
    // fetch attributes
    get_attributes(ch, result);
    result['logo'] = get_text(ch, 'logo', true);
  } else {
    result['errorcode'] = 'wrong nodeType in channel_entry - xmlparser.js'
  }
  return result;
}



function channels_load(xmlString) {
  let channel_map = new Map();
  let doc = channel_list(xmlString);
  for (let i = 0; i < doc.length; i++) {
    let ch = channel_entry(doc[i]);
    channel_map.set(ch['epgid'], ch)
  }
  return channel_map;
}

function epgs_load(xmlString) {
  let epg_lst = [];
  let doc = epg_list(xmlString);
  for (let i = 0; i < doc.length; i++) {
    let epg = epg_entry(doc[i]);
    epg_lst.push(epg)
  }
  epg_lst.sort(function (a, b) { return a.start.localeCompare(b.start) });
  return epg_lst;
}


