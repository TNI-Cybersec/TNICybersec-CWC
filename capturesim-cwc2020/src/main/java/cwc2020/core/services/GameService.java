package cwc2020.core.services;

import capturesim.interfaces.Game;
import cwc2020.core.players.Team;
import cwc2020.core.points.Flag;
import cwc2020.core.points.Hill;
import cwc2020.core.points.Item;

import java.util.stream.Collectors;

public class GameService {

    private Game game;

    public GameService(Game game) {
        this.game = game;
    }

    public TeamService teams() {
        return new TeamService(game.getPlayers()
            .stream()
            .filter(player -> player instanceof Team)
            .map(player -> (Team) player)
            .collect(Collectors.toList())
        );
    }

    public HillService hills() {
        return new HillService(game.getPoints()
            .stream()
            .filter(score -> score instanceof Hill)
            .map(score -> (Hill) score)
            .collect(Collectors.toList())
        );
    }

    public FlagService flags() {
        return new FlagService(game.getPoints()
            .stream()
            .filter(score -> score instanceof Flag)
            .map(score -> (Flag) score)
            .collect(Collectors.toList())
        );
    }

    public ItemService items() {
        return new ItemService(game.getPoints()
            .stream()
            .filter(score -> score instanceof Item)
            .map(score -> (Item) score)
            .collect(Collectors.toList())
        );
    }

}
