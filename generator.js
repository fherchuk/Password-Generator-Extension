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
    tail += head;
    return tail;
  }
  
  function list_to_string(char_list) {
    var new_string;
    new_string = "";
  
    for (var element, _pj_c = 0, _pj_a = char_list, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
      element = _pj_a[_pj_c];
      new_string.join(element);
    }
  
    return new_string;
  }
  
  function encode(letter, keyword) {
    var asc_num;
    asc_num = ord(letter) * ord(keyword[0]) % 128;
    asc_num = ascii_check(asc_num);
    keyword = cycle(keyword);
    return [chr(asc_num), keyword];
  }
  
  function encrypt(plaintext, ciphertext, keyword) {
    var chr, letter;
  
    if (plaintext.length === 0) {
      return ciphertext;
    }
  
    [letter, ...tail] = plaintext;
    [chr, keyword] = encode(letter, keyword);
    ciphertext += chr;
    return encrypt(tail, ciphertext, keyword);
  }
  
  function extend(password) {
    var extension
    if (password.length < 16) {
        var splitString = password.split("");
        var reverseArray = splitString.reverse();
        extension = reverseArray.join("");

        
      return password + extension;
    }
  }

  console.log(encrypt(extend("password"), "", "google.com"));
