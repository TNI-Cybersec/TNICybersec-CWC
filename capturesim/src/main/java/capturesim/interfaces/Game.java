package capturesim.interfaces;

import java.util.List;

public interface Game {

    List<Player> getPlayers();
    List<Point> getPoints();
    List<Transaction> getTransactions();

}
