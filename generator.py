# pylint: disable=missing-module-docstring
# pylint: disable=missing-class-docstring
# pylint: disable=missing-function-docstring



# Checks and adjusts for valid ASCII characters

def ascii_check(value):
    if value < 32:
        return value + 32
    if value == 127:
        return value - 1
    return value

# Cycles through string and places current head at the tail.

def cycle(keyword):
    head, *tail = keyword
    tail += head
    return tail

# Converts single character of plaintext string into cipher text character

def encode(letter, keyword):
    asc_num = (ord(letter) * ord(keyword[0])) % 128
    asc_num = ascii_check(asc_num)
    keyword = cycle(keyword)
    return chr(asc_num), keyword

# Recursively loops through plaintext string to convert and return full ciphertext string

def encrypt(plaintext, ciphertext, keyword):
    if len(plaintext) == 0:
        return ciphertext

    letter, *tail = plaintext
    char, keyword = encode(letter, keyword)
    ciphertext += char
    return encrypt(tail, ciphertext, keyword)

# Returns mirrored plaintext extension if length condition is not met.

def extend(password):
    if len(password) < 16:
        password += password[::-1]
    return password

print(encrypt(extend("password"),"","google.com"))