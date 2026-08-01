const fs = require('node:fs')

const express = require('express')
const MarkdownIt = require('markdown-it')
const matter = require('gray-matter')
const bs = require('browser-sync').create()

const md = new MarkdownIt()
const app = express()

app.use(express.static('dist', {index: 'blogs.html'}))

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

let templateData = null
for (const template of templates) {
  const data = fs.readFileSync(`${templatesPath}/${template}`, { encoding: 'utf8', flag: 'r' })
  templateData = data
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

    if (templateData && fs.existsSync(outPath)) {
      const file = matter(data)

      const content = md.render(file.content)
      const title = file.data.title
      const date = file.data.date

      const result = templateData
                      .replace('{{content}}', content)
                      .replace('{{title}}', title)
                      .replace('{{date}}', date)

      fs.writeFile('./dist/test.html', result, err => {
        if (err) {
          console.error(err.message)
        } else {
          console.log('file written')
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

    }
  })
}

bs.init({
  server: "./dist"
})

bs.reload(["*.html", "*.css"])

/*
const PORT = 3000
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)
*/