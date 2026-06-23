import type { ScheduledPass } from "../types/scheduler";

export function hasTimeOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string
): boolean {
    const aStart = new Date(startA).getTime();
    const aEnd = new Date(endA).getTime();
    const bStart = new Date(startB).getTime();
    const bEnd = new Date(endB).getTime();

    return aStart < bEnd && bStart < aEnd;
}

export function computeConflicts(
    passes: ScheduledPass[]
): ScheduledPass[] {

    return passes.map((passA, i) => {

        const conflict = passes.some((passB, j) => {

            if (i === j) {
                return false;
            }

            // Only compare passes using the same ground station
            if (
                passA.ground_station_name !==
                passB.ground_station_name
            ) {
                return false;
            }

            return hasTimeOverlap(
                passA.start_time,
                passA.end_time,
                passB.start_time,
                passB.end_time
            );
        });

        return {
            ...passA,
            status: conflict ? "conflict" : passA.status
        };
    });
}