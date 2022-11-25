package cwc2020.core.transactions;

import capturesim.interfaces.Player;
import capturesim.interfaces.Transaction;
import cwc2020.core.points.Flag;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FlagCaptured implements Transaction {

    private Flag flag;
    private Player player;
    private int timestamp;

    @Override
    public int process() {
        if(flag.getFirstBloodClaimer().isEmpty()) {
            flag.setFirstBloodClaimer(player);
            return flag.getPoints() + flag.getFirstBloodPoints();
        }
        return flag.getPoints();
    }

}
