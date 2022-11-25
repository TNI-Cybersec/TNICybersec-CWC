package capturesim.abstracts;

import capturesim.interfaces.Simulator;

public abstract class TimeBasedSimulator implements Simulator {

    private int time;
    private int startTime;
    private int duration;
    private int increasingTime;

    protected TimeBasedSimulator(int startTime, int duration, int increasingTime) {
        this.time = 0;
        this.startTime = startTime;
        this.duration = duration;
        this.increasingTime = increasingTime;
    }

    @Override
    public void simulate() {
        start();
        for(time = startTime; time <= duration; time += increasingTime) {
            processTransactions();
        }
        stop();
    }

    abstract protected void start();
    abstract protected void processTransactions();
    abstract protected void stop();

    protected int getTime() {
        return time;
    }

}
