import { countPotentialMatchesPerAttendee, generatePossibleMatches, chooseOptimalMatches } from './utils';
import { expect, jest, test } from '@jest/globals';

const setupThreeUsers = () => {
    const users = [{ id: "a", name: "aa", ticketAs: "Men" }, { id: "b", name: "ba", ticketAs: "Women" }, { id: "c", name: "ca", ticketAs: "Men" }];

    const previousMatches: Record<string, string[]> = {
        a: [],
        b: [],
        c: [],
    };
    return { users, previousMatches };
};

const setupMatchTestData = () => {
    const potentials: Record<string, string>[] = [{ "a": "b" },
    { "b": "c" },
    { "c": "d" },
    { "c": "e" },
    { "d": "e" }];

    const counts = countPotentialMatchesPerAttendee(potentials);
    return { potentials, counts };
}

test('we get sufficient matches from the generated set.', () => {
    const { users, previousMatches } = setupThreeUsers();
    const matches: Record<string, string>[] = generatePossibleMatches(users, previousMatches, false);
    expect(matches.length).toBe(3);
    expect(matches).toContainEqual({ "a": "b" });
    expect(matches).toContainEqual({ "a": "c" });
    expect(matches).toContainEqual({ "b": "c" });
});

test('we exclude previous matches from the generated set', () => {
    const { users, previousMatches } = setupThreeUsers();
    previousMatches["a"].push('b');
    const matches: Record<string, string>[] = generatePossibleMatches(users, previousMatches, false);
    expect(matches.length).toBe(2);
    expect(matches).toContainEqual({ "a": "c" });
    expect(matches).toContainEqual({ "b": "c" });
});

test('We exclude matches by partitioning', () => {
    const { users, previousMatches } = setupThreeUsers();
    const matches: Record<string, string>[] = generatePossibleMatches(users, previousMatches, true);
    expect(matches.length).toBe(2);
    expect(matches).not.toContainEqual({ "a": "c" });
});


test('We could count the correct number of potential matches per user without overcounting', () => {
    const { users, previousMatches } = setupThreeUsers();
    const matches = generatePossibleMatches(users, previousMatches, true);
    const counts = countPotentialMatchesPerAttendee(matches);
    expect(Object.keys(counts).length).toBe(3);
    expect(counts["a"]).toBe(1);
    expect(counts["b"]).toBe(2);
    expect(counts["c"]).toBe(1);

});

test('Make sure the lowest match users get paired together', () => {

    const { potentials, counts } = setupMatchTestData();
    expect(counts["a"]).toBe(1);
    expect(counts["b"]).toBe(2);


    const result = chooseOptimalMatches(potentials, counts, []);
    expect(result.matches.length).toBe(2);
    const aMatch = result.matches.filter(m => Object.keys(m).includes("a"));
    expect(aMatch.length).toBe(1);
    expect(aMatch[0]["a"]).toBe("b");
});

test('Make sure to prioritized folks skipped in previous rounds', () => {
    const { potentials, counts } = setupMatchTestData();

    const result = chooseOptimalMatches(potentials, counts, ["c"]);
    expect(result.matches.length).toBe(2);
    const cMatch = result.matches.filter(m => m['c'] || Object.values(m).includes("c"));
    expect(cMatch.length).toBe(1);
});
