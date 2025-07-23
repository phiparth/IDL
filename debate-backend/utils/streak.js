const moment = require("moment");
const user= require("../models/user");
// This module updates the user's streak count based on their last active date
// If the user was last active yesterday, it increments the streak count
const updateStreak = (user) => {
  const today = moment().startOf("day");
  const last = moment(user.lastActiveDate).startOf("day");

  if (!user.lastActiveDate) {
    user.streakCount = 1;
  } else {
    const diff = today.diff(last, "days");

    if (diff === 1) {
      user.streakCount += 1;
    } else if (diff > 1) {
      user.streakCount = 1;
    }
    // If diff === 0, do nothing
  }

  user.lastActiveDate = today.toDate();
  return user.save();
};

module.exports = updateStreak;
// This function updates the user's streak count based on their last active date
// If the user was last active yesterday, increment the streak count
// If the user was last active more than a day ago, reset the streak count to