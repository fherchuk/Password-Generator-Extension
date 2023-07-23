  function ascii_check(value) {
    if (value < 32) {
      return value + 32;
    }
  
    if (value === 127) {
      return value - 1;
    }
  
    return value;
  }
  function cycle(keyword) {
    var head;
    [head, ...tail] = keyword;
    tail.push(head);
    return tail;
} 
  function encode(letter, keyword) {
    var asc_num;
    asc_num = (letter.charCodeAt(0) * keyword[0].charCodeAt(0) + keyword.length) % 128;
    asc_num = ascii_check(asc_num);
    return String.fromCharCode(asc_num);
  }
  function encrypt(plaintext, ciphertext, keyword) {
    var letter;

    if (plaintext.length === 0) {
      return ciphertext;
    }
  
    [letter, ...remainder] = plaintext;
    ciphertext += encode(letter, keyword);
    keyword = cycle(keyword);
    console.log(remainder);
    return encrypt(remainder, ciphertext, keyword);
 }
  
  function extend(password) {
    var extension
    if (password.length < 16) {
        var splitString = password.split("");
        var reverseArray = splitString.reverse();
        extension = reverseArray.join("");
      return password + extension;
    }
    return password;
  }


  var currentURL = "_";

  async function getCurrentTabUrl () {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    return tabs[0].url;
  }
  function displayUrl(current_tab){
    currentURL= getHostName(current_tab);
  }
  function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      var hostname = match[2].split(".");
      return hostname[hostname.length -2];
    }
    else {
      return null;
    }
  }

// Pass HTML Variable INTO JS FUNCTION...

function get_plaintext(){
  getCurrentTabUrl().then(function(value){displayUrl(value)});
  var plaintext = document.getElementById("plaintext").value;
  document.getElementById('output').innerHTML = encrypt(extend(plaintext), "", currentURL);
  document.getElementById('check').innerHTML = currentURL;
}


document.getElementById("submit").addEventListener("click", get_plaintext);
getCurrentTabUrl().then(function(value){displayUrl(value)});