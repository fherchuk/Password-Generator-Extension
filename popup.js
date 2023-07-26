/* global chrome */

function asciiCheck (value) {
  if (value < 32) { return value + 32 }
  if (value === 127) { return value - 1 }
  return value
}

function cycle (keyword) {
  let head = ''
  let tail
  [head, ...tail] = keyword
  tail.push(head)
  return tail
}

function encode (letter, keyword) {
  let ascNum = (letter.charCodeAt(0) * keyword[0].charCodeAt(0) + keyword.length) % 128
  ascNum = asciiCheck(ascNum)
  return String.fromCharCode(ascNum)
}

function encrypt (plaintext, ciphertext, keyword) {
  let letter = ''
  let remainder
  if (plaintext.length === 0) { return ciphertext }

  [letter, ...remainder] = plaintext
  ciphertext += encode(letter, keyword)
  keyword = cycle(keyword)
  console.log(remainder)
  return encrypt(remainder, ciphertext, keyword)
}

function extend (password) {
  let extension
  if (password.length < 16) {
    const splitString = password.split('')
    const reverseArray = splitString.reverse()
    extension = reverseArray.join('')
    return password + extension
  }
  return password
}

let currentURL = '_'

async function getCurrentTabUrl () {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  return tabs[0].url
}

function displayUrl (currentTab) {
  currentURL = getHostName(currentTab)
}

function getHostName (url) {
  const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    const hostname = match[2].split('.')
    return hostname[hostname.length - 2]
  } else {
    return null
  }
}

function getPlaintext () {
  getCurrentTabUrl().then(function (value) { displayUrl(value) })
  const plaintext = document.getElementById('plaintext').value
  const keyword = document.getElementById('keyword').value
  document.getElementById('output').innerHTML = encrypt(extend(plaintext), '', keyword)
  document.getElementById('check').innerHTML = 'Your New Password!'
}

function autoFill () {
  if (document.getElementById('keyword').value === '') {
    document.getElementById('keyword').value = currentURL
  }
}

document.getElementById('submit').addEventListener('click', getPlaintext)
document.getElementById('keyword').addEventListener('click', autoFill)
getCurrentTabUrl().then(function (value) { displayUrl(value) })
