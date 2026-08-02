const fs = require('node:fs')

const nunjucks = require('nunjucks')
const MarkdownIt = require('markdown-it')
const matter = require('gray-matter')
const dayjs = require('dayjs')

const config = require('./config/config.js')

const createFolderPathifNotExists = require('./utils/create_folderpath_if_not_exists.js')
const copyFilesFromPath = require('./utils/copy_files_from_folder.js')
const { randomUUID } = require('node:crypto')

const md = new MarkdownIt()
nunjucks.configure(config.TEMPLATES_PATH, { autoescape: false })

// Delete dist folder, recreate and copy stylesheets over
// It's important to delete any previous posts that are no longer in _posts
fs.rmSync(config.OUTPUT_PATH, { recursive:true, force: true })
createFolderPathifNotExists(config.OUTPUT_PATH)
createFolderPathifNotExists(config.POST_OUTPUT_PATH)
copyFilesFromPath(config.STYLE_PATH, config.OUTPUT_PATH)

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
let postsData = []
for (const post of config.posts) {
  const rawData = fs.readFileSync(`${config.POST_PATH}/${post}`, { encoding: 'utf-8', flag: 'r' })
  const dataObj = matter(rawData)
  
  const HTMLcontent = md.render(dataObj.content)
  const title = dataObj.data.title
  const date = new Date(dataObj.data.date)
  const filename = dayjs(date).format('YYYY-MM-DD') + '-' + removeIllegalChar(title)

  postsData.push({
    content: HTMLcontent,
    title: title,
    date: `${dayjs(date).format('YYYY-MM-DD')}`,
    day: weekdays[date.getDay()],
    id: randomUUID(),
    filename: `${filename}.html`
  })

  // Copy images to appropriate destination in dist if they exist
  parseImages(dataObj.content)

  // Render the page with new data and final HTML to output
  const output = nunjucks.render(`${config.BLOG_POST}.html`, {content: HTMLcontent, title: title, date: date.toDateString()})
  fs.writeFileSync(`./dist/posts/${filename}.html`, output)
}

// Render the index page with all the posts
const result = nunjucks.render(`${config.BLOG_INDEX}.html`, {posts: postsData.reverse()})
fs.writeFileSync(`./dist/${config.BLOG_INDEX}.html`, result)

function removeIllegalChar(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-'); 
}

// Accepts string of markdown data and copies any images referenced to output folder
function parseImages(rawData) {
  const imagePaths = rawData.match(/(?<=!\[.*\]\().*(?=\))/g)
  imagePaths.forEach(imagePath => {
    if (!imagePath.includes('http')) {
      if (imagePath.includes('<') && imagePath.includes('>')) {
        imagePath = (imagePath.match(/(?<=<).*(?=>)/g))[0]
      }
      
      const imageHomePath = imagePath.match(/^.*[\/$]/g)
      createFolderPathifNotExists(`${config.OUTPUT_PATH}/posts/${imageHomePath}`)

      const sourcePath = `_posts/${imagePath}`
      const destPath = `${config.OUTPUT_PATH}/posts/${imagePath}`

      try {
        fs.copyFileSync(sourcePath, destPath)
        console.log(`COPIED FILE: FROM '${sourcePath}' TO '${destPath}'`)
      } catch (err) {
        console.error(err.message)
      }
    }
  })  
}