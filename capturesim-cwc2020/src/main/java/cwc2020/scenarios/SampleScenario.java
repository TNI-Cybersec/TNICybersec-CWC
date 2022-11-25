package cwc2020.scenarios;

import capturesim.interfaces.Game;
import capturesim.interfaces.Simulator;
import cwc2020.core.games.CyberWarfareContest2020Game;
import cwc2020.core.players.Team;
import cwc2020.core.services.GameService;
import cwc2020.core.simulators.CyberWarfareContest2020Simulator;
import cwc2020.core.transactions.FlagCaptured;
import cwc2020.core.transactions.HillCaptured;
import cwc2020.core.transactions.ItemPurchased;

import java.util.ArrayList;

public class SampleScenario {

    public static void main(String[] args) {
        Game game = new CyberWarfareContest2020Game();
        GameService gameService = new GameService(game);

        game.getPlayers().addAll(new ArrayList<>() {{
            add(new Team("S!gnature"));
            add(new Team("MAIDEN"));
            add(new Team("Newbie"));
        }});

        game.getTransactions().addAll(new ArrayList<>() {{
            gameService.teams().find("S!gnature").ifPresent(team -> {
                add(new HillCaptured(gameService.hills().find("The Fools"), team, 150));
                add(new FlagCaptured(gameService.flags().find("Web for Dummies Lv. 4"), team, 150));
                add(new ItemPurchased(gameService.items().find("Powerful Hint"), team, 60));
            });
            gameService.teams().find("MAIDEN").ifPresent(team -> {
                add(new HillCaptured(gameService.hills().find("GGEZ Hosting"), team, 120));
                add(new FlagCaptured(gameService.flags().find("Web for Dummies Lv. 4"), team, 180));
            });
            gameService.teams().find("Newbie").ifPresent(team -> {
                add(new HillCaptured(gameService.hills().find("MineKrub"), team, 60));
            });
        }});

        Simulator simulator = new CyberWarfareContest2020Simulator(game, 240);
        simulator.simulate();
    }

}
