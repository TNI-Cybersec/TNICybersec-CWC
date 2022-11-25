package cwc2020.core.services;

import cwc2020.core.points.Item;

import java.util.List;

public class ItemService {

    private final List<Item> items;

    ItemService(List<Item> items) {
        this.items = items;
    }

    public Item find(String name) {
        return items
            .stream()
            .filter(item -> item.getName().equals(name))
            .findFirst()
            .orElse(new Item("Sacred Item", 0));
    }

}
