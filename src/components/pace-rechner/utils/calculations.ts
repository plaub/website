import type { SportActivity } from "../types/PaceRechner";
import { SportsType } from "../types/PaceRechner";

export const getEnhancedAvgSpeed = (
  totalDistance: number,
  totalDuration: number
) => {
  return totalDistance / totalDuration;
};

export const secondsToHHMMSS = (s: number, trim: boolean): string => {
  if (s < 0) return secondsToHHMMSS(0, trim); // Handle negative values
  if (s === 0 && trim) return "00:00"; // Special case for 0 and trim
  if (s === 0) return "00:00:00";

  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  const formattedString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  if (trim && hours === 0) {
    return formattedString.substring(3); // Remove "00:" prefix
  }

  return formattedString;
};

// Sport-specific calculation functions
export const calculateTimeFromPaceOrSpeed = (
  activity: SportActivity
): number => {
  switch (activity.type) {
    case SportsType.Swim:
      return Math.round((activity.distance / 100.0) * activity.paceOrSpeed);
    case SportsType.Run:
    case SportsType.Hiking:
    case SportsType.Walking:
      return Math.round((activity.distance / 1000.0) * activity.paceOrSpeed);
    case SportsType.Bike:
    case SportsType.Rowing:
      return Math.round((activity.distance / activity.paceOrSpeed) * 3600);
    default:
      return activity.time;
  }
};

export const calculatePaceOrSpeedFromTime = (
  activity: SportActivity
): number => {
  switch (activity.type) {
    case SportsType.Swim:
      return activity.distance > 0
        ? activity.time / (activity.distance / 100.0)
        : 0.0;
    case SportsType.Run:
    case SportsType.Hiking:
    case SportsType.Walking:
      return activity.distance > 0
        ? activity.time / (activity.distance / 1000.0)
        : 0.0;
    case SportsType.Bike:
    case SportsType.Rowing:
      return activity.time > 0
        ? activity.distance / (activity.time / 3600.0)
        : 0.0;
    default:
      return activity.paceOrSpeed;
  }
};

export const calculateDistanceFromTimeAndPace = (
  activity: SportActivity
): number => {
  switch (activity.type) {
    case SportsType.Swim:
      return (activity.time / activity.paceOrSpeed) * 100.0;
    case SportsType.Run:
    case SportsType.Hiking:
    case SportsType.Walking:
      return (activity.time / activity.paceOrSpeed) * 1000.0;
    case SportsType.Bike:
    case SportsType.Rowing:
      return (activity.paceOrSpeed * activity.time) / 3600.0;
    default:
      return activity.distance;
  }
};

export const getSportConfig = (sportsType: SportsType) => {
  switch (sportsType) {
    case SportsType.Swim:
      return {
        distanceUnit: "m",
        paceSpeedUnit: "min/100m",
        isPace: true,
        defaultPaceSpeed: 120.0,
        defaultDistance: 1500.0,
      };
    case SportsType.Bike:
      return {
        distanceUnit: "km",
        paceSpeedUnit: "km/h",
        isPace: false,
        defaultPaceSpeed: 25.0,
        defaultDistance: 40.0,
      };
    case SportsType.Run:
      return {
        distanceUnit: "m",
        paceSpeedUnit: "min/km",
        isPace: true,
        defaultPaceSpeed: 300.0,
        defaultDistance: 10000.0,
      };
    case SportsType.Rowing:
      return {
        distanceUnit: "km",
        paceSpeedUnit: "km/h",
        isPace: false,
        defaultPaceSpeed: 15.0,
        defaultDistance: 2.0,
      };
    case SportsType.Hiking:
      return {
        distanceUnit: "m",
        paceSpeedUnit: "min/km",
        isPace: true,
        defaultPaceSpeed: 600.0,
        defaultDistance: 5000.0,
      };
    case SportsType.Walking:
      return {
        distanceUnit: "m",
        paceSpeedUnit: "min/km",
        isPace: true,
        defaultPaceSpeed: 720.0,
        defaultDistance: 3000.0,
      };
    default:
      return {
        distanceUnit: "m",
        paceSpeedUnit: "min/km",
        isPace: true,
        defaultPaceSpeed: 300.0,
        defaultDistance: 5000.0,
      };
  }
};

export const msToMinPerKmNumber = (ms: number): number => {
  if (ms === 0) {
    return 0;
  }

  const minPerKm = 1 / (ms / 1000) / 60;

  return minPerKm;
};

export const msToKmPerHourNumber = (ms: number): number => {
  if (ms === 0) {
    return 0;
  }

  const minPerKm = ms * 3.6;

  return minPerKm;
};

export const msToMinPerKm = (ms: number, trim: boolean): string => {
  if (ms === 0) {
    return "0";
  }

  const minPerKm = 1 / (ms / 1000) / 60;

  return secondsToHHMMSS(minPerKm * 60, trim);
};

function hoursValueToSecondsValue(value: number, seconds: number) {
  return (value / 3600) * seconds;
}
