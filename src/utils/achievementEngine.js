import { achievements } from '../data/achievements.js'

// Compares state against every achievement's condition and returns the ids
// of any that just became true and aren't already unlocked. Called once
// after every reducer action — cheap since the achievement list is small.
export function checkAchievements(state) {
  return achievements
    .filter((achievement) => !state.unlockedAchievementIds.includes(achievement.id))
    .filter((achievement) => achievement.condition(state))
    .map((achievement) => achievement.id)
}
