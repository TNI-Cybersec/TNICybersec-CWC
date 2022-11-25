# flag.json (Hard)

โจทย์ให้ json มาไฟล์นึง ซึ่งต้องเขียนโปรแกรมดึงข้อมูลออกมา

flag.json
```
{
  "name": "Pseudo Code as a JSON",
  "description": "Need to write a program to convert this JSON into Flag",
  "const": {
    "RANGE": {
      "FIRST": 3, 
      "LAST": 10
    },
    "FLAG_PREFIX": "tni-cwc-",
    "FLAG_STRING": "a flying fairy is so beautiful on the sky."
  },
  "methods": {
    "main": {
      "process": ["iteration", "seds", "style"]
    },
    "fibonacci": {
      "input": "n",
      "output": "A FIBONACCI NUMBER AT n";
    },
  },
  "iteration": {
    "input": "n in range(RANGE.FIRST, RANGE.LAST)",
    "process": "flagString.append(FLAG_STRING.charAt(fibonacci(n)))"
    "output": "flagString.toString()" 
  },
  "seds": [
    {
      "search": "i",
      "replace": "1"
    },
    {
      "search": "t",
      "replace": "7"
    }
  ],
  "style": {
    "text-transform": "Capitalize"
  },
  "refs": [
    "https://en.wikipedia.org/wiki/Fibonacci_number",
    "https://www.mathsisfun.com/numbers/fibonacci-sequence.html",
    "https://www.ics.uci.edu/~eppstein/161/960109.html"
  ]
}
```

เขียนโปรแกรมเพื่อดึง flag
```
public class FlyingFairy{

    public static void main(String []args){
        // Variables Declaration
        String text = "A flying fairy is so beautiful on the sky";
        String prefix = "tni-cwc-";
        int first = 3, last = 10;
        String flag = "";
        
        // Iteration
        for(int n = first; n < last; n++) {
            flag += Character.toString(text.charAt(fibonacci(n)));
        }
        
        // Replace
        flag = flag.replace("i", "1").replace("t", "7");
        
        // Capitalize
        flag = capitalize(flag);
        
        // Display Output
        System.out.println(prefix + flag);
    }
     
    private static int fibonacci(int n) {
        if(n > 2) return fibonacci(n-2) + fibonacci(n-1);
    	else if(n > 0) return 1; 
    	else return 0;
    }
     
    private static String capitalize(String str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
```

## Answer
```
tni-cwc-Fl1 yb7
```