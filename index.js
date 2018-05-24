const marked = require( 'marked' );
const fs = require( 'fs' );

// list 部分的解析方法
let renderer = new marked.Renderer();
renderer.listitem = function ( body ) {
	let content, title;
	if ( ( /<.+?>/ig ).test( body ) ) {
		content = body.slice( body.indexOf( '<' ) );
		title = body.slice( 0, body.indexOf( '<' ) );
		return `<li><a href="#${title}">${title}<span class="category-widget-btn"></span></a>${content}</li>`
	} else {
		content = body;
		title = body;
		return `<li><a href="#${title}" >${content}</a></li>`
	}
}
renderer.list = function ( body, isorder ) {
	return `<ul ${isorder?'':'id="category-widget"'}>${body}</ul>`
}

// content部分的解析方法
let parse_content = new marked.Renderer();
parse_content.heading = function ( body, level ) {
	return `
          <h${level} id='${body}'>
            ${body}
          </h${level}>`;
}

// 生成对应html结构
const content = marked( fs.readFileSync( './markdown/content.md' ).toString(), {
	renderer: parse_content,
	breaks: true
} );
const list = marked( fs.readFileSync( './markdown/list.md' ).toString(), {
	renderer: renderer
} );
const body = fillBody( fillList( list ), fillContent( content ) );

// 写入文件
fs.writeFile( './output/document.html', body, err => {
	if ( err ) {
		console.log( '产生了错误', err );
		process.exit( 1 );
		return false;
	}
	console.log( '文件生成成功' );
	process.exit();
} );


/**************** 生成html方法 *****************/

// 填充content
function fillContent( content = '' ) {
	return `
  <div class="col-md-8 col-md-push-4">
    ${content}
  </div> `
}
// 填充list
function fillList( list = '' ) {
	return `
  <aside class="col-md-3 col-md-pull-8 sidebar" role="complementary">
    <div class="widget">
      ${list}
    </div>
  </aside>`
}
// 填充body
function fillBody( list = '', content = '' ) {
	const result = `
  {% extends "base.html" %}
  {% block content%}
  {% load i18n %}
  <style>
    ol{list-style-type:decimal}
    ul{list-style-type:disc}
    aside.sidebar li{list-style:none}
    table th,table td{padding:0 5px;border:1px solid black;}
    table,ul,ol{margin-bottom:20px;padding-left:24px;}
    #category-widget > li > a {
      color: #666;
      font-size: 16px;
      position: relative;
      border-top: 1px solid #eaeaea;
      padding: 6px 10px 6px 48px;
      text-transform: uppercase;
      font-weight: bold;
    }
    #category-widget > li > a > i{
      display:none;
    }
    #category-widget li li a {
      color: #7e7e7e;
      padding: 2px 10px 2px 36px;
      font-weight:normal;
    }
    #category-widget a {
      display: block;
      font: 600 12px/24px 'Open Sans', Verdana;
      text-transform: uppercase;
    }
    #category-widget ul,#category-widget ol{
      padding:0;
      margin:0;
    } 
  </style>
  <div class="o-head-bottom"></div><!-- space -->
  <div class="mb50"></div>
  <div id="content" role="main">
    <div class='container' >
      <div class='row'>
        ${content}
        <div class="mb60 clearfix visible-sm visible-xs"></div><!-- space -->
        ${list}
      </div>
    </div>
  </div>
  <script>
    $('.category-widget-btn').on('click', function (e) {
      var $this = $(this),
        parent= $this.closest('li');

      if (parent.hasClass('open')) {
        parent.find('ul').slideUp(400, function() {
          parent.removeClass('open');
        });
      } else {
        parent.find('ul').slideDown(400, function() {
          parent.addClass('open');
        });
      }
      e.preventDefault();
    });
  </script>
  {%endblock%}`;
	return result;
}
