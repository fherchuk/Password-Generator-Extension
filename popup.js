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

// Pass HTML Variable INTO JS FUNCTION...
function get_plaintext(){
  var plaintext = document.getElementById("plaintext").value;
  document.getElementById('output').innerHTML = encrypt(extend(plaintext), "", "google.com");
  document.getElementById('check').innerHTML = "Password Generated!"
}


document.getElementById("submit").addEventListener("click", get_plaintext);
