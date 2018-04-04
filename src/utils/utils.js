export function filterMatchesFromArray(toFilter, toRemove) {
    return toFilter.filter((itemToCheck) => {
        return !toRemove.find((itemToRemove) => {
            return itemToRemove === itemToCheck;
        });
    });
}