/* global chrome */

function convertAscii(array) {
    for (let i = 0; i < array.length; i++) {
        let value = array[i] / 2;
        if (value < 32) {
            value += 32;
        }
        if (value === 127) {
            value -= 1;
        }
        array[i] = value;
    }
    return array;
}


async function encrypt(plaintext, keyword) {
    const comboString = plaintext + keyword;

    const salt = new TextEncoder().encode(comboString);

    const hashed = await crypto.subtle.importKey(
        "raw",
        salt,
        { name: "PBKDF2", hash: "SHA-256" },
        false,
        ["deriveBits"]
    );

    const key = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 10000,   
            hash: "SHA-256"       
        },
        hashed,
        128 
    );

    const hashArray = convertAscii(Array.from(new Uint8Array(key)));
    console.log(hashArray);
    return String.fromCharCode(...hashArray);
}


async function generatePassword() {
    document.getElementById("copy-confirm").innerText = "";
    const plaintext = document.getElementById("plaintext").value;
    const keyword = document.getElementById("keyword").value;
    document.getElementById("output").value = await encrypt(plaintext, keyword);
}



async function getCurrentTabUrl() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0].url;
}

function getHostName(url) {
    const match = url.match(/:\/\/(www[0-9]?\.)?([^/:]+)/i);
    return match ? match[2].split(".").slice(-2, -1)[0] : null;
}

function autoFill() {
    const keywordInput = document.getElementById("keyword");
    if (!keywordInput.value) {
        getCurrentTabUrl().then(
            (url) => (keywordInput.value = getHostName(url) || "")
        );
    }
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

function transformBurger() {
    this.classList.toggle("change");
}

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
document.getElementById("hburger").addEventListener("click", transformBurger);

autoFill();