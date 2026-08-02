# A Simple Neocities Static Site Generator
This is a simple static site generator for blog entries on neocities.

## How to use
You create your posts as text files in [Markdown](https://www.markdownguide.org/basic-syntax/) format and put them in the `_posts` folder.

Then, you build the site using `npm start`. (However, I recommend using `npm run dev` to run a live preview of the website that also updates whenever you save any file in the project).

Nunjucks and MarkdownIt will automatically convert your markdown files into HTML files and output them all into the `dist` folder. Blog posts themselves are inserted into `dist/posts/`

You can edit the layouts of the generated blog posts and blog index in the `_templates` folder. The content is inserted with Nunjucks, so it uses [Jinja2](https://jinja.palletsprojects.com/en/stable/) style syntax.

Basically:
* `{{ content }}` inserts the blog post contents
* `{{ title }}` inserts the blog post's title
* `{{ date }}` inserts the blog post's date

The blog index is a little bit more tricky. It uses a for loop of all of your posts with these attributes that you can insert:
* `{{ post.content }}`: The post's contents
* `{{ post.date }}`: The post's date
* `{{ post.day }}`: The post's day (but in shortform format only, aka Mon, Tue, Wed etc)
* `{{ post.id }}`: The post's generated ID
* `{{ post.title }}`: The post's title

The posts also rely on the styles.css in the `_styles` folder. The generated site automatically copies the stylesheets there and inserts them at the root of the `dist` folder. Make sure your layout templates correctly links to it!

We also support images! Put them in any folder within the project (even outside `_posts`) and appropriately link to them. The images will get copied over in the same folder format to `dist`.

## Dependencies
* Nunjucks
* MarkdownIt
* Browser-server
* Concurrently

## To-do:
* ~~Add ability for posts to include images~~ DONE
* Add an easier way for users to install this with the templates, configs, etc
* Fix this readme, it's not comprehensible enough
* Write unit tests for this (I FEEL like there are bugs but I can't tell yet)
* (bug) Browser-server is not working properly on MacOS
* Add ability for different markdown posts to link to different blog templates
* (maybe) write my own markdown parser
