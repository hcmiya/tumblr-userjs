﻿// ==UserScript==
// @name        トラッキングを消すやつ
// @namespace   http://js4.in/ns/
// @include     https://www.tumblr.com/dashboard*
// @include     https://www.tumblr.com/blog/*
// @include     https://www.tumblr.com/search/*
// @version     1.0.2
// @update      https://github.com/hcmiya/tumblr-userjs/raw/master/rmtrack.user.js
// @grant       none
// ==/UserScript==

// (c) 2015 MIYAGI Hikaru
// Licensed under MIT License
// see https://opensource.org/licenses/MIT

function rm(root){
	var elems = root.querySelectorAll("a")
	var match = /^https?:\/\/t\.umblr\.com\/redirect\?.*?\bz=([^&]*)/
	for (var i = 0; i < elems.length; i++) {
		var e = elems[i]
		var rr = match.exec(e.href)
		if (rr) {
			e.href = decodeURIComponent(rr[1])
		}
	}
}
function rm_mo(ml) {
	ml.forEach(function(m){
		for (var i = 0; i < m.addedNodes.length; i++) {
			var e = m.addedNodes[i]
			if (e.nodeType == e.ELEMENT_NODE) {
				rm(e)
			}
		}
	})
}

var tab = [
{
	uri: /^https:\/\/www\.tumblr\.com\/dashboard\b/,
	target: "left_column"
},
{
	uri: /^https:\/\/www\.tumblr\.com\/blog\//,
	target: "left_column"
},
{
	uri: /^https:\/\/www\.tumblr\.com\/search\//,
	target: "posts"
},
]

var ot_main = null
for (var i = 0; i < tab.length; i++) {
	if (tab[i].uri.test(location.href)) {
		ot_main = document.getElementById(tab[i].target)
		break
	}
}

if (ot_main) {
	rm(ot_main)
	var mo_main = new MutationObserver(rm_mo)
	mo_main.observe(ot_main, {childList: true, subtree: true})
}

var mo_drawer = new MutationObserver(function(ml){
	var drawer = document.querySelector("body > div.drawer")
	if (drawer && !drawer.dataset.rmTrack) {
		drawer.dataset.rmTrack = true
		var mo = new MutationObserver(rm_mo)
		mo.observe(drawer, {childList: true, subtree: true})
	}
})
mo_drawer.observe(document.body, {childList: true})
