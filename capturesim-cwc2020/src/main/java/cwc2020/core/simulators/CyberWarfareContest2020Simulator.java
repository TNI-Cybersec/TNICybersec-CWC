package cwc2020.core.simulators;

import capturesim.abstracts.TimeBasedSimulator;
import capturesim.interfaces.Game;
import capturesim.interfaces.Transaction;
import cwc2020.core.points.Hill;
import cwc2020.core.transactions.HillCaptured;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@EqualsAndHashCode(callSuper = false)
public class CyberWarfareContest2020Simulator extends TimeBasedSimulator {

    private Game game;

    @Getter(AccessLevel.PRIVATE)
    @Setter(AccessLevel.PRIVATE)
    private List<Hill> hills;

    public CyberWarfareContest2020Simulator(Game game, int duration) {
        super(0, duration, 1);
        setGame(game);
    }

    @Override
    protected void start() {
        setHills(game.getPoints()
            .stream()
            .filter(score -> score instanceof Hill)
            .map(score -> (Hill) score)
            .collect(Collectors.toList())
        );
    }

    @Override
    protected void processTransactions() {
        System.out.println("=======================================");
        System.out.println("Time: " + getTime());
        System.out.println("---------------------------------------");

        // Search Transactions that match clock
        List<Transaction> transactions = game.getTransactions()
            .stream()
            .filter(transaction -> transaction.getTimestamp() == getTime())
            .collect(Collectors.toList());

        // Process Transactions
        transactions.forEach(transaction -> transaction.getPlayer().updateScore(transaction.process()));

        // Process Hills Holding Points
        hills.forEach(hill -> {
            if(getTime() % hill.getInterval() == 0 && getTime() >= hill.getFirstTriggered()) {
                hill.getNextHolder().ifPresentOrElse(
                    player -> player.updateScore(HillCaptured.getPoints(hill, player, getTime())),
                    () -> hill.getCurrentHolder().ifPresent(player -> player.updateScore(HillCaptured.getPoints(hill, player, getTime())))
                );
            }
        });
    }

    @Override
    protected void stop() {
        System.out.println("=======================================");
        System.out.println("Final Results");
        System.out.println("---------------------------------------");
        game.getPlayers().forEach(System.out::println);
    }

}
