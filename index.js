const marked = require('marked');
const fs = require('fs');

let renderer = new marked.Renderer();
renderer.listitem = function (body) {
  return `
    <li><a href="#${body}"><i class="fa fa-angle-right"></i>${body}</a></li>
  `
}
renderer.list = function (body, isorder) {
  const tag = isorder
    ? 'ol'
    : 'ul';
  return `
    <${tag} class='links'>
      ${body}
    </${tag}>`
}

const content = marked(fs.readFileSync('./markdown/content.md').toString());
const list = marked(fs.readFileSync('./markdown/list.md').toString(), {renderer: renderer});
const body = fillBody(fillList(list), fillContent(content));

// 写入文件
fs.writeFile('./output/document.html', body, err => {
  if (err) {
    console.log('产生了错误', err);
    process.exit(1);
    return false;
  }
  console.log('文件生成成功');
  process.exit();
});

// 填充content
function fillContent(content = '') {
  return `
  <div class="col-md-9 col-md-push-3">
    ${content}
  </div> `
}
// 填充list
function fillList(list = '') {
  return `
  <aside class="col-md-3 col-md-pull-9 sidebar" role="complementary">
    <div class="widget">
      ${list}
    </div>
  </aside>`
}
// 填充body
function fillBody(list = '', content = '') {
  const result = `
    <div class='container'>
      <div class='row'>
        ${content}

        <div class="mb60 clearfix visible-sm visible-xs"></div><!-- space -->

        ${list}
      </div>
    </div>`;
  return result;
}