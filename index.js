#!/usr/bin/env node
const { argv } = require('node:process')
const fs = require('node:fs')
const path = require('node:path')

argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

console.log(`Your current directory: ${__dirname}`)
console.log(`The current working directory: ${process.cwd()}`)