package cwc2020.core.transactions;

import capturesim.interfaces.Player;
import capturesim.interfaces.Transaction;
import cwc2020.core.points.Item;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ItemPurchased implements Transaction {

    private Item item;
    private Player player;
    private int timestamp;

    @Override
    public Player getPlayer() {
        return player;
    }

    @Override
    public int process() {
        return item.getPoints();
    }

    @Override
    public int getTimestamp() {
        return timestamp;
    }

}
