let cfg = {
  files: [
    { url: './epgs.xml', title: 'EPG' , method: 'app.fetchurl' },
    { url: './timers.xml', title: 'Timers' , method: 'app.fetchurl' },
    { url: './channels.xml', title: 'Channels' , method: 'app.fetchurl' },
    { url: './status.xml', title: 'Status' , method: 'app.fetchurl' }
  ],
  urls: [
    { url: 'api/epg.html?lvl=2', title: 'EPG' , method: 'app.fetch_epg' },
    { url: 'api/timerlist.html?utf8=2', title: 'Timers' , method: 'app.fetchurl' },
    { url: 'api/getchannelsxml.html?logo=1&fav=1', title: 'Channels' , method: 'app.fetchurl' },
    { url: 'api/getchannelsxml.html?logo=1&favonly=1', title: 'Favorites' , method: 'app.fetchurl' },
    { url: 'api/status2.html', title: 'Status' , method: 'app.fetchurl' }
  ]
};


