const fs = require('node:fs')

const nunjucks = require('nunjucks').configure({autoescape: false})
const MarkdownIt = require('markdown-it')
const matter = require('gray-matter')
const dayjs = require('dayjs')

const md = new MarkdownIt()

// Folder path for markdown posts
const POST_PATH = './_posts/'
const posts = fs.readdirSync(POST_PATH)

// Folder path for templates
const TEMPLATES_PATH = './_templates/'
const templates = fs.readdirSync(TEMPLATES_PATH)

// Folder path for style sheets
const STYLE_PATH = './_styles/'
const styles = fs.readdirSync(STYLE_PATH)

// Output folder
const OUTPUT_PATH = './dist/'
const POST_OUTPUT_PATH = `${OUTPUT_PATH}/posts/`

let templates = []
for (const template of templates) {
  const file = matter(fs.readFileSync(`${TEMPLATES_PATH}/${template}`, { encoding: 'utf8', flag: 'r' }))
  templates.push(file)
}

for (const post of posts) {
  fs.readFile(`${POST_PATH}/${post}`, 'utf8', (err, data) => {
    if (err) {
      console.error(err.message)
      return;
    }

    if (!fs.existsSync(OUTPUT_PATH)){
      fs.mkdirSync(OUTPUT_PATH);
      console.log('created dist folder')
    }

    if (!fs.existsSync(POST_OUTPUT_PATH)){
      fs.mkdirSync(POST_OUTPUT_PATH);
      console.log('created /dist/posts/ folder')
    }

    const file = matter(data)
    const content = md.render(file.content)
    const title = file.data.title
    const date = new Date(file.data.date)

    const filename = dayjs(date).format('YYYY-MM-DD') + '-' + title.toLowerCase().replace(' ', '-')

    templates.forEach(template => {
      if (template.data.type === 'post') {
        const result = nunjucks.renderString(template.content, {content: content, title: title, date: file.data.date})
        console.log('the result', result)
        /*
        const result = template.content
                      .replace('{{content}}', content)
                      .replace('{{title}}', title)
                      .replace('{{date}}', file.data.date)
        */

        fs.writeFile(`./dist/posts/${filename}.html`, result, err => {
          if (err) {
            console.error(err.message)
          } else {
            console.log('file written')
          }
        })
      }
    })


    // Copy all stylesheets into dist
    for (const style of styles) {
      try {
        fs.copyFileSync(`${STYLE_PATH}/${style}`, `${OUTPUT_PATH}/${style}`)
        console.log('Successfully copied stylesheet')
      } catch (err) {
        console.error(err.message)
      }
    }
    
  })
}

/*
const PORT = 3000
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)
*/