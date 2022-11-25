package cwc2020.scenarios;

import capturesim.interfaces.Game;
import capturesim.interfaces.Simulator;
import cwc2020.core.games.CyberWarfareContest2020Game;
import cwc2020.core.players.Team;
import cwc2020.core.services.GameService;
import cwc2020.core.simulators.CyberWarfareContest2020Simulator;
import cwc2020.core.transactions.HillCaptured;

import java.util.ArrayList;

public class MaximumScoreHillsOnlyScenario {

    public static void main(String[] args) {
        Game game = new CyberWarfareContest2020Game();
        GameService gameService = new GameService(game);

        game.getPlayers().addAll(new ArrayList<>() {{
            add(new Team("S!gnature"));
        }});

        game.getTransactions().addAll(new ArrayList<>() {{
            gameService.teams().find("S!gnature").ifPresent(team -> {
                gameService.hills().all().forEach(hill -> add(new HillCaptured(hill, team, 10)));
            });
        }});

        Simulator simulator = new CyberWarfareContest2020Simulator(game, 240);
        simulator.simulate();
    }

}
