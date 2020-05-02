#!/usr/bin/env node

const { version } = require('../package.json');

module.exports = (args) => {
    console.log(`v${version}`);
}