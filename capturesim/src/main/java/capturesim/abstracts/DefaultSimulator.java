package capturesim.abstracts;

import capturesim.interfaces.Simulator;

public abstract class DefaultSimulator implements Simulator {

    @Override
    public void simulate() {
        start();
        processTransactions();
        stop();
    }

    abstract protected void start();
    abstract protected void processTransactions();
    abstract protected void stop();

}
