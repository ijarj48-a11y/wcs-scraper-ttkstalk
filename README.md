# WCS TikTok Scraper

TikTok public profile scraper by WCS (Web Code Society).

## Features
- Get public profile information
- Get username and display name
- Get follower and following counts
- Get likes and video counts
- Get profile bio and avatar
- Save results as JSON

## Requirements
- Android
- Termux
- Node.js
- Git

## Installation

Install packages:
    pkg update
    pkg install nodejs git

Clone repository:
    git clone https://github.com/ijarj48-a11y/wcs-scraper-ttkstalk.git
    cd wcs-scraper-ttkstalk
    npm install

## Usage

    node scrape-ttstalk.js @username

Example:

    node scrape-ttstalk.js @mrbeast

## Output

Results are saved in JSON format inside the results directory.

## Notes
- Only public profile information is collected.
- No TikTok login is required.
- Results depend on data available at request time.
- TikTok may change its website structure or restrict requests.

## Credits

WCS - Web Code Society
