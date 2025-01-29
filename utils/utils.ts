import { read } from "fs";
import { redirect } from "next/navigation";

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
export const generateMatches = (
  readyAttendeesList: {
    id: string;
    name: string;
    ticketAs: string | "Women" | "Men";
  }[],
  round_id: string,
  event_type?: string
) => {
  // Split the list into two
  let smallerSet = readyAttendeesList.filter(
    (attendee) => attendee.ticketAs === "Men"
  );
  let largerSet = readyAttendeesList.filter(
    (attendee) => attendee.ticketAs === "Women"
  );
  if (smallerSet.length > largerSet.length) {
    [smallerSet, largerSet] = [largerSet, smallerSet];
  }

  // Randomize the arrays
  let shuffledSmallerSet = smallerSet
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  let shuffledLargerSet = largerSet
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  // Pair them off and return the matches
  let matchInfoArray = [];
  for (let i = 0; i < shuffledSmallerSet.length; ++i) {
    const table_name = "Table " + (i + 1);

    matchInfoArray.push({
      event_round_id: round_id,
      attendee_id: smallerSet[i].id,
      location: table_name,
      match_info: {
        id: shuffledLargerSet[i].id.slice(-4),
        name: shuffledLargerSet[i].name,
      },
    });

    matchInfoArray.push({
      event_round_id: round_id,
      attendee_id: shuffledLargerSet[i].id,
      location: table_name,
      match_info: {
        id: shuffledSmallerSet[i].id.slice(-4),
        name: shuffledSmallerSet[i].name,
      },
    });
  }
  return matchInfoArray;

  // return [
  //   {
  //     event_round_id: round_id,
  //     attendee_id: "83486c34-96ae-4085-836f-e557b45c1a75", // Elad
  //     location: "Table 1",
  //     match_info: {
  //       id: "862a",
  //       name: "Micheal",
  //     },
  //   },
  //   {
  //     event_round_id: round_id,
  //     attendee_id: "a1bdef26-b021-4c88-acbe-17ebd229862a", // Micheal
  //     location: "Table 1",
  //     match_info: {
  //       id: "1a75",
  //       name: "Elad",
  //     },
  //   },
  // ];
};
