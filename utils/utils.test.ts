import { generateMatches, generatePossibleMatches } from './utils';
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

test('we get sufficient matches from the generated set.', () => {
    const { users, previousMatches } = setupThreeUsers();
    const matches: Record<string, string>[] = generatePossibleMatches(users, previousMatches, false);
    expect(matches.length).toBe(3);
    expect(matches).toContainEqual({ 1: "a", 2: "b" });
    expect(matches).toContainEqual({ 1: "a", 2: "c" });
    expect(matches).toContainEqual({ 1: "b", 2: "c" });
});

test('we exclude previous matches from the generated set', () => {
    const { users, previousMatches } = setupThreeUsers();
    previousMatches["a"].push('b');
    const matches: Record<string, string>[] = generatePossibleMatches(users, previousMatches, false);
    expect(matches.length).toBe(2);
    expect(matches).toContainEqual({ 1: "a", 2: "c" });
    expect(matches).toContainEqual({ 1: "b", 2: "c" });
});

test('We exclude matches by partitioning', () => {
    const { users, previousMatches } = setupThreeUsers();
    const matches: Record<string, string>[] = generatePossibleMatches(users, previousMatches, true);
    expect(matches.length).toBe(2);
    expect(matches).not.toContainEqual({ 1: "a", 2: "c" });
});


