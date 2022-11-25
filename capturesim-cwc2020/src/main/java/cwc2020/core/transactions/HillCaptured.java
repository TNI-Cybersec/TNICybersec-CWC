package cwc2020.core.transactions;

import capturesim.interfaces.Player;
import capturesim.interfaces.Transaction;
import cwc2020.core.points.Hill;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.stream.Collectors;

@Data
public class HillCaptured implements Transaction {

    private Hill hill;
    private Player player;
    private int timestamp;

    @Setter(AccessLevel.PRIVATE)
    @Getter(AccessLevel.PRIVATE)
    private int points;

    public HillCaptured(Hill hill, Player player, int timestamp) {
        setHill(hill);
        setPlayer(player);
        setTimestamp(timestamp);
    }

    private void addBonusPoints(int points) {
        this.points += points;
    }

    @Override
    public int process() {
        getHill().setNextHolder(player);
        return getHill().getPoints();
    }

    public static int getPoints(Hill hill, Player player, int clock) {
        HillCaptured hillCaptured = new HillCaptured(hill, player, clock);
        if(clock > hill.getFirstTriggered()) {
            // Get Points
            hillCaptured.setPoints(hill.getPoints(clock));
            System.out.println("At " + hill.getName() + ", Team " + player.getName()
                + " has been owning the hill, Gain " + hill.getPoints(clock) + " interval points");

            // When the hill is captured by another team who is not the current holder.
            hill.getNextHolder().ifPresent(nextHolder -> {
                // Bonus if a streak ends
                if(hill.isComeBackBonusAvailable() && hill.getCurrentHolder().isPresent()) {
                    hillCaptured.addBonusPoints(hill.getHoldStreakPoints());
                    System.out.println("At " + hill.getName() + ", Team " + nextHolder.getName() + " ends Team "
                        + hill.getCurrentHolder().get().getName() + "'s streak of " + hill.getHoldStreak() + ", Gain "
                        + hill.getHoldStreakPoints() + " bonus points");
                }
                hill.setHoldStreak(0);
                hill.setCurrentHolder(nextHolder);
                hill.setNextHolder(null);
            });

            // Detect Activation of the Hills
            hill.getCurrentHolder().ifPresent(holder -> {
                // Detect First Blood or Unique Capture
                hill.getFirstBloodClaimer().ifPresentOrElse(firstBloodClaimer -> {
                    // Unique Captures
                    if (holder != firstBloodClaimer &&
                        hill.getUniqueCaptures()
                            .stream()
                            .filter(team -> team == holder)
                            .collect(Collectors.toList()).isEmpty()) {
                        hillCaptured.addBonusPoints(hill.getUniqueCapturePoints());
                        System.out.println("At " + hill.getName() + ", Team " + holder.getName()
                            + " makes a unique captured, Gain " + hill.getUniqueCapturePoints() + " bonus points");
                        hill.increaseUniqueCapturePoints();
                        hill.getUniqueCaptures().add(holder);
                    }
                }, () -> {
                    // First Blood
                    int firstBlood = hill.getCalculatedFirstBloodPoints(hill.getFirstTriggered(), clock);
                    System.out.println("At " + hill.getName() + ", Team " + holder.getName()
                        + " claims FIRST BLOOD, Gain " + firstBlood + " bonus points");
                    hillCaptured.addBonusPoints(firstBlood);
                    hill.setFirstBloodClaimer(holder);
                });
            });

            hill.increaseHoldStreak();
            return hillCaptured.getPoints();
        }
        return 0;
    }

}
