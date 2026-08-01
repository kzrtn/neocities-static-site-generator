const fs = require('node:fs')

const nunjucks = require('nunjucks').configure({autoescape: false})
const MarkdownIt = require('markdown-it')
const matter = require('gray-matter')
const dayjs = require('dayjs')

const md = new MarkdownIt()

// Folder path for markdown posts
const postPath = './_posts/'
const posts = fs.readdirSync(postPath)

// Folder path for templates
const templatesPath = './_templates/'
const templates = fs.readdirSync(templatesPath)

// Folder path for style sheets
const stylePath = './_styles/'
const styles = fs.readdirSync(stylePath)

// Output folder
const outPath = './dist/'
const outPostPath = `${outPath}/posts/`

let templateData = []
for (const template of templates) {
  const file = matter(fs.readFileSync(`${templatesPath}/${template}`, { encoding: 'utf8', flag: 'r' }))
  templateData.push(file)
}

for (const post of posts) {
  fs.readFile(`${postPath}/${post}`, 'utf8', (err, data) => {
    if (err) {
      console.error(err.message)
      return;
    }

    if (!fs.existsSync(outPath)){
      fs.mkdirSync(outPath);
      console.log('created dist folder')
    }

    if (!fs.existsSync(outPostPath)){
      fs.mkdirSync(outPostPath);
      console.log('created dist folder')
    }

    const file = matter(data)
    const content = md.render(file.content)
    const title = file.data.title
    const date = new Date(file.data.date)

    const filename = dayjs(date).format('YYYY-MM-DD') + '-' + title.toLowerCase().replace(' ', '-')

    templateData.forEach(template => {
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
        fs.copyFileSync(`${stylePath}/${style}`, `${outPath}/${style}`)
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