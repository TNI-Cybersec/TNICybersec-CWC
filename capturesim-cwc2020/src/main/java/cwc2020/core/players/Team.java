package cwc2020.core.players;

import capturesim.interfaces.Player;
import lombok.Data;

@Data
public class Team implements Player {

    private String name;
    private int score;

    public Team(String name) {
        setName(name);
        setScore(0);
    }

    @Override
    public void updateScore(int points) {
        score += points;
        if(points > 0) {
            System.out.println("Team " + getName() + " earned " + points + " points, Now having " + score + " total points");
        }
    }

}
