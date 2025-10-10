/**
 * Vote window management to prevent gaming the system
 * Votes close at 23:00 UTC to prevent last-minute voting
 */

export function isVotingOpen(): boolean {
  const now = new Date();
  const utcHour = now.getUTCHours();
  
  // Voting is open from 00:00 UTC to 22:59 UTC (closes at 23:00 UTC)
  return utcHour < 23;
}

export function getVotingStatus(): {
  isOpen: boolean;
  nextOpenTime: Date;
  timeUntilClose: string;
} {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const isOpen = utcHour < 23;
  
  // Calculate next open time (tomorrow at 00:00 UTC)
  const nextOpen = new Date(now);
  nextOpen.setUTCDate(nextOpen.getUTCDate() + 1);
  nextOpen.setUTCHours(0, 0, 0, 0);
  
  // Calculate time until close (if voting is open)
  let timeUntilClose = "";
  if (isOpen) {
    const closeTime = new Date(now);
    closeTime.setUTCHours(23, 0, 0, 0);
    const msUntilClose = closeTime.getTime() - now.getTime();
    const hoursUntilClose = Math.floor(msUntilClose / (1000 * 60 * 60));
    const minutesUntilClose = Math.floor((msUntilClose % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursUntilClose > 0) {
      timeUntilClose = `${hoursUntilClose}h ${minutesUntilClose}m`;
    } else {
      timeUntilClose = `${minutesUntilClose}m`;
    }
  }
  
  return {
    isOpen,
    nextOpenTime: nextOpen,
    timeUntilClose
  };
}

export function getVotingWindowMessage(): string {
  const status = getVotingStatus();
  
  if (status.isOpen) {
    return `Vote closes at 11:00 PM UTC (${status.timeUntilClose} remaining)`;
  } else {
    return "Voting is closed. Opens tomorrow at 12:01 AM UTC";
  }
}

export function getResultsRevealMessage(): string {
  const now = new Date();
  
  // Calculate time until results reveal (12:01 AM UTC tomorrow)
  const revealTime = new Date(now);
  revealTime.setUTCDate(revealTime.getUTCDate() + 1);
  revealTime.setUTCHours(0, 1, 0, 0); // 12:01 AM UTC
  
  const msUntilReveal = revealTime.getTime() - now.getTime();
  const hoursUntilReveal = Math.floor(msUntilReveal / (1000 * 60 * 60));
  const minutesUntilReveal = Math.floor((msUntilReveal % (1000 * 60 * 60)) / (1000 * 60));
  
  let timeUntilReveal = "";
  if (hoursUntilReveal > 0) {
    timeUntilReveal = `${hoursUntilReveal}h ${minutesUntilReveal}m`;
  } else {
    timeUntilReveal = `${minutesUntilReveal}m`;
  }
  
  return `Vote results will be revealed at 12:01 AM UTC (${timeUntilReveal} remaining)`;
}
