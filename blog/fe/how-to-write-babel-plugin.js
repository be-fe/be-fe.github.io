webpackJsonp([46,56],{808:function(s,a){s.exports={content:"<p>在现代Web前端开发中，离不开JavaScript es6/7，而 ES6/7 中最常用的语法翻译当属 Babel 了。</p><p>这篇文章将带读者从零开始开发一个自定义的Babel插件。</p><h2 id=babel是什么><a href=#babel%E6%98%AF%E4%BB%80%E4%B9%88 aria-hidden=true><span class=\"icon icon-link\"></span></a>Babel是什么</h2><p>Babel 使用 babylon 解析 JavaScript 代码，得到抽象语法树（Abstract Syntax Tree，后文简称 AST）。 同时也可以使用<code>babel-generator</code>，输入一个合法的 AST，还原成 JavaScript 代码</p><img src=http://obu9je6ng.bkt.clouddn.com/FkKXk5xwPpo_reQHW3U3Y_yGF991?imageslim width=434 height=98><p>代码如下：</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript>cosnt babel = <span class=hljs-built_in>require</span>(<span class=hljs-string>'babel-core'</span>)\n<span class=hljs-keyword>const</span> code = <span class=hljs-string>`\nimport e from './where'\nconst [ a, b, c ] = [ 1, 2, 3 ]\n`</span>\n<span class=hljs-keyword>const</span> { ast } = babel.transform(code, { <span class=hljs-attr>ast</span>: <span class=hljs-literal>true</span> })\n\n<span class=hljs-keyword>const</span> generate = <span class=hljs-built_in>require</span>(<span class=hljs-string>'babel-generator'</span>)\n<span class=hljs-keyword>const</span> { <span class=hljs-attr>code</span>: codeFromBabel } = generate(ast)</code></pre><h3 id=ast><a href=#ast aria-hidden=true><span class=\"icon icon-link\"></span></a>AST</h3><p>ast 在这是指将 JavaScript 代码进行解析得到的抽象语法树（数据结构）。 如代码</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>const</span> key = <span class=hljs-string>'value'</span></code></pre><p>解析产生的 AST 如下图所示 <img src=http://obu9je6ng.bkt.clouddn.com/Foe8OrdCEPOhQX4-VHbqkOtDruF9?imageslim width=426 height=488></p><p>建议使用 <a href=http://astexplorer.net/#/Z1exs6BWMq>AST Explorer</a> 在线预览 AST</p><h2 id=plugin-和-preset><a href=#plugin-%E5%92%8C-preset aria-hidden=true><span class=\"icon icon-link\"></span></a>Plugin 和 Preset</h2><p>我们在使用 Babel 的时候，通常需要配置一些预设（presets）和插件（plugins）。 如</p><pre><code class=\"hljs language-json\"data-query={} data-lang=json>{\n  <span class=hljs-attr>\"presets\"</span>: [<span class=hljs-string>\"env\"</span>],\n  <span class=hljs-attr>\"plugins\"</span>: [<span class=hljs-string>\"async-to-generator\"</span>]\n}</code></pre><p>其实，preset是一堆plugin的结合，那么plugin又是什么呢？ 如下图，plugin 会转换 AST，对 AST 进行处理，从而也能够影响到产生出来的 JS Code。</p><img src=http://obu9je6ng.bkt.clouddn.com/FmBuevqTrAt8VApb-bnWygS6cwrK?imageslim width=489 height=114><p>在后文中学习了开发 Babel 插件后，将阐述一下 Babel plugin 和 preset 的执行过程和顺序。</p><h2 id=开发-babel-插件><a href=#%E5%BC%80%E5%8F%91-babel-%E6%8F%92%E4%BB%B6 aria-hidden=true><span class=\"icon icon-link\"></span></a>开发 Babel 插件</h2><p>了解了 Babel 插件的概念后，让我们动手撸一个 Babel 插件吧！</p><h3 id=情景再现><a href=#%E6%83%85%E6%99%AF%E5%86%8D%E7%8E%B0 aria-hidden=true><span class=\"icon icon-link\"></span></a>情景再现</h3><p>在使用构建工具 Webpack 开发大型项目的时候，我们可能通常需要 import 一大串依赖</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>import</span> a <span class=hljs-keyword>from</span> <span class=hljs-string>'a'</span>\n<span class=hljs-keyword>import</span> b <span class=hljs-keyword>from</span> <span class=hljs-string>'b'</span>\n<span class=hljs-keyword>import</span> c <span class=hljs-keyword>from</span> <span class=hljs-string>'c'</span>\n<span class=hljs-comment>// ...</span>\n\n<span class=hljs-comment>// code here</span></code></pre><p>但是在开发的逻辑中可能只需要用到其中的一丢丢依赖，比如 <code>a</code>，那么依赖<code>b</code> <code>c</code> 都是“无效”的依赖。</p><p><strong>注意：</strong> 无效只是相对而言的，因为在 <code>'b', 'c'</code> 依赖中可能会执行一些副作用的逻辑。如设置全局变量，环境变量，做些初始化工作...</p><p>在优化项目的时候，就需要考虑到去除掉无效的 <code>import</code> 语句了，这样可以一定程度上加快程序执行速度，缩小打包出来的 bundle 大小。</p><h3 id=开发插件！><a href=#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6%EF%BC%81 aria-hidden=true><span class=\"icon icon-link\"></span></a>开发插件！</h3><p>不想偷懒的墨鱼不是好程序员！对于上面的问题，可以通过开发 Babel 插件来实现，减少我们的人力工作量。</p><p><strong>程序思路</strong> 1. 根据 <code>import ...</code> 语法，得到 imported 变量名集合 2. 过滤掉使用过的 imported 变量名 3. 移除没有使用到的 <code>import ...</code> 语句</p><p>思路总是很简单，但只有真正实现过的人才知道里面的具体种种。</p><p>Babel 插件返回一个 function ，入参为 babel 对象，返回 Object。</p><p>其中 <code>pre</code>, <code>post</code> 分别在进入/离开 AST 的时候触发，所以一般分别用来做初始化/删除对象的操作</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-built_in>module</span>.exports = <span class=hljs-function>(<span class=hljs-params>babel</span>) =></span> {\n  <span class=hljs-keyword>return</span> {\n    pre(path) {\n      <span class=hljs-keyword>this</span>.runtimeData = {}\n    },\n    <span class=hljs-attr>visitor</span>: {},\n    post(path) {\n      <span class=hljs-keyword>delete</span> <span class=hljs-keyword>this</span>.runtimeData\n    }\n  }\n}</code></pre><p>然后是 visitor 访问者对象。</p><p>先看个简单的例子： 如需要将如下代码中的 x 变量重命名为 y</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>const</span> x = <span class=hljs-string>'x'</span>\nalert(x)</code></pre><p>visitor 书写为：</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>const</span> visitor = {\n  Identifier(path, data) {\n    <span class=hljs-keyword>if</span> (path.node.name === <span class=hljs-string>'x'</span>) {\n      path.node.name = <span class=hljs-string>'y'</span>\n    }\n  }\n}</code></pre><p>输出为：</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>const</span> y = <span class=hljs-string>'x'</span>\nalert(y)</code></pre><p>可以看出，visitor 是 Object 类型，其中的 key 对应 AST 中的各个节点的 type，<code>path.node</code> 是 AST 中的节点数据。</p><p>简单了解 visitor 后，开始我们的开发吧！</p><h4 id=得到-imported-变量名集合><a href=#%E5%BE%97%E5%88%B0-imported-%E5%8F%98%E9%87%8F%E5%90%8D%E9%9B%86%E5%90%88 aria-hidden=true><span class=\"icon icon-link\"></span></a>得到 imported 变量名集合</h4><p>我们需要关心 <code>import</code> 语句有：</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>import</span> lodash <span class=hljs-keyword>from</span> <span class=hljs-string>'loadsh'</span>\n<span class=hljs-keyword>import</span> { extend, cloneDeep <span class=hljs-keyword>as</span> clone } <span class=hljs-keyword>from</span> <span class=hljs-string>'lodash'</span></code></pre><p>而对于 <code>import 'babel-polyfill'</code> 语句，则不关心。</p><p>以 <code>import { extend, cloneDeep as clone } from 'lodash'</code> 为例，得到的 AST 为： <img src=http://obu9je6ng.bkt.clouddn.com/FmoMJFEwtRgN9pPLZeQW2-wmuFC-?imageslim width=475 height=329></p><p>其中的数组 <code>specifiers</code> 为： <img src=https://i.loli.net/2017/11/30/5a201ece80d93.jpg width=356 height=505></p><p>所以我们只需要得到 <code>specifiers</code> 中的 <code>local.name</code> 即可，单为了后续对该 AST 结点进行操作(删除)，所以也需要存储结点信息，如下代码：</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-function><span class=hljs-keyword>function</span> <span class=hljs-title>getSpecifierIdentifiers</span>(<span class=hljs-params>specifiers = [], withPath = false</span>) </span>{\n  <span class=hljs-keyword>const</span> collection = []\n  <span class=hljs-function><span class=hljs-keyword>function</span> <span class=hljs-title>loop</span>(<span class=hljs-params>path, index</span>) </span>{\n    <span class=hljs-keyword>const</span> node = path.node\n    <span class=hljs-keyword>const</span> item = { path, <span class=hljs-attr>name</span>: node.local.name }\n    <span class=hljs-keyword>switch</span> (node.type) {\n      <span class=hljs-keyword>case</span> <span class=hljs-string>'ImportDefaultSpecifier'</span>:\n      <span class=hljs-keyword>case</span> <span class=hljs-string>'ImportSpecifier'</span>:\n        collection.push(item)\n        <span class=hljs-keyword>break</span>;\n    }\n  }\n  specifiers.forEach(loop)\n\n  <span class=hljs-keyword>return</span> collection\n}</code></pre><p>以上代码将返回</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript>[\n  { <span class=hljs-attr>path</span>: NodePath, <span class=hljs-attr>name</span>: <span class=hljs-string>'extend'</span> },\n  { <span class=hljs-attr>path</span>: NodePath, <span class=hljs-attr>name</span>: <span class=hljs-string>'clone'</span> }\n]</code></pre><p>得到该条 <code>import</code> 语句的引入的变量数组后，还需要存储一份 <code>import</code> 语句的 NodePath，为了后续操作(删除)</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript>{\n  <span class=hljs-string>'extend'</span>: {\n    <span class=hljs-attr>parent</span>: path, <span class=hljs-comment>// `import` 语句的 NodePath</span>\n    children: [\n      { <span class=hljs-attr>path</span>: NodePath, <span class=hljs-attr>name</span>: <span class=hljs-string>'extend'</span> },\n      { <span class=hljs-attr>path</span>: NodePath, <span class=hljs-attr>name</span>: <span class=hljs-string>'clone'</span> }\n    ],\n    <span class=hljs-attr>data</span>: { <span class=hljs-attr>path</span>: NodePath, <span class=hljs-attr>name</span>: <span class=hljs-string>'extend'</span> }\n  },\n  <span class=hljs-string>'clone'</span>: {\n    <span class=hljs-attr>parent</span>: path,\n    <span class=hljs-attr>children</span>: [\n      { <span class=hljs-attr>path</span>: NodePath, <span class=hljs-attr>name</span>: <span class=hljs-string>'extend'</span> },\n      { <span class=hljs-attr>path</span>: NodePath, <span class=hljs-attr>name</span>: <span class=hljs-string>'clone'</span> }\n    ],\n    <span class=hljs-attr>data</span>: { <span class=hljs-attr>path</span>: NodePath, <span class=hljs-attr>name</span>: <span class=hljs-string>'clone'</span> }\n  }\n}</code></pre><h4 id=去除使用过的-imported-变量名><a href=#%E5%8E%BB%E9%99%A4%E4%BD%BF%E7%94%A8%E8%BF%87%E7%9A%84-imported-%E5%8F%98%E9%87%8F%E5%90%8D aria-hidden=true><span class=\"icon icon-link\"></span></a>去除使用过的 imported 变量名</h4><p>在去除使用过的 imported 变量名之前，需要明确一点： 在 ES6 标准中，import 中定义的变量名是不能被重新定义的，如下代码是不被允许的。</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>import</span> _ <span class=hljs-keyword>from</span> <span class=hljs-string>'lodash'</span>\n<span class=hljs-keyword>const</span> _ = <span class=hljs-string>'hello'</span></code></pre><p>那么什么情况下 <code>extend</code> 是被使用的呢？</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript>extend = <span class=hljs-string>'extend'</span>\n[ extend ]\n{ <span class=hljs-attr>key</span>: extend }\nextend - <span class=hljs-number>2</span>\nextend / <span class=hljs-number>2</span>\nextend > <span class=hljs-number>2</span>\nextend &lt;= <span class=hljs-number>2</span>\nextend[<span class=hljs-string>'key'</span>]()\nextend.key = <span class=hljs-number>233</span>\nextend.key &lt; <span class=hljs-number>233</span>\n<span class=hljs-comment>// ...</span></code></pre><p>情况太多了 😢 既然正面列举被使用的情况比较复杂，那何不逆向思维，考虑 <code>extend</code> 没被使用的情况呢？</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>const</span> extend = <span class=hljs-string>'value'</span>\n{ <span class=hljs-attr>extend</span>: <span class=hljs-string>'value'</span> }\nref.extend\n<span class=hljs-class><span class=hljs-keyword>class</span> <span class=hljs-title>A</span> </span>{\n  extend() {}\n  extend = <span class=hljs-number>233</span>\n}</code></pre><p>果然情况就好多了嘛 😄</p><p>于是，去除使用过的 imported 变量名也可以欢快地完成啦！</p><h4 id=移除没有使用到的-import--语句><a href=#%E7%A7%BB%E9%99%A4%E6%B2%A1%E6%9C%89%E4%BD%BF%E7%94%A8%E5%88%B0%E7%9A%84-import--%E8%AF%AD%E5%8F%A5 aria-hidden=true><span class=\"icon icon-link\"></span></a>移除没有使用到的 <code>import ...</code> 语句</h4><ol><li>遍历最终得到的没有使用到变量集合 A；</li><li>如果 item 中的 <code>children</code> 中每一个 <code>name</code> 都存在于 A 中，删除 <code>item.parent</code> 结点，否则只删除 <code>item.data.path</code> 结点；</li></ol><h3 id=打完收工！><a href=#%E6%89%93%E5%AE%8C%E6%94%B6%E5%B7%A5%EF%BC%81 aria-hidden=true><span class=\"icon icon-link\"></span></a>打完收工！</h3><p>完成了上面一系列的分析后，得到的最终插件代码大概这个样子：</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-built_in>module</span>.exports = {\n  pre() {\n    <span class=hljs-keyword>this</span>.runtimeData = {}\n  }\n  visitor: {\n    ImportDeclaration(path, data) {\n        <span class=hljs-keyword>const</span> locals = getSpecImport(path);\n        <span class=hljs-keyword>if</span> (locals) {\n          locals.forEach(<span class=hljs-function>(<span class=hljs-params>pathData, index, all</span>) =></span> {\n          <span class=hljs-keyword>const</span> {name} = pathData\n          <span class=hljs-keyword>this</span>.runtimeData[name] = {\n            <span class=hljs-attr>parent</span>: path,\n            <span class=hljs-attr>children</span>: all,\n            <span class=hljs-attr>data</span>: pathData\n          }\n        })\n        <span class=hljs-comment>// 跳过当前path的子节点的向下遍历</span>\n        <span class=hljs-comment>// 为了防止遍历 import 语句中的 Identifier</span>\n        path.skip()\n      }\n    },\n    Identifier() {\n      <span class=hljs-comment>// 书写步骤2逻辑，删除使用过的Identifier</span>\n    },\n    JSXIdentifier() {\n      <span class=hljs-comment>// 书写步骤2逻辑，删除使用过的Identifier</span>\n    }\n  },\n  post() {\n    <span class=hljs-comment>// 书写步骤3逻辑</span>\n    <span class=hljs-keyword>delete</span> <span class=hljs-keyword>this</span>.runtimeData\n  }\n}</code></pre><p>以上代码咋看一下逻辑的确没问题。 <strong>但是！</strong>搭配<code>preset-es2015</code>使用时，将会不能正确删除未使用的变量名或者 import 语句。 报错：<code>NodePath has been removed so is read-only.</code> 因为 es2015 中会将 import 语句进行替换，相当于存储的 NodePath 已经被删除了。</p><p>关于Babel中plugin和preset的执行顺序，官方的解释如下：</p><blockquote><p>Plugins run before Presets. Plugin ordering is first to last. Preset ordering is reversed (last to first).</p></blockquote><p>既然 Plugins run before Presets，那为什么还会有上诉的问题呢？</p><p>Babel的核心开发人员 @hzoo 做出下列解释:</p><blockquote><p>Plugins do go before presets, but it just adds the same visitors first before merging them.</p></blockquote><p>意思是，Babel 在处理 plugins 的时候，会将 visitor 里面各个对应的单元统一合并，然后再按照插件的顺序去执行。</p><img src=http://obu9je6ng.bkt.clouddn.com/FmNs17OZT1JSki4bVtVQ0Tepxk5P?imageslim width=501 height=139><p>所以在执行到 post() 方法时，其实es2015中的插件已经将 import 语句替换了 😢</p><p>那么该问题如何解决呢？ 可以 AST 最外层的 Program 结点遍历 path，逻辑同上。</p><p>最终代码为：</p><pre><code class=\"hljs language-javascript\"data-query={} data-lang=javascript><span class=hljs-keyword>const</span> traverseObject = {\n  ImportDeclaration(path, data) {\n    <span class=hljs-comment>// ...</span>\n  },\n  Identifier() {\n    <span class=hljs-comment>// ...</span>\n  },\n  JSXIdentifier() {\n    <span class=hljs-comment>// ...</span>\n  }\n}\n\n<span class=hljs-built_in>module</span>.exports = <span class=hljs-function><span class=hljs-keyword>function</span> (<span class=hljs-params>babel</span>) </span>{\n  <span class=hljs-keyword>return</span> {\n    pre(path) {\n      <span class=hljs-keyword>this</span>.runtimeData = {}\n    },\n    <span class=hljs-attr>visitor</span>: {\n      Program(path, data) {\n        <span class=hljs-comment>// 在最外层的 Program 遍历 path</span>\n        path.traverse(traverseObject, {\n          <span class=hljs-attr>runtimeData</span>: <span class=hljs-keyword>this</span>.runtimeData\n        })\n        handleRemovePath(<span class=hljs-keyword>this</span>.runtimeData)\n      }\n    },\n    post() {\n      <span class=hljs-keyword>delete</span> <span class=hljs-keyword>this</span>.runtimeData\n    }\n  }\n}</code></pre><p>源码：<a href=https://github.com/imcuttle/babel-plugin-danger-remove-unused-import>GitHub +1</a></p><h2 id=参考资料><a href=#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99 aria-hidden=true><span class=\"icon icon-link\"></span></a>参考资料</h2><ul><li><a href=https://github.com/babel/babel/issues/5623>Discussion: Fix Plugin Ordering #5623</a></li><li><a href=https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md>babel handbook</a></li></ul>",extra:{"_image-loader_":[]}}}});
//# sourceMappingURL=how-to-write-babel-plugin.js.map