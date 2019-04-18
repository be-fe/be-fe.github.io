webpackJsonp([29,56],{825:function(e,o){e.exports={content:'<h3 id=数据传递转码><a href=#%E6%95%B0%E6%8D%AE%E4%BC%A0%E9%80%92%E8%BD%AC%E7%A0%81 aria-hidden=true><span class="icon icon-link"></span></a>数据传递转码</h3><p>数据在传输的过程中，浏览器会对数据进行编码，假如我现在有一条数据 <code>{"name": "测试"}</code>，如果我们通过 <code>get</code> 方法传递数据，这条数据会被拼接到 <code>url</code> 请求的后面，如：<code>localhost:8080/src/text.html?name=测试</code>。</p><p>uri本身是采用ASCII编码的，所以如果是非 <code>ASCII</code> 编码集的字符在传输时都会被编码，编码方法和 <code>encodeURI</code> 的编码规则相同，但是这里的编码规则是由浏览器控制的，不同的浏览器采用的编码方式 <code>(UTF-8,GBK)</code> 不一样，被编码的数据发送给服务器，服务器用 <code>iso-8859-1</code> 编码对数据解码，后端人员通过 <code>request.getParameter("name")</code> 获取参数数据，且获得的数据都是经过解码过的，而解码过程中程序里无法指定，对于 <code>get</code> 请求获得的数据 <code>request.setCharacterEncoding("字符集")</code> 指定解码规则无效。</p><p>如果是 <code>post</code> 方法传递数据，浏览器也会对数据进行编码，如果我们在 <code>ajax</code> 请求头里面设置了 <code>setRequestHeader("ContentType","application/x-www-form-urlencoded;charset=UTF-8")</code>; 浏览器就会以charset值进行编码，如果没有设置则由网页 <code>meta</code> 标签的 <code>charset</code> 属性决定，被编码过的数据发送给服务器，服务器用 <code>iso-8859-1</code> 编码对数据解码，对于post请求发来的数据后端人员可以使用 <code>request.setCharacterEncoding("字符集")</code> 指定解码规则。</p><p>相信你已经找出了乱码的原因，由于 <code>get</code> 方法传的的数据，浏览器的转码规则和服务器的解码规则不一致出现了乱码，我们一般是怎么解决的呢？<code>get</code> 方式发送的数据如果有中文和特殊字符前端会先使用 <code>encodeURI()</code> 方法转码，这样 <code>url</code> 里面的就都是 <code>ASCII</code> 编码集的字符，省去了浏览器的转码，且 <code>encodeURI()</code> 的转码规则可控，受网页 <code>meta</code> 头的 <code>charset</code> 属性影响，</p><ol><li>标签的 <code>charset</code> 属性为 <code>utf-8</code> 时：</li></ol><pre><code data-query={} data-lang>var data = \'百度&amp%$#@baidu\';\nconsole.log(encodeURI(data));\n// %E7%99%BE%E5%BA%A6&amp%25$#@baidu\nconsole.log(encodeURIComponent(data));\n// %E7%99%BE%E5%BA%A6%26%25%24%23%40baidu\n</code></pre><ol start=2><li>标签的 <code>charset</code> 属性为 <code>GBK</code> 时：</li></ol><pre><code data-query={} data-lang>var data = \'百度&amp%$#@baidu\';\nconsole.log(encodeURI(data));\n// %E9%90%A7%E6%83%A7%E5%AE%B3&amp%25$#@baidu\nconsole.log(encodeURIComponent(data));\n// %E9%90%A7%E6%83%A7%E5%AE%B3%26%25%24%23%40baidu\n</code></pre><p>后端人员获取到用iso-8859-1解码后的数据一般先还原回字节码，然后用前后端协定的方式解码数据，还可以在服务器的配置文件里面进行配置解码规则。而post请求发送的数据可以使用request.setCharacterEncoding("字符集")指定解码规则来达到前后端转码统一。</p><p>当我们需要传递的数据量大，结构复杂，业务场景，技术实现需要的时候我们就又会发现，乱码的问题依然存在，比如</p><ul><li>json格式的数据由于特殊字符导致数据解析出现问题，</li><li>xml格式数据由于特殊字符破坏xml格式导致数据解析出现问题，</li><li>前后端一些语言自带的转码方法对一些特殊字符转码结果不一致，以及并非所有特殊字符都会被转码...</li></ul><p>如果我们使用 <code>encodeURI</code> 或者 <code>encodeURIComponent</code> 编码传输到后端，后端解码之后的数据总会因为一些特殊字符的转码不一致导致结果不一样，如果再加上 <code>md5</code> 校验之类的，前端传递的数据就会因为 <code>md5</code> 不同无法解析入库。</p><p>那么这个时候我们就该考虑有没有一种转码规则可以解决以上所有的问题呢？<code>base64</code> 转码你值得拥有。</p><h3 id=base64转码><a href=#base64%E8%BD%AC%E7%A0%81 aria-hidden=true><span class="icon icon-link"></span></a>base64转码</h3><p><code>base64</code> 编码是从二进制到字符的过程，编码受 <code>html</code> 页面头部 <code>mate</code>;标签的 <code>charset</code> 属性影响，<code>charset</code> 属性不同，编码转为二进制时，产生的二进制也是不一样的，所以最终产生的 <code>base64</code> 字符也不一样。</p><ol><li><code>mate</code> 标签的 <code>charset</code> 属性为 <code>utf-8</code> 时：</li></ol><pre><code data-query={} data-lang>&lt;!DOCTYPE html>\n&lt;html lang="en">\n&lt;head>\n&lt;meta charset="utf-8">\n&lt;title>base64&lt;/title>\n&lt;/head>\n&lt;body>\n&lt;script src="base64.min.js">&lt;/script>\n&lt;script>\nvar data = \'百度&amp%$#@baidu\';\nconsole.log(base64encode(data));\n// fqYmJSQjQGJhaWR1\n&lt;/script>\n&lt;/body>\n</code></pre><ol start=2><li><code>mate</code> 标签的 <code>charset</code> 属性为 <code>GBK</code> 时：</li></ol><pre><code data-query={} data-lang>&lt;!DOCTYPE html>\n&lt;html lang="en">\n&lt;head>\n&lt;meta charset="GBK">\n&lt;title>base64&lt;/title>\n&lt;/head>\n&lt;body>\n&lt;script src="base64.min.js">&lt;/script>\n&lt;script>\nvar data = \'百度&amp%$#@baidu\';\nconsole.log(base64encode(data));\n// J+ezJiUkI0BiYWlkdQ==\n&lt;/script>\n&lt;/body>\n</code></pre><p>有关 <code>base64</code> 转码原理有兴趣可自行百科。</p><h3 id=总结><a href=#%E6%80%BB%E7%BB%93 aria-hidden=true><span class="icon icon-link"></span></a>总结</h3><p>所以工作中如果涉及到文本框输入等复杂的内容数据传递为了避免中文乱码以及各种特殊符号带来的困扰就使用 <code>base64</code> 转码传递。 如果只是URL里面的传递简单的参数可以使用 <code>encodeURI</code> 和 <code>encodeURIComponent</code> 等转码。</p>',extra:{"_image-loader_":[]}}}});
//# sourceMappingURL=前后端数据传输不得不面对的转码问题.js.map