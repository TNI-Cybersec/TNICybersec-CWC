package cwc2020.scenarios;

import capturesim.interfaces.Game;
import capturesim.interfaces.Simulator;
import cwc2020.core.games.CyberWarfareContest2020Game;
import cwc2020.core.players.Team;
import cwc2020.core.services.GameService;
import cwc2020.core.simulators.CyberWarfareContest2020Simulator;
import cwc2020.core.transactions.HillCaptured;

import java.util.ArrayList;

public class SingleHillCapturedPerTeamMaximumScoreScenario {

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
                add(new HillCaptured(gameService.hills().find("The Fools"), team, 10));
            });
            gameService.teams().find("MAIDEN").ifPresent(team -> {
                add(new HillCaptured(gameService.hills().find("GGEZ Hosting"), team, 10));
            });
            gameService.teams().find("Newbie").ifPresent(team -> {
                add(new HillCaptured(gameService.hills().find("MineKrub"), team, 15));
            });
        }});

        Simulator simulator = new CyberWarfareContest2020Simulator(game, 240);
        simulator.simulate();
    }

}
