package cwc2020.core.games;

import capturesim.interfaces.Game;
import capturesim.interfaces.Player;
import capturesim.interfaces.Point;
import capturesim.interfaces.Transaction;
import cwc2020.core.points.Flag;
import cwc2020.core.points.Hill;
import cwc2020.core.points.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CyberWarfareContest2020Game implements Game {

    private String name;

    private List<Player> players = new ArrayList<>();

    private List<Point> points = new ArrayList<>() {{
        // Hills
        add(new Hill("The Fools", 10, 10, 15, 500, 150, 10, 10, 3));
        add(new Hill("GGEZ Hosting", 10, 10, 10, 350, 100, 10, 10, 3));
        add(new Hill("MineKrub", 15, 15, 10, 250,  50, 10, 10, 3));

        // Flags
        add(new Flag("Linux for Dummies Lv. 1", 280, 0));
        add(new Flag("Linux for Dummies Lv. 2", 194, 0));
        add(new Flag("Linux for Dummies Lv. 3", 112));

        add(new Flag("Web for Dummies Lv. 1", 60, 0));
        add(new Flag("Web for Dummies Lv. 2", 160, 0));
        add(new Flag("Web for Dummies Lv. 3", 160, 0));
        add(new Flag("Web for Dummies Lv. 4", 200));

        add(new Flag("Network for Dummies Lv. 1", 70, 0));
        add(new Flag("Network for Dummies Lv. 2", 210, 0));
        add(new Flag("Network for Dummies Lv. 3", 150));

        add(new Flag("Misc.", 170));

        // Items - Linux for Dummies
        add(new Item("[Docs] How to use SSH to remote to Linux servers, Including keypairs authentication", 0));
        add(new Item("[Docs] Basic Linux Commands", 0));
        add(new Item("[Docs] Basic Network File Sharing & How to mount NFS shares", 0));
        add(new Item("[Docs] NetCat", 0));
        add(new Item("[Docs] ElasticSearch & Basic Queries", 0));
        add(new Item("[Docs] MongoDB & How to access", 0));

        // Items - Web for Dummies
        add(new Item("[Docs] Basic HTML Tags", 0));
        add(new Item("[Docs] JavaScript Hello World", 0));
        add(new Item("[Docs] Web Server Basic (Apache, Nginx, VirtualHosts, DirectoryIndex, Index Files)", 0));
        add(new Item("[Docs] Directory Scan using DirBuster", 0));
        add(new Item("[Docs] Directory Scan using Python (or JavaScript)", 0));
        add(new Item("[Docs] Logic Gates", 0));
        add(new Item("[Docs] Basic Filter Escape", 0));
        add(new Item("[Docs] WebShells", 0));
        add(new Item("[Docs] How to inject Malwares or Malicious scripts and bypass some stupid filters", -100));

        // Items - Network for Dummies
        add(new Item("[Docs] Reading PCAP files using Wireshark", 0));
        add(new Item("[Docs] HTTP Protocol Basic & Making HTTP requests using Python", 0));
        add(new Item("[Docs] ICMP", 0));
        add(new Item("[Docs] DNS", 0));
        add(new Item("[Docs] FTP", 0));
        add(new Item("[Docs] SMTP", 0));
        add(new Item("[Docs] TCP", 0));
        add(new Item("[Docs] UDP", 0));
        add(new Item("[Docs] Encoding (Base64, ASCII, UTF-8) & Cryptology (Caesar, 3DES, AES, RSA, ECDSA, etc.)", 0));

        // Items - Misc.
        add(new Item("[Docs] Exif", 0));
        add(new Item("[Docs] How to Hide Data in JPG file", 0));
        add(new Item("[Docs] Metadata in audio files", 0));
        add(new Item("[Docs] QR Code", 0));
        add(new Item("[Docs] Old days basic text hidden in a document", 0));

        // Items - King of the Hills - The Fools
        add(new Item("[Docs] Basic SQL Commands", 0));
        add(new Item("[Docs] SQL Injection Techniques", 0));
        add(new Item("[Docs] Cross-site Scripting (XSS)", -100));
        add(new Item("[Docs] Scheduling processes using Cron", 0));
        add(new Item("[Docs] Capturing Packet using Wireshark", 0));

        // Items - King of the Hills - GGEZ Hosting
        add(new Item("[Hint] Well-Known Web Server Vulnerabilities", 0));
        add(new Item("[Docs] Regular Expression (RegEx)", 0));

        // Items - King of the Hills - MineKrub
        add(new Item("[Hint] Well-Known Windows Vulnerabilities", 0));
        add(new Item("[Docs] Basic Windows Command", 0));

        add(new Item("Powerful Hint", -10));
    }};

    private List<Transaction> transactions = new ArrayList<>();

}
