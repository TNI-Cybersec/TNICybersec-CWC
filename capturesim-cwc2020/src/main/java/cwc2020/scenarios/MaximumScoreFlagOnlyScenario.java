package cwc2020.scenarios;

import capturesim.interfaces.Game;
import capturesim.interfaces.Simulator;
import cwc2020.core.games.CyberWarfareContest2020Game;
import cwc2020.core.players.Team;
import cwc2020.core.services.GameService;
import cwc2020.core.simulators.CyberWarfareContest2020Simulator;
import cwc2020.core.transactions.FlagCaptured;

import java.util.ArrayList;

public class MaximumScoreFlagOnlyScenario {

    public static void main(String[] args) {
        Game game = new CyberWarfareContest2020Game();
        GameService gameService = new GameService(game);

        game.getPlayers().addAll(new ArrayList<>() {{
            add(new Team("S!gnature"));
            add(new Team("MAIDEN"));
        }});

        game.getTransactions().addAll(new ArrayList<>() {{
            gameService.teams().find("S!gnature").ifPresent(team -> {
                gameService.flags().all().forEach(flag -> add(new FlagCaptured(flag, team, 100)));
            });
            gameService.teams().find("MAIDEN").ifPresent(team -> {
                gameService.flags().all().forEach(flag -> add(new FlagCaptured(flag, team, 200)));
            });
        }});

        Simulator simulator = new CyberWarfareContest2020Simulator(game, 240);
        simulator.simulate();
    }

}
