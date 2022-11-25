package capturesim.interfaces;

public interface Transaction {

    Player getPlayer();
    int process();
    int getTimestamp();

}
