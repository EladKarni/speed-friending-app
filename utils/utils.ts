import { read } from "fs";
import { redirect } from "next/navigation";
import { Json } from "./supabase/schema";
import { table } from "console";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
    type: "error" | "success",
    path: string,
    message: string
) {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

// *************

// separate the array into two by ticket type (or maybe just filter readyAttendees twice?). idk, something like...

// maleAttendees
// femaleAttendees

// "Basic" algorithm: one group stays seated, the other group moves down. Doesn't work here because people might bow out between rounds, for one thing. So not that.

// This falls under the combinatorics bucket of an "assignment problem". Basically, we want to associate every possible pair with a "cost". This can default to 0, and be 1 iff the pair has already met (so we don't rematch).
// If we make an M-by-F matrix, where each row corresponds to a maleAttendee and each column a femaleAttendee, we can process it based on something called the "Hungarian algorithm"
// https://en.wikipedia.org/wiki/Hungarian_algorithm#Matrix_interpretation
// To keep this from being deterministic, we can randomly order both sets of attendees before making the matrix and doing the algorithm.

// Steps:
// - 0. Make the matrix square by adding either rows or columns of 0s ("ghost dates" of the less common gender)
// - 1. Subtract the smallest element of each row from every element of that row.
// - 2. Subtract the smallest element of each column from every element of that column.
// - 3. Check for an optimal assignment,,, (there's more)

// *********

const MAX_ITERATIONS = 100;

const getRandom = <T = unknown>(list: T[]) =>
    list[Math.floor(Math.random() * list.length)];

const getMatch = (
    attendeeId: string,
    pastMatches: Record<string, string[]>,
    potentialMatchIds: string[]
) => {
    const blacklist = [attendeeId, ...(pastMatches[attendeeId] || [])];

    let iterations = 0;
    let match = null;

    while (!match && iterations < MAX_ITERATIONS) {
        const randomAttendee = getRandom(potentialMatchIds);
        if (!blacklist.includes(randomAttendee)) match = randomAttendee;
        iterations++;
    }
    return match;
};

export const generatePossibleMatches = (readyAttendeesList: {
    id: string;
    name: string;
    ticketAs: string | "Women" | "Men";
}[], previousMatches: Record<string, string[]>, paritionByTicket: boolean) => {

    const sorted = readyAttendeesList.toSorted((a, b) => a.id == b.id ? 0 : a.id < b.id ? -1 : 1);
    const potentialMatches = []
    for (let i = 0; i < sorted.length; i++) {
        const attendee = sorted[i];
        const alreadyMatched = previousMatches[attendee.id];
        for (let j = i + 1; j < sorted.length; j++) {
            const potentialMatch = sorted[j];
            if (!alreadyMatched.includes(potentialMatch.id)) {
                if (!paritionByTicket || attendee.ticketAs !== potentialMatch.ticketAs) {
                    potentialMatches.push({ 1: attendee.id, 2: potentialMatch.id });
                }
            }
        }
    }
    return potentialMatches;
}

export const countPotentialMatchesPerAtendee = (matches: Record<string, string>[]) => {
    const counts: Record<string, number> = {};
    // initialize
    matches.forEach(match => {
        counts[match[1]] = match[1] in counts ? counts[match[1]] + 1 : 1;
        counts[match[2]] = match[2] in counts ? counts[match[2]] + 1 : 1;
    });
    return counts;
};

export const generateMatches = (
    readyAttendeesList: {
        id: string;
        name: string;
        ticketAs: string | "Women" | "Men";
    }[],
    skippedAttendees: string[],
    round_id: string,
    previousMatches: Record<string, string[]>,
    table_count: number,
    table_size: number,
    event_type?: string
) => {
    // Split the list into two
    let smallerSet = readyAttendeesList
        .filter((attendee) => attendee.ticketAs === "Men")
        .map(({ id }) => id);
    let largerSet = readyAttendeesList
        .filter((attendee) => attendee.ticketAs === "Women")
        .map(({ id }) => id);

    if (smallerSet.length > largerSet.length) {
        [smallerSet, largerSet] = [largerSet, smallerSet];
    }

    // // Randomize the arrays
    // let shuffledSmallerSet = smallerSet
    //   .map((value) => ({ value, sort: Math.random() }))
    //   .sort((a, b) => a.sort - b.sort)
    //   .map(({ value }) => value);

    // let shuffledLargerSet = largerSet
    //   .map((value) => ({ value, sort: Math.random() }))
    //   .sort((a, b) => a.sort - b.sort)
    //   .map(({ value }) => value);

    // Pair them off and return the matches

    let matchInfoArray = [];
    let seats = 0;
    let newMatchList = {} as Record<string, string[]>;
    let noMatchList = [] as string[];
    const roundedTableCount = table_size % 2 !== 0 ? table_size - 1 : table_size;
    const weightedAttendeeList = [...skippedAttendees, ...smallerSet];

    console.log({ weightedAttendeeList });
    console.log({ smallerSet }, { skippedAttendees });
    let matchId: string | null = null;
    for (const attendeeId of weightedAttendeeList) {
        if (skippedAttendees.includes(attendeeId)) {
            matchId = getMatch(attendeeId, previousMatches, smallerSet);
        } else {
            matchId = getMatch(attendeeId, previousMatches, largerSet);
        }
        console.log("Match ID: ", matchId);
        if (!matchId) {
            continue;
        }

        const table_id = Math.floor(seats / roundedTableCount);
        if (table_id > table_count) {
            break;
        }
        const table = `Table ${String.fromCharCode(table_id + 65)}`;
        seats += 2;

        matchInfoArray.push({
            event_round_id: round_id,
            attendee_id: attendeeId,
            location: table,
            match_info: readyAttendeesList.find(({ id }) => id === matchId) as Json,
        });

        matchInfoArray.push({
            event_round_id: round_id,
            attendee_id: matchId,
            location: table,
            match_info: readyAttendeesList.find(
                ({ id }) => id === attendeeId
            ) as Json,
        });

        if (newMatchList[attendeeId]) {
            newMatchList[attendeeId].push(matchId);
        } else {
            newMatchList[attendeeId] = [matchId];
        }
        if (newMatchList[matchId]) {
            newMatchList[matchId].push(attendeeId);
        } else {
            newMatchList[matchId] = [attendeeId];
        }
    }

    readyAttendeesList.map((attendee) => {
        if (!matchInfoArray.some((match) => match.attendee_id == attendee.id)) {
            noMatchList.push(attendee.id);
        }
    });

    return { matchInfoArray, newMatchList, noMatchList };
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type objectType = Record<string, string[]>;

export const mergeObject = (objects: objectType[]): objectType => {
    const keys = [...objects.flatMap((o) => Object.keys(o))];
    const newObject: objectType = {};

    for (const key of keys) {
        const values: string[] = [];
        objects.forEach((o) => {
            if (o[key]) {
                values.push(...o[key]);
            }
        });
        newObject[key] = Array.from(new Set(values));
    }
    return newObject;
};
