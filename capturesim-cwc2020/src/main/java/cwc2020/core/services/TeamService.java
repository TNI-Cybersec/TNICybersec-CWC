package cwc2020.core.services;

import cwc2020.core.players.Team;

import java.util.List;
import java.util.Optional;

public class TeamService {

    private final List<Team> teams;

    TeamService(List<Team> teams) {
        this.teams = teams;
    }

    public Optional<Team> find(String name) {
        return teams
            .stream()
            .filter(team -> team.getName().equals(name))
            .findFirst();
    }

}
