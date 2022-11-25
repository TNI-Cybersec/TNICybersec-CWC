package cwc2020.core.services;

import cwc2020.core.points.Flag;

import java.util.List;

public class FlagService {

    private final List<Flag> flags;

    FlagService(List<Flag> flags) {
        this.flags = flags;
    }

    public List<Flag> all() {
        return flags;
    }

    public Flag find(String name) {
        return flags
            .stream()
            .filter(flag -> flag.getName().equals(name))
            .findFirst()
            .orElse(new Flag("Empty Flag", 0));
    }

}
