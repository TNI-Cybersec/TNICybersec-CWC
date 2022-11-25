# Basic Linux Commands

Most general commands.


# Commands

- cat
- cd
- chmod
- chown
- cp
- df
- echo
- grep
- gzip, gunzip
- head
- id
- ifconfig
- ls
- mv
- netstat
- nslookup
- printenv
- pwd
- rm,unlink
- tail
- tar
- xxd
- whoami



## cat

concatenate and print files

```
usage: cat [-benstuv] [file ...]

Example
------
cat filename      # Print a file
cat file1 file2   # Print files
cat file1 > file2 # Duplicate a file
```

## cd

Change Directory

```
cd subfolder
cd /etc
cd ../
```

## chmod

Change Mode, Set permission of the file.
There are 3 digits which are user, group, others

Read more at [Wikipedia](https://en.wikipedia.org/wiki/Chmod)

```
Example
------
chmod 600 file # User read-write, Group STFU!, others STFU!
chmod 640 file # User read-write, Group read-only, others STFU!
chmod 644 file # User read-write, Group read-only, others read-only
chmod 755 file # User read-write-execute, Group read-execute, others read-execute

# A very dangerous mode, Try not to do this on production system.
chmod 777 file # All read-write-excute
```

## chown

Change Owner

```
Usage:
-------
chown user:group file
chown -R user:group directory

Example
-------
chown noob:standarduser file
chown -R john:admin directory

```

## cp
Copy a file
```
usage: cp [-R [-H | -L | -P]] [-fi | -n] [-apvXc] source_file target_file
       cp [-R [-H | -L | -P]] [-fi | -n] [-apvXc] source_file ... target_directory


Example
-------
cp source_file target_file
cp -rf source_file target_file
cp source_file target_directory
cp -rf source_directory target_directory
and much more...
```

## df

display free disk space

```
usage: df [-b | -H | -h | -k | -m | -g | -P] [-ailn] [-T type] [-t] [filesystem ...]

Example
------
df
df -h
```

## echo

Write arguments to the standard output
```
Example
-------
echo "Hello World" ## Hello, World
echo *     	  	# List all files in directory
echo .*    	  	# List all hidden files in directory
echo ../*  	  	# List all files in parent directory
echo ../.*        	# Lust all hidden files in parent directory
echo $(<filename)	# Print a file
echo "hello world" > hello_world.txt  # Create a new file from a string
echo $VARIABLE		# Print a shell variable
echo $USER
```

## grep

Global Regular Expression Print
```
Example
-------
cat index.html | grep body
ls /etc | grep pass
and much more...
```

## gzip, gunzip

compression/decompression tool using Lempel-Ziv coding (LZ77)
```
Usage
------
head [-n count | -c bytes] [file ...]

Example
-------
head file
head -n 20 file 	# Display 20 first lines of a specified file
head -n 20 file1 file2 	# Display 20 first lines of specified files
head -c 16 file 	# Display 16 first bytes of specified files
```

## head

display first lines of a file
```
Usage
     gzip [-cdfhkLlNnqrtVv] [-S suffix] file [file [...]]
     gunzip [-cfhkLNqrtVv] [-S suffix] file [file [...]]
     zcat [-fhV] file [file [...]]

Example
------
gzip hello.txt
gzip archive.tar
gunzip hello.txt.gz
gunzip archive.tar.gz
zcat hello.txt.gz
```

## id

User identity
```
Usage
------
     id
     id [user]
     id -A
     id -F [user]
     id -G [-n] [user]
     id -M
     id -P [user]
     id -g [-nr] [user]
     id -p [user]
     id -u [-nr] [user]
```

## ifconfig

configure network interface parameters

```
Usage
------
ifconfig
ifconfig [-L] [-m] [-r] interface [create] [address_family] [address [dest_address]] [parameters]
ifconfig interface destroy
ifconfig -a [-L] [-d] [-m] [-r] [-u] [-v] [address_family]
ifconfig -l [-d] [-u] [address_family]
ifconfig [-L] [-d] [-m] [-r] [-u] [-v] [-C]
ifconfig interface vlan vlan-tag vlandev iface
ifconfig interface -vlandev iface
ifconfig interface bonddev iface
ifconfig interface -bonddev iface
ifconfig interface bondmode lacp | static

Example
------
ifconfig
ifconfig -a
```

## ls

List files in a directory
```
Usage: 
ls [-@ABCFGHLOPRSTUWabcdefghiklmnopqrstuwx1%] [file ...]


Example
-------
ls      # List all files
ls -a   # List all files include hidden files
ls -l   # List files with properties
ls -lh  # List all files and display file size in Bytes, KB, MB, GB, TB, PB


You can also do something like this
-------
ls -lah
ls /etc
ls -lah /etc
ls -a /etc
and much more...
```

## mv

Move a file
```
usage: mv [-f | -i | -n] [-v] source target
       mv [-f | -i | -n] [-v] source ... directory


Example
-------
mv file1 file2                    # Rename a file
mv /root/index.html /var/www/html # Move a file in to another directory
```

## netstat

Show network status
Read more at [Linux Man Page](https://linux.die.net/man/8/netstat)
```
Example
-------
# Show TCP
# Show UDP
# Show listening socket
# Show numeric port numbers
# Show programs
netstat -tulnp
```

## nslookup

query Internet name servers interactively
```
Example
-------
nslookup 8.8.8.8
nslookup google.com
nslookup 127.0.1.1
```

## printenv

print out the environment
```
usage: 
printenv
printenv [name]

Example
-------
printenv
printenv HOME
printenv FLAG
```

## pwd

Print Working Directory
```
usage: pwd

Example
-------
pwd
```

## rm, unlink

Remove or Delete a file

```
usage: rm [-f | -i] [-dPRrvW] file ...
       unlink file

Example
-------
rm file
rm -f file
rm -r directory
rm -rf directory

!!! DON'T DO THIS AT HOME !!!
rm -rf /* --preserve-root 
```

## tail

display the last part of a file

```
usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]

Example
-------
tail file
tail -n 20 file # Print 20 last lines
tail -f file # Watch file and print last lines
```

## tar

manipulate tape archives

```
SYNOPSIS
     tar [bundled-flags <args>] [<file> | <pattern> ...]
     tar {-c} [options] [files | directories]
     tar {-r | -u} -f archive-file [options] [files | directories]
     tar {-t | -x} [options] [patterns]

DESCRIPTION
     tar creates and manipulates streaming archive files.  This implementation can extract from tar, pax, cpio, zip, jar, ar, xar, rpm, 7-zip, and ISO 9660 cdrom images and can create
     tar, pax, cpio, ar, zip, 7-zip, and shar archives.

     The first synopsis form shows a ``bundled'' option word.  This usage is provided for compatibility with historical implementations.  See COMPATIBILITY below for details.

     The other synopsis forms show the preferred usage.  The first option to tar is a mode indicator from the following list:
     -c      Create a new archive containing the specified items.  The long option form is --create.
     -r      Like -c, but new entries are appended to the archive.  Note that this only works on uncompressed archives stored in regular files.  The -f option is required.  The long
             option form is --append.
     -t      List archive contents to stdout.  The long option form is --list.
     -u      Like -r, but new entries are added only if they have a modification date newer than the corresponding entry in the archive.  Note that this only works on uncompressed ar-
             chives stored in regular files.  The -f option is required.  The long form is --update.
     -x      Extract to disk from the archive.  If a file with the same name appears more than once in the archive, each copy will be extracted, with later copies overwriting (replac-
             ing) earlier copies.  The long option form is --extract.

     In -c, -r, or -u mode, each specified file or directory is added to the archive in the order specified on the command line.  By default, the contents of each directory are also
     archived.

     In extract or list mode, the entire command line is read and parsed before the archive is opened.  The pathnames or patterns on the command line indicate which items in the ar-
     chive should be processed.  Patterns are shell-style globbing patterns as documented in tcsh(1).

Example
------
tar -cf archive.tar file1 file2 directory something*
tar -czf archive.tar.gz file1 file2 directory something*
tar -cvzf archive.tar.gz file ...
```

## xxd

make a hexdump or do the reverse.

Read more at [Linux man page](https://linux.die.net/man/1/xxd)

```
Example
------
xxd file
xxd -r file
xxd -b file
```

## whoami

display effective user id

```
Example
------
whoami
```