---
title: Welcome!
date: 28 July 2026
---
This page will explain how to use this static site generator.

## What is this?
This is a simple static site generator for blog entries on neocities.

You create your posts as text files in [Markdown](https://www.markdownguide.org/basic-syntax/) format and put them in the `_posts` folder. Then, you build the site using `npm start`. (However, I recommend using `npm run dev` to run a live preview of the website that also updates whenever you save any file in the project). Nunjucks and MarkdownIt will automatically convert your markdown files into HTML files and output them all into the `dist` folder. Blog posts themselves are inserted into `dist/posts/`

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

![Image](../media/landlady.png.png)

Feel free to poke around the samples I've provided. But whenever you're done, just build the site and upload the contents of `dist` to your neocities site! Happy building!