(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"5PZe":function(e,t,n){"use strict";n.d(t,"a",function(){return s});var i=n("fXoL"),a=n("tyNb");const o=function(){return["/landing"]};let s=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=i.yb({type:e,selectors:[["app-content-navbar"]],inputs:{title:"title"},decls:5,vars:3,consts:[[1,"nav-container"],[1,"return-button",3,"routerLink"],[1,"project-name"]],template:function(e,t){1&e&&(i.Kb(0,"nav",0),i.Kb(1,"a",1),i.fc(2," \u2190 return to main site "),i.Jb(),i.Kb(3,"h1",2),i.fc(4),i.Jb(),i.Jb()),2&e&&(i.vb(1),i.Ub("routerLink",i.Vb(2,o)),i.vb(3),i.gc(t.title))},directives:[a.b],styles:['.nav-container[_ngcontent-%COMP%]   .project-name[_ngcontent-%COMP%], .nav-container[_ngcontent-%COMP%]   .return-button[_ngcontent-%COMP%]{font-variant-ligatures:common-ligatures;font-feature-settings:"liga","clig";font-family:ff-nuvo-mono-web-pro,sans-serif;font-weight:400;font-style:normal;font-weight:700}[_nghost-%COMP%]{height:48px;background:hsla(0,0%,100%,.9);display:flex;justify-content:space-between;align-items:flex-end;padding:0 24px 8px}.nav-container[_ngcontent-%COMP%]{position:relative;text-align:center;width:100%}.nav-container[_ngcontent-%COMP%]   .return-button[_ngcontent-%COMP%]{font-size:1rem;line-height:2rem;cursor:pointer;position:absolute;left:0}.nav-container[_ngcontent-%COMP%]   .project-name[_ngcontent-%COMP%]{font-size:1.2rem;line-height:2rem}']}),e})()},Ankt:function(e,t,n){"use strict";n.d(t,"e",function(){return i}),n.d(t,"b",function(){return a}),n.d(t,"a",function(){return o}),n.d(t,"c",function(){return s}),n.d(t,"d",function(){return r});const i="/projects",a="/blog",o="beyondthecountyline",s="flipthedistrict",r="leavingacademia"},M3U8:function(e,t,n){"use strict";n.d(t,"a",function(){return a});var i=n("fXoL");let a=(()=>{class e{constructor(){}get absUrl(){return window.location.href}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=i.yb({type:e,selectors:[["app-svg-icon"]],inputs:{name:"name"},decls:2,vars:1,consts:[["version","1.1","xmlns","http://www.w3.org/2000/svg",0,"xmlns","xlink","http://www.w3.org/1999/xlink",1,"icon"]],template:function(e,t){1&e&&(i.Sb(),i.Kb(0,"svg",0),i.Fb(1,"use"),i.Jb()),2&e&&(i.vb(1),i.wb("href",t.absUrl+"#"+t.name,null,"xlink"))},encapsulation:2}),e})()},QpCj:function(e,t,n){"use strict";function i(e,t="smooth",n="start"){document.getElementById(e).scrollIntoView({block:n,behavior:t})}n.d(t,"a",function(){return i})},y5NY:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var i=function(e){return e.dataViz="Interactive data visualization",e.writing="Writing",e.list="Reference List",e.webApp="Web application",e.website="Website",e.prototype="Prototype",e.notebook="Notebook",e}({}),a=n("Ankt");const o=[{id:"leaving-academia-faq",title:"Leaving Academia FAQ",type:[i.writing],year:2021,show:!0,description:["Before I got into interactive data / design / coding, I did a Ph.D and a postdoc in architectural history. I learned a lot from that experience, and also from the process of moving on from it into a very different field. I've talked to a number of people about how I left academia and create a new, very satisfying-to-me career who all seemed to find it useful, and thought I'd write something up to further share my experiences / thoughts / opinions on this matter."],routerLink:`${a.b}/${a.d}`,linkName:"Post"},{id:"art-history-jobs",title:"Art History Jobs, 2011\u20142020",type:[i.dataViz],year:2020,description:["This is an exploratory set of interactive visualizations that helps people understand changes in the art history academic job market from 2012-2020, based on data I scraped from the Academic Jobs Wiki. Data scraping/cleaning were done with Python, visualizations were built in an Observable notebook."],show:!0,images:["assets/artHistoryJobsSelects.png","assets/artHistoryJobsMain.png"],url:"observablehq.com/@stephanietuerk/art-history-jobs-2011-2020",linkName:i.notebook},{id:"scsar",title:"Severn Community Standing Against Racism",type:[i.website],year:2020,description:["In June 2020, I started a campaign to encourage my high school to address issues of racism at the school and develop a strong anti-racism culture. The campaign took off but was dispersed across various media -- letters from the school sent to personal email addresses, Medium posts, articles in newspapers, PDF memos, and more. This made it difficult for the larger community to keep abreast of the campaign and understand what was being said by whom.","To catalog our efforts as an group and to centralize media relating to our work, I quickly created a website. All site functionality and styling was done over the course of a weekend using Angular and SCSS, no templates/component libraries. (Not necessarily the best choice but hey!) Additional content was added throughout the summer."],show:!0,images:["assets/severnAgainstRacism_embed2.png","assets/severnAgainstRacism_embed.png"],url:"www.severncommunityagainstracism.com",linkName:i.website},{id:"dq-atlas",title:"DQ Atlas",type:[i.webApp],year:"2019\u20142020",description:["DQ Atlas is a public-facing website hosted on Medicaid.gov that I designed/developed as part of my job at Mathematica. The site provides researchers and policy makers who use synthesized Medicaid use/claims data (TAF, or T-MSIS Analytic Files) with information about data quality for various topics.","I designed the website via interactive prototype and was the design lead for frontend development. However, the project at large, which included the creation of data quality measures, was executed by a wonderful team at Mathematica, which included health policy researchers who created measures for assessing data quality, statistical programmers, project managers, and full-stack developers.","This was the first public-facing true web application at Mathematica, and we all learned a ton in the process of making it. The content will seem extremely wonky to non-specialist users, but has been very well received by policy researchers. We are proud of the extent to which we were able to make a ton of information available in an organized and easily-navigable fashion.","The site is fully 508 compliant and supports IE11, in addition to modern browsers."],show:!0,images:["assets/atlasWelcome.png","assets/atlasTopics.png"],url:"www.medicaid.gov/dq-atlas/welcome",linkName:i.website},{id:"beyond-the-county-line",title:"Beyond the County Line",type:[i.dataViz],year:2017,technologies:["JavaScript","D3"],description:["This project came out of auditing MIT DUSP 11.S941 in spring 2017."],show:!0,routerLink:`${a.e}/${a.a}`,linkName:"visualization"},{id:"flip-the-district",title:"Flip the District",type:[i.dataViz],year:2017,technologies:["JavaScript","D3"],description:["This was my first data visualization project!","I did this when I audited MIT DUSP's 11.S947, Big Data, Visualization, and Society. Everything here is svg and made with D3 because...I learned D3 before learning almost anything about JavaScript, HTML, CSS, code splitting...the list goes on.","The original code was like 1500 lines inside a single d3.csv() call, haha, but I had such a blast figuring out how to do all of this and am still proud of having made it with zero background in D3 or JS. I think it's telling that what is most novel here is the interactivity, which is still one of my favorite things to design and build."],show:!0,routerLink:`${a.e}/${a.c}`,linkName:"visualization"}]}}]);