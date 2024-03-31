/* global chrome */

// Function to ensure ASCII value is within printable range
function asciiCheck(value) {
  if (value < 32) {
    return value + 32;
  }
  if (value === 127) {
    return value - 1;
  }
  return value;
}

// Function to rotate the keyword
function cycle(keyword) {
  return keyword.slice(1).concat(keyword[0]);
}

// Function to encode a letter using keyword
function encode(letter, keyword) {
  let ascNum =
    (letter.charCodeAt(0) * keyword.charCodeAt(0) + keyword.length) % 128;
  ascNum = asciiCheck(ascNum);
  return String.fromCharCode(ascNum);
}

// Recursive function to encrypt plaintext
function encrypt(plaintext, ciphertext, keyword) {
  if (plaintext.length === 0) {
    return ciphertext;
  }
  const [letter, ...remainder] = plaintext;
  return encrypt(
    remainder,
    ciphertext + encode(letter, keyword),
    cycle(keyword)
  );
}

// Function to extend password length
function extend(password) {
  if (password.length < 16) {
    return password + password.split("").reverse().join("");
  }
  return password;
}

// Function to get the current tab's URL
async function getCurrentTabUrl() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0].url;
}

// Function to extract hostname from URL
function getHostName(url) {
  const match = url.match(/:\/\/(www[0-9]?\.)?([^/:]+)/i);
  return match ? match[2].split(".").slice(-2, -1)[0] : null;
}

// Function to fill keyword field with current URL
function autoFill() {
  const keywordInput = document.getElementById("keyword");
  if (!keywordInput.value) {
    getCurrentTabUrl().then(
      (url) => (keywordInput.value = getHostName(url) || "")
    );
  }
}

// Function to handle password generation
function generatePassword() {
  document.getElementById("copy-confirm").innerText = "";
  const plaintext = document.getElementById("plaintext").value;
  const keyword = document.getElementById("keyword").value;
  document.getElementById("output").value = encrypt(
    extend(plaintext),
    "",
    keyword
  );
}
function copyToClipboard() {
  text = document.getElementById("output").value;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard:", text);
      document.getElementById("copy-confirm").innerText =
        "Copied to Clipboard!";
    })
    .catch((error) => {
      console.error("Failed to copy text to clipboard:", error);
    });
}

// Toggle password visibility
document.getElementById("eyeicon").addEventListener("click", function () {
  const plaintext = document.getElementById("plaintext");
  const eyeicon = document.getElementById("eyeicon");
  plaintext.type = plaintext.type === "password" ? "text" : "password";
  eyeicon.src =
    plaintext.type === "password" ? "imgs/eye-off.png" : "imgs/eye-fill.png";
});

// Event listeners
document.getElementById("submit").addEventListener("click", generatePassword);
document.getElementById("copy").addEventListener("click", copyToClipboard);
document.getElementById("keyword").addEventListener("click", autoFill);

// Initialize keyword with current URL
autoFill();
