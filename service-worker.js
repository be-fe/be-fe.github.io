/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/1b6ef096eaedfa0c34ec2078bfff4293.svg","1b6ef096eaedfa0c34ec2078bfff4293"],["/404.html","f92ceebfdfee1e6ce20cef8310aed069"],["/PICIDAE_COMMON.js","430be2873ed967224be7ff059e4a8db0"],["/PICIDAE_ENTRY.js","735393837a9909bbc458cd62e126b415"],["/about-us.html","d8f525f9b42b39d31552b552c1997f8f"],["/ant.design.html","f92ceebfdfee1e6ce20cef8310aed069"],["/blog/fe/832.html","7cb332668533c3f03be11edbb6bd90d4"],["/blog/fe/832.js","220587518de43abde4d04c19ea141b44"],["/blog/fe/Chrome的First Paint.html","2b73ca12643e6afaef873e7c196460d3"],["/blog/fe/Chrome的First Paint.js","4fba3d633457e17dda199e844011ffbe"],["/blog/fe/Chrome调试工具的一些高阶功能.html","718c9d3da1e35b7a1c3ab533232875bf"],["/blog/fe/Chrome调试工具的一些高阶功能.js","9711f1e16268680e3cdba9b1ab52f519"],["/blog/fe/ES6+环境搭建要点.html","5d5e6f65f748359fb553b8ebdef3dd9b"],["/blog/fe/ES6+环境搭建要点.js","ec3a9eed7da6a9eff306572f77bcaf4d"],["/blog/fe/customize-your-chrome-plug-in.html","3e7d5eaf1f901cd64cbcb3b01afeec7e"],["/blog/fe/customize-your-chrome-plug-in.js","39868b33078d42b1ff9db600d3316486"],["/blog/fe/data-visulization-with-javascript-translation.html","65f392558f095e14ea150b98859d6cd3"],["/blog/fe/data-visulization-with-javascript-translation.js","65846ab6fc453df13eb2fca54ec0a71e"],["/blog/fe/electron在企业云盘中的应用.html","252eb32a450308a0309d396eebe52a2a"],["/blog/fe/electron在企业云盘中的应用.js","ac6da4a7d984d10bb796780f4c48ed19"],["/blog/fe/es6-对unicode的支持小结.html","a635572a9533fbe4ca5833288e736bc6"],["/blog/fe/es6-对unicode的支持小结.js","e06bb77dcd7b432d5792570177664561"],["/blog/fe/fractal-vs-web.html","85c10e7f1382d668b9960af3499ed739"],["/blog/fe/fractal-vs-web.js","da7c67989132fc9a88581c8145882163"],["/blog/fe/how-to-write-babel-plugin.html","3252c5a5e5e0fe0944fc7efa2ceffcb0"],["/blog/fe/how-to-write-babel-plugin.js","b903599d611639e5aaf6f41fe2e10331"],["/blog/fe/how-to-write-component-demo.html","b5dd6c02e52efeaf7d87fd8ec8938f4d"],["/blog/fe/how-to-write-component-demo.js","b990fb4ddee954802417b40364febc45"],["/blog/fe/javascript-loop.html","9551c31ac78fdb9563528a6dd90b3b00"],["/blog/fe/javascript-loop.js","832903a240bdbd3b537bbfeb2cbf8c49"],["/blog/fe/javascript-settimeout.html","318ac19b90c0e4538a5e08cf3618bcbf"],["/blog/fe/javascript-settimeout.js","fafeeec5158403084ffc645176e6b866"],["/blog/fe/js-loader.html","11075ae7a305ddd5253b661f1fa92ccf"],["/blog/fe/js-loader.js","28fe185697a789e4d95d154dd20fce2c"],["/blog/fe/link-preload-标签.html","36ab7b45b2cb1b9006cdfe6ddda109d4"],["/blog/fe/link-preload-标签.js","ad0ec6040fcc5a208aa68e1a95fed513"],["/blog/fe/npm aduit二三事.html","eae7229ce25e7774e42d0113313bdab2"],["/blog/fe/npm aduit二三事.js","93aa990695563f6204beedfb0bb140d6"],["/blog/fe/riot-js-框架深入解析.html","de91c3ffff2bd174c9a0970ba4884a21"],["/blog/fe/riot-js-框架深入解析.js","3d0d567e3c51951afde493140504f44b"],["/blog/fe/the-realization-of-svg-smil-animation.html","cec976190e06a1975e4fe31c55cf8497"],["/blog/fe/the-realization-of-svg-smil-animation.js","e1a9e3e2c1d2b47fce5157582d9b21f3"],["/blog/fe/timing-api.html","7b66caa37f35f3342579a58694df03d5"],["/blog/fe/timing-api.js","87d190d8e9b037e6c384661955d6fc97"],["/blog/fe/use-jquery-to-achieve-a-simple-data-binding.html","6a5d6647f0c130761fd343ee7618b6ad"],["/blog/fe/use-jquery-to-achieve-a-simple-data-binding.js","5148dcaa2d140d0a268cae73ff26188e"],["/blog/fe/web开发中常见的乱码.html","73bb03a915ae83436f6f0e99257784ac"],["/blog/fe/web开发中常见的乱码.js","50d0b6c5a4b7fa2984ce8c2d91cdcce4"],["/blog/fe/xss攻击执行原理小结.html","8372d0c6de812b52d9d5c2c6e4f15aef"],["/blog/fe/xss攻击执行原理小结.js","8706c78d7dff730cf4c8fc6004a5bb93"],["/blog/fe/为原生api添加功能.html","5d1fb9489b6682f967fe9db774cb7fe4"],["/blog/fe/为原生api添加功能.js","def10fd5d006c290cd38a7d42e9358d0"],["/blog/fe/你可能不知道的cookie.html","c76c863fa8b6df2699981cef73c66799"],["/blog/fe/你可能不知道的cookie.js","ea70758c2d0bce4d41242a9a2ccb79b2"],["/blog/fe/关于js中的浮点运算.html","fd2cdc0eab5ab07590b1ee09ad5c65db"],["/blog/fe/关于js中的浮点运算.js","13007d47e8676e1f49151cb284415da9"],["/blog/fe/利用-javascript-实现富文本编辑器.html","1921f88f77fbbab9d2a65165218a404f"],["/blog/fe/利用-javascript-实现富文本编辑器.js","e2c1bae7b0bc2d17c4a3262eee5ae542"],["/blog/fe/前后端数据传输不得不面对的转码问题.html","fc9a8d60847b8f8034631234b8d314ff"],["/blog/fe/前后端数据传输不得不面对的转码问题.js","2049aca531d7dda76a4a9eb67251c731"],["/blog/fe/前端之切切切切切图.html","ded98af472dbc8350c1f62fba39b2530"],["/blog/fe/前端之切切切切切图.js","dc64061fdb63f1a180404044bccdd669"],["/blog/fe/如何绕过面试题中的小坑.html","e2c5933b7bb8dc5f86eeaa52e8fbf452"],["/blog/fe/如何绕过面试题中的小坑.js","6d440a9343f648cfce46b13a4004b8a3"],["/blog/fe/如何进行edm邮件制作.html","7d6c320aa4c5cba687e476b9d8d074df"],["/blog/fe/如何进行edm邮件制作.js","81ab5081e3a486cb41a04eb6c4b39b16"],["/blog/fe/实现一个高度自适应的输入框.html","fe9df91c6487b2a3997f3e1523ffd944"],["/blog/fe/实现一个高度自适应的输入框.js","5ce1481f404d840bdb946fe5c01fa56e"],["/blog/fe/常用的静态服务器.html","5204a4169189d4d07474c7a5352e7f31"],["/blog/fe/常用的静态服务器.js","c8ebea37331fde7b028626ccc79054d6"],["/blog/fe/微信小程序架构原理.html","2e35a26e2ba3ef6b11a956f14621f98c"],["/blog/fe/微信小程序架构原理.js","6bee599fb7bf81196df307ff3594eef0"],["/blog/fe/控制图标颜色.html","6aff2e970602955602a0766ef342999b"],["/blog/fe/控制图标颜色.js","1c4d52d34570b2c2937e6bb5bca6b21c"],["/blog/fe/浏览器环境下使用Protocol Buffers.html","676e6d6f13330f31af1ad419828fcd5e"],["/blog/fe/浏览器环境下使用Protocol Buffers.js","7ec44b850aa9f5f7c60022e5288a4f86"],["/blog/fe/浏览器返回的缓存问题.html","5802a406141d23598fa73769a1567736"],["/blog/fe/浏览器返回的缓存问题.js","785c02bb15fc67dd2ab94df4d80ce193"],["/blog/fe/深入理解window.onload.html","07b60e6a22379b917e0023f11038fe53"],["/blog/fe/深入理解window.onload.js","5d1ae7cd412644b1070d40e1eb5d4077"],["/blog/fe/高度自适应的 Textarea.html","aa556d5a614f802949f21fb1f68b5209"],["/blog/fe/高度自适应的 Textarea.js","5e7b4292b7e97906bca17f525b6f89e6"],["/blog/team/eux-tea-chat-party-2015.html","260ad126273da1196d54d3dc035f203a"],["/blog/team/eux-tea-chat-party-2015.js","8d9af3c5f74faa0be744c99a04af6c00"],["/blog/team/tg-ue-salon-driving-force-of-design.html","cd9d911fa2625991eb87e7fed3f6efe5"],["/blog/team/tg-ue-salon-driving-force-of-design.js","8090b6ba4e71a9ab585e15926f2eae6d"],["/blog/ue/data-applications-design.html","01d2551af8ae947db4a0a21cb31f8980"],["/blog/ue/data-applications-design.js","18b0388b6a14d9ab196faeb529d09227"],["/blog/ue/micro-interaction.html","f98b4e11b066db964eafd0d9aa794256"],["/blog/ue/micro-interaction.js","af835520730c0f96f9b49ab43a65937a"],["/blog/ue/newest-baidu-school-interaction-design-project-background.html","1ad338884229a5fed30b3439706791ec"],["/blog/ue/newest-baidu-school-interaction-design-project-background.js","18a537082cca009e1c779a81fc794bdb"],["/blog/ue/一种提升效率和体验的审批流程可视化交互设计.html","c715accac6d24c412b43f2a27644b93a"],["/blog/ue/一种提升效率和体验的审批流程可视化交互设计.js","af349799e0b274dcf22aaf79cebba743"],["/blog/ue/不同产品阶段下交互设计师如何调整设计重心.html","6e908a141d86e25c6041ba35d8ba0bd0"],["/blog/ue/不同产品阶段下交互设计师如何调整设计重心.js","acb64bf8fbcfc9b38d532d213c26aad1"],["/blog/ue/为爱发声百度公益1小时.html","33b1a11d2b48e5cb3fce9f59f9b29dc0"],["/blog/ue/为爱发声百度公益1小时.js","ed4989648755d6e82ca9751186e1fdb7"],["/blog/ue/互联网公益-互联网带来的人人公益时代，连接.html","a89c8b0c4fc472ea6203c6db51172c5f"],["/blog/ue/互联网公益-互联网带来的人人公益时代，连接.js","dc56a5c67fa39cf645607f60a9ce743a"],["/blog/ue/数据可视化的交互设计思考－柱状图的应用.html","61e767bca2e3230c3506ef0f29e5d472"],["/blog/ue/数据可视化的交互设计思考－柱状图的应用.js","8258b6541684864cf75e5ae756f414f3"],["/blog/ue/译文：企业级产品设计的未来－用户设计.html","b22a2d57d7e6b6590012f1230a5a598e"],["/blog/ue/译文：企业级产品设计的未来－用户设计.js","d391cb4e0396c942de7a69f34e8c6fd2"],["/blog/ui/be-able-to-stay-three-seconds-of-intro.html","33da8486bf26a08217ec95aed135e7c4"],["/blog/ui/be-able-to-stay-three-seconds-of-intro.js","88122ec7612f3dea1ebe806668adc6e7"],["/blog/ui/competitor-analysis-from-ui-designer.html","0d0c485f03d90e53d591ed45997472bf"],["/blog/ui/competitor-analysis-from-ui-designer.js","56762b677e37537609a764f8cffe09aa"],["/blog/ui/data-vision-visualization-seminar.html","2a31694fc951e4ec076f13ed0cbb7736"],["/blog/ui/data-vision-visualization-seminar.js","091c1e87a9c8edf248c5f106cbba1d86"],["/blog/ui/how-to-enhance-the-quality-of-the-mobile-terminal-design.html","6fb208fb8d6ec725a73e24dce4a6295b"],["/blog/ui/how-to-enhance-the-quality-of-the-mobile-terminal-design.js","18d4004c656138ace578ec2b74536ca3"],["/blog/ui/left-hand-d3-right-hand-designer.html","391b167ec429160078ae6012212e09ba"],["/blog/ui/left-hand-d3-right-hand-designer.js","bbb6bfad5794656d3711e0a2baa004b7"],["/blog/ui/origami-learning-1.html","4fd0dad35485dacd9365c27bc07a7e2e"],["/blog/ui/origami-learning-1.js","6dc15037acb10e894a2bdbc3049cc31d"],["/blog/ui/origami-learning-note-2.html","b602e9a44c1d656baf58a97812e60fb3"],["/blog/ui/origami-learning-note-2.js","d66b200ffee525dca8e85e7df3720e3a"],["/ecloud-baidu:/open.html","cfb93e8050373c8060b8725b1da9f787"],["/extra/images/jobs/joinus.png","d4e7f9e4c61ce4437e8941e6cb70d4ea"],["/fe.html","b7edb547a06b3bc35d69418f9001e28b"],["/fe/page/2.html","904118c99599d635330d347446f11172"],["/fe/page/3.html","53ebdd1b67ea292acb53c36a0dde5663"],["/fe/page/4.html","50f6eb3b76098f50193fb1e90b254a18"],["/https/github.com/appleboy/npm-vs-yarn.html","cfb93e8050373c8060b8725b1da9f787"],["/index.html","bfe737fa527c73f67cc658fd843c120c"],["/jobs.html","3e724ec09fe92433141fa1616eb33027"],["/page/2.html","d1d318166d98826715f859f6776ac17c"],["/page/3.html","7fa0b9cf395d121e70f7174252a4baf7"],["/page/4.html","5671d99862876077cdb62e2606bfd3b4"],["/page/5.html","162fc74ea1d2dc94db17416418c4d066"],["/style.css","8b2675ffc7274ae7723d7c3cd035d9aa"],["/team.html","993558d7d1d20376ff0703c85b2d739e"],["/theme/templates/assets/images/aboutus-baidu.png","9987ffe2483d4f1630d63e72fe366e57"],["/theme/templates/assets/images/header.jpg","a069d348351fe0b1f73a43a831a680af"],["/theme/templates/assets/images/icon-none-bear-small.png","59095fa6a2299df805619113ba1ffd97"],["/theme/templates/assets/images/logo.png","e975efafa0d333e72a2001052917d341"],["/theme/templates/assets/images/no-content.png","9d88967816ef10148c7a7430b00676b8"],["/to.html","f92ceebfdfee1e6ce20cef8310aed069"],["/tools.html","f92ceebfdfee1e6ce20cef8310aed069"],["/ue.html","4baf120a82ef0a6ac34ae0a4be6a3da4"],["/ui.html","54b2dc37f2a10efb2079189a6b96f7bb"],["/weibo.com.html","f92ceebfdfee1e6ce20cef8310aed069"],["/works.html","f92ceebfdfee1e6ce20cef8310aed069"],["/www.caniuse.com.html","f92ceebfdfee1e6ce20cef8310aed069"],["/www.zhihu.com.html","f92ceebfdfee1e6ce20cef8310aed069"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  return;
                  // throw new Error('Request for ' + cacheKey + ' returned a ' +
                  //  'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    if (!shouldRespond) {
      shouldRespond = [
        url.replace(/\/*$/, '.html'),
        url.replace(/\/*$/, '/index.html'),
        url
      ].some(function (maybeUrl) {
        if (urlsToCacheKeys.has(maybeUrl)) {
          url = maybeUrl
          return true
        }
      })
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '/index.html';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







