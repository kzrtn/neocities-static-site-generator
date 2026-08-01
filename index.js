const fs = require('node:fs')

const nunjucks = require('nunjucks')
const MarkdownIt = require('markdown-it')
const matter = require('gray-matter')
const dayjs = require('dayjs')

const createFolderPathifNotExists = require('./utils/create_folderpath_if_not_exists.js')
const copyFilesFromPath = require('./utils/copy_files_from_folder.js')

const md = new MarkdownIt()

// Folder path for markdown posts
const POST_PATH = './_posts/'
const posts_filenames = fs.readdirSync(POST_PATH)

// Folder path for templates
const TEMPLATES_PATH = './_templates/'
const templates = fs.readdirSync(TEMPLATES_PATH)
nunjucks.configure(TEMPLATES_PATH, { autoescape: false })

// Folder path for style sheets
const STYLE_PATH = './_styles/'
const styles = fs.readdirSync(STYLE_PATH)

// Output folder
const OUTPUT_PATH = './dist/'
const POST_OUTPUT_PATH = `${OUTPUT_PATH}/posts/`

createFolderPathifNotExists(OUTPUT_PATH)
createFolderPathifNotExists(POST_OUTPUT_PATH)
copyFilesFromPath(STYLE_PATH, OUTPUT_PATH) // Copies the stylesheets to dist

for (const post of posts_filenames) {
  fs.readFile(`${POST_PATH}/${post}`, 'utf8', (err, data) => {
    if (err) {
      console.error(err.message)
      return;
    }

    const file = matter(data)
    const content = md.render(file.content)
    const title = file.data.title
    const date = new Date(file.data.date)

    const filename = dayjs(date).format('YYYY-MM-DD') + '-' + title.toLowerCase().replace(' ', '-')

    let result = null
    templates.forEach(template => {
      result = nunjucks.render(template, {content: content, title: title, date: file.data.date})
    })

    fs.writeFile(`./dist/posts/${filename}.html`, result, err => {
      if (err) {
        console.error(err.message)
      } else {
        console.log('file written')
      }
    })    
  })
}



/*
const PORT = 3000
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)
*/