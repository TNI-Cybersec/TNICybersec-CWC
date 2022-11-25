## Using Tools
- DirBuster (File and Directory Scanning)
- Burp Suite 

## Using Programming (Pseudo Code / Python Requests)

```
import requests

url = 'http://192.168.1.1/'
word_list = open('wordlist.txt', 'r')
for word in word_list.readlines():
    res = requests.get(url + word)
    print('Status = ' + res.status)
    print('Response = ' + res.text)

```