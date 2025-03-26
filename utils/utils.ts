import { redirect } from "next/navigation";
import { Json } from "./supabase/schema";

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

export const generatePossibleMatches = (
  readyAttendeesList: {
    id: string;
    name: string;
    ticketAs: string | "Women" | "Men";
  }[],
  previousMatches: Record<string, string[]>,
  paritionByTicket: boolean
) => {
  // we put the ids in lexographical order, since the order is irrelevant this lets us
  // avoid duplicates
  const sorted = readyAttendeesList.toSorted((a, b) =>
    a.id == b.id ? 0 : a.id < b.id ? -1 : 1
  );

  const potentialMatches: Record<string, string>[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const attendee = sorted[i];
    const alreadyMatched: string | string[] = [];
    // const alreadyMatched = previousMatches[attendee.id] ?? [];

    // since we ordered the list we only have to check for matches in front of our position
    for (let j = i + 1; j < sorted.length; j++) {
      const potentialMatch = sorted[j];

      // we don't want any matches with people we already matched with
      if (!alreadyMatched.includes(potentialMatch.id)) {
        // if we're not partioning by tickettype, we're good to go
        // otherwise ensure we have a different ticket type before we match,
        if (
          !paritionByTicket ||
          attendee.ticketAs !== potentialMatch.ticketAs
        ) {
          potentialMatches.push({ [attendee.id]: potentialMatch.id });
        }
      }
    }
  }
  return potentialMatches;
};

export const chooseOptimalMatches = (
  potentialMatches: Record<string, string>[],
  potentialMatchCounts: Record<string, number>,
  skippedLastRound: string[]
) => {
  // note this is a heuristic
  // I went down the rabbit hole on this we'd actually need a graph search algorithm like
  // the blossom algorithm to find the optimal solution,

  // general approach, sort the available users by the number of potential matches they have
  // first we pair up everyone who was skipped last round
  // next we pair the rest up heuristically matching the most constrained people together.
  // all pairing match the person to their neighbor with the fewest potential matches

  const sortMatchesByCount = (a: string, b: string) =>
    potentialMatchCounts[b] - potentialMatchCounts[a];
  let sortedIds: string[] =
    Object.keys(potentialMatchCounts).toSorted(sortMatchesByCount);

  let sortedPreviousSkips: string[] =
    skippedLastRound.toSorted(sortMatchesByCount);

  const skipped: string[] = [];
  const matches: Record<string, string>[] = [];

  const tryFindMatch = (uid: string) => {
    const maybeMatches = potentialMatches
      .filter(
        (m) => Object.keys(m).includes(uid) || Object.values(m).includes(uid)
      )
      .map((m) => (Object.keys(m).includes(uid) ? m[uid] : Object.keys(m)[0]))
      // .filter((m) => sortedIds.includes(m))
      .toSorted(sortMatchesByCount);
    if (maybeMatches.length > 0) {
      const thisMatch = maybeMatches.pop() ?? "";
      matches.push({ [uid]: thisMatch });
      sortedIds = sortedIds.filter((id) => id !== uid && id !== thisMatch);
    } else {
      sortedIds = sortedIds.filter((id) => id !== uid);
      skipped.push(uid);
    }
  };

  while (sortedPreviousSkips.length > 0) {
    const uid: string = sortedPreviousSkips.pop() ?? ""; // can't happen
    tryFindMatch(uid);
  }

  while (sortedIds.length > 0) {
    const uid: string = sortedIds.pop() ?? ""; // can't happen
    tryFindMatch(uid);
  }

  return { matches, skipped };
};

export const countPotentialMatchesPerAttendee = (
  matches: Record<string, string>[]
) => {
  const counts: Record<string, number> = {};
  // initialize
  matches.forEach((match) => {
    const ky = Object.keys(match)[0] ?? "";
    const vl = match[ky];
    counts[ky] = ky in counts ? counts[ky] + 1 : 1;
    counts[vl] = vl in counts ? counts[vl] + 1 : 1;
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
  // note, set to false to do non-dating app style
  const potentialMatches = generatePossibleMatches(
    readyAttendeesList,
    previousMatches,
    event_type === "Dating" ? true : false
  );

  const potentialMatchCounts =
    countPotentialMatchesPerAttendee(potentialMatches);

  const { matches } = chooseOptimalMatches(
    potentialMatches,
    potentialMatchCounts,
    skippedAttendees
  );

  let matchInfoArray: {
    event_round_id: string;
    attendee_id: string;
    location: string;
    match_info:
      | {
          id: string;
          name: string;
          ticketAs: string | "Women" | "Men";
        }
      | undefined;
  }[] = [];
  let seats = 0;
  let newMatchList = {} as Record<string, string[]>;
  let noMatchList = [] as string[];
  const roundedTableCount = table_size % 2 !== 0 ? table_size - 1 : table_size;

  matches.forEach((match) => {
    const table_id = Math.floor(seats / roundedTableCount);
    if (table_id > table_count) {
      return;
    }
    const table = `Table A`;
    seats += 2;
    const attendeeId = Object.keys(match)[0] ?? "";

    matchInfoArray.push({
      event_round_id: round_id,
      attendee_id: attendeeId,
      location: table,
      match_info: readyAttendeesList.find(
        ({ id }) => id === (match[attendeeId] as Json)
      ),
    });
    matchInfoArray.push({
      event_round_id: round_id,
      attendee_id: attendeeId,
      location: table,
      match_info: readyAttendeesList.find(({ id }) => {
        return id === attendeeId;
      }),
    });

    if (newMatchList[attendeeId]) {
      newMatchList[attendeeId].push(match[attendeeId]);
    } else {
      newMatchList[attendeeId] = [match[attendeeId]];
    }
    if (newMatchList[match[attendeeId]]) {
      newMatchList[match[attendeeId]].push(attendeeId);
    } else {
      newMatchList[match[attendeeId]] = [attendeeId];
    }
  });

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
