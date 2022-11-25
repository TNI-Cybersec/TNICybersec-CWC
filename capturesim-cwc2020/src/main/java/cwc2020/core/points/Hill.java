package cwc2020.core.points;

import capturesim.interfaces.Player;
import capturesim.interfaces.Point;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
public class Hill implements Point {

    private final double FIRST_BLOOD_FACTOR = 0.2;

    private String name;

    private int interval;
    private int firstTriggered;

    private int increasingPoints;
    private int uniqueCapturePoints;
    private int uniqueCaptureIncreasingPoints;
    private int holdStreakIncreasingPoints;

    @Getter(AccessLevel.PRIVATE)
    private int firstBloodPoints;
    private Player firstBloodClaimer;

    private Player currentHolder;
    private Player nextHolder;
    private List<Player> uniqueCaptures;

    private int holdStreak;
    private int holdStreakComeBackStart;

    public Hill(String name, int interval, int firstTriggered, int increasingPoints,
                int firstBloodPoints, int uniqueCapturePoints, int uniqueCaptureIncreasingPoints,
                int holdStreakIncreasingPoints, int holdStreakComeBackStart) {
        setName(name);
        setInterval(interval);
        setFirstTriggered(firstTriggered);
        setIncreasingPoints(increasingPoints);
        setFirstBloodPoints(firstBloodPoints);
        setUniqueCapturePoints(uniqueCapturePoints);
        setUniqueCaptureIncreasingPoints(uniqueCaptureIncreasingPoints);
        setHoldStreakIncreasingPoints(holdStreakIncreasingPoints);
        setHoldStreakComeBackStart(holdStreakComeBackStart);
        setCurrentHolder(null);
        setFirstBloodClaimer(null);
        setUniqueCaptures(new ArrayList<>());
        setHoldStreak(0);
    }

    public Optional<Player> getCurrentHolder() {
        return Optional.ofNullable(currentHolder);
    }

    public Optional<Player> getNextHolder() {
        return Optional.ofNullable(nextHolder);
    }

    public Optional<Player> getFirstBloodClaimer() {
        return Optional.ofNullable(firstBloodClaimer);
    }

    public boolean isComeBackBonusAvailable() {
        return getHoldStreak() >= getHoldStreakComeBackStart();
    }

    public void increaseHoldStreak() {
        holdStreak++;
    }

    public void increaseUniqueCapturePoints() {
        uniqueCapturePoints += uniqueCaptureIncreasingPoints;
    }

    public int getPoints(int clock) {
        return increasingPoints * (clock / interval);
    }

    public int getCalculatedFirstBloodPoints(int clockTick, int currentTime) {
        if(clockTick < currentTime) {
            firstBloodPoints += getPoints(clockTick);
            clockTick += interval;
            return getCalculatedFirstBloodPoints(clockTick, currentTime);
        }
        return Double.valueOf(firstBloodPoints * FIRST_BLOOD_FACTOR).intValue();
    }

    public int getHoldStreakPoints() {
        return holdStreak * holdStreakIncreasingPoints;
    }

    @Override
    public int getPoints() {
        return 0;
    }

}
