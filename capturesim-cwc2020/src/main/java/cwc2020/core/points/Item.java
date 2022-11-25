package cwc2020.core.points;

import capturesim.interfaces.Point;
import lombok.Data;

@Data
public class Item implements Point {

    private String name;
    private int points;

    public Item(String name, int points) {
        setName(name);
        setPoints(points);
    }

    @Override
    public int getPoints() {
        return 0;
    }

}
