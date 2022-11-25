package cwc2020.core.points;

import capturesim.interfaces.Player;
import capturesim.interfaces.Point;
import lombok.Data;

import java.util.Optional;

@Data
public class Flag implements Point {

    private String name;
    private int points;
    private int firstBloodPoints;

    private Player firstBloodClaimer;

    public Flag(String name, int points) {
        setName(name);
        setPoints(points);
        setFirstBloodPoints(points / 10);
    }

    public Flag(String name, int points, int firstBloodPoints) {
        setName(name);
        setPoints(points);
        setFirstBloodPoints(firstBloodPoints);
    }

    @Override
    public int getPoints() {
        return points;
    }

    public Optional<Player> getFirstBloodClaimer() {
        return Optional.ofNullable(firstBloodClaimer);
    }

}
