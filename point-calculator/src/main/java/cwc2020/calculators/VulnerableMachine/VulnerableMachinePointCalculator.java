package cwc2020.calculators.VulnerableMachine;

import java.io.FileNotFoundException;
import java.io.IOException;

public class VulnerableMachinePointCalculator {

    private int minutes;
    private VulnerableMachine vm;
    private String team;

    private VulnerableMachinePointCalculator(int minutes, VulnerableMachine vm, String team) {
        this.minutes = minutes;
        this.vm = vm;
        this.team = team;
    }

    public static void main(String[] args) throws IOException {
        VulnerableMachinePointCalculator vulnerableMachinePointCalculator = new VulnerableMachinePointCalculator(Integer.parseInt(args[0]), getVulnerableMachine(args[1]), args[2]);
        vulnerableMachinePointCalculator.calculate();
    }

    private void calculate() throws IOException {
        int intervalPoints = getIntervalPoints();
        int firstBloodBonus = getFirstBloodBonus();
        int uniqueCaptureBonus = getUniqueCaptureBonus();
        int holdStreakBonus = getHoldStreakBonus();

        vm.setCurrentHolder(team);
        vm.writeCurrentHolder();

        // FOR DEBUGGING PURPOSE ONLY
        // System.out.println(intervalPoints);
        // System.out.println(firstBloodBonus);
        // System.out.println(uniqueCaptureBonus);
        // System.out.println(holdStreakBonus);

        // Publish Result on STDOUT
        System.out.println(intervalPoints + firstBloodBonus + uniqueCaptureBonus + holdStreakBonus);
    }

    private int getIntervalPoints() throws FileNotFoundException {
        return a(minutes / vm.getInterval());
    }

    private int a(int n) {
        if(n == 1) {
            return vm.getIncreasingPoints();
        }
        return a(1) + (n - 1) * vm.getIncreasingPoints();
    }

    private int getFirstBloodBonus() throws IOException {
        if(vm.getUniqueCaptures().isEmpty()) {
            final double FIRST_BLOOD_FACTOR = 0.2;
            for(int i = vm.getFirstInterval(); i < minutes; i += vm.getInterval()) {
                vm.setFirstBloodBonus(vm.getFirstBloodBonus() + a(i / vm.getInterval()));
            }
            vm.getUniqueCaptures().push(team);
            vm.writeUniqueCaptures();
            return Double.valueOf(vm.getFirstBloodBonus() * FIRST_BLOOD_FACTOR).intValue();
        }
        return 0;
    }

    private int getUniqueCaptureBonus() throws IOException {
        int bonus = 0;
        if(vm.getUniqueCaptures().stream().filter(uniqueCapture -> team.equals(uniqueCapture)).findFirst().isEmpty()) {
            bonus = vm.getUniqueCaptureBonus();
            vm.setUniqueCaptureBonus(vm.getUniqueCaptureBonus() + vm.getUniqueCaptureIncreasingBonus());
            vm.getUniqueCaptures().push(team);
            vm.writeUniqueCaptures();
        }
        return bonus;
    }

    private int getHoldStreakBonus() throws FileNotFoundException {
        int bonus = 0;
        if(team.equals(vm.getCurrentHolder())) {
            vm.setHoldStreakCount(vm.getHoldStreakCount() + 1);
        }
        else {
            if(vm.getHoldStreakCount() >= vm.getHoldStreakComeBackTrigger()) {
                bonus = vm.getHoldStreakCount() * vm.getHoldStreakIncreasingBonus();
            }
            vm.setHoldStreakCount(0);
        }
        vm.writeHoldStreakCount();
        return bonus;
    }

    private static VulnerableMachine getVulnerableMachine(String name) {
        switch (name) {
            case "The Fools":
                return new VulnerableMachine(name, 10, 10, 10, 500, 150, 10, 10, 3);
            case "GGEZ Hosting":
                return new VulnerableMachine(name, 10, 10, 8, 300, 100, 10, 10, 3);
            case "MineKrub":
                return new VulnerableMachine(name, 15, 15, 10, 200, 50, 10, 10, 3);
            default:
                return null;
        }
    }

}
