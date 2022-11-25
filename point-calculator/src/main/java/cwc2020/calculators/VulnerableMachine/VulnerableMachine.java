package cwc2020.calculators.VulnerableMachine;

import cwc2020.calculators.Config;
import lombok.Data;

import java.io.*;
import java.util.LinkedList;
import java.util.Scanner;

@Data
public class VulnerableMachine {

    // Properties
    private String name;

    // Config
    private int interval;
    private int firstInterval;
    private int increasingPoints;
    private int firstBloodBonus;
    private int uniqueCaptureBonus;
    private int uniqueCaptureIncreasingBonus;
    private int holdStreakIncreasingBonus;
    private int holdStreakComeBackTrigger;

    // State
    private String currentHolder;
    private int holdStreakCount;
    private LinkedList<String> uniqueCaptures;

    public VulnerableMachine(String name,
                             int interval,
                             int firstInterval,
                             int increasingPoints,
                             int firstBloodInitialBonus,
                             int uniqueCaptureBonus,
                             int uniqueCaptureIncreasingBonus,
                             int holdStreakIncreasingBonus,
                             int holdStreakComeBackTrigger) {

        // Set Config
        setName(name);
        setInterval(interval);
        setFirstInterval(firstInterval);
        setIncreasingPoints(increasingPoints);
        setFirstBloodBonus(firstBloodInitialBonus);
        setUniqueCaptureBonus(uniqueCaptureBonus);
        setUniqueCaptureIncreasingBonus(uniqueCaptureIncreasingBonus);
        setHoldStreakIncreasingBonus(holdStreakIncreasingBonus);
        setHoldStreakComeBackTrigger(holdStreakComeBackTrigger);

        // Init State
        try {
            readCurrentHolder();
            readHoldStreakCount();
            readUniqueCaptures();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    private String getPathName() {
        return getName().replace(" ", "-").toLowerCase() + "/";
    }

    private void readCurrentHolder() throws FileNotFoundException {
        File file = new File(Config.STATE_DIR + getPathName() + "current-holder" + Config.STATE_FILE_EXTENSION);
        Scanner scanner = new Scanner(file);
        if(scanner.hasNextLine())
            setCurrentHolder(scanner.nextLine());
        else
            setCurrentHolder(null);
        scanner.close();
    }

    public void writeCurrentHolder() throws FileNotFoundException {
        File file = new File(Config.STATE_DIR + getPathName() + "current-holder" + Config.STATE_FILE_EXTENSION);
        PrintStream printStream = new PrintStream(file);
        printStream.println(getCurrentHolder());
        printStream.close();
    }

    private void readHoldStreakCount() throws FileNotFoundException {
        File file = new File(Config.STATE_DIR + getPathName() + "hold-streak-count" + Config.STATE_FILE_EXTENSION);
        Scanner scanner = new Scanner(file);
        if(scanner.hasNextLine())
            setHoldStreakCount(Integer.parseInt(scanner.nextLine()));
        else
            setHoldStreakCount(0);
        scanner.close();
    }

    public void writeHoldStreakCount() throws FileNotFoundException {
        File file = new File(Config.STATE_DIR + getPathName() + "hold-streak-count" + Config.STATE_FILE_EXTENSION);
        PrintStream printStream = new PrintStream(file);
        printStream.println(getHoldStreakCount());
        printStream.close();
    }

    private void readUniqueCaptures() throws FileNotFoundException {
        File file = new File(Config.STATE_DIR + getPathName() + "unique-captures" + Config.STATE_FILE_EXTENSION);
        Scanner scanner = new Scanner(file);
        setUniqueCaptures(new LinkedList<>());
        while(scanner.hasNextLine()) {
            getUniqueCaptures().push(scanner.nextLine());
        }
        scanner.close();
    }

    public void writeUniqueCaptures() throws IOException {
        File file = new File(Config.STATE_DIR + getPathName() + "unique-captures" + Config.STATE_FILE_EXTENSION);
        BufferedWriter writer = new BufferedWriter(new FileWriter(file, true));
        writer.append(getUniqueCaptures().peek());
        writer.newLine();
        writer.close();
    }

}
