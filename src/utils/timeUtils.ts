import { format } from 'date-fns';
import type { Venue, Deal } from '../types';

export function getCurrentDay(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

export function getCurrentTime(): string {
  return format(new Date(), 'HH:mm');
}

export function formatTime12Hour(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return format(date, 'h:mm a');
}

export function formatHours12Hour(hoursString: string): string {
  if (!hoursString || hoursString === 'Closed') return 'Closed';
  
  const [openTime, closeTime] = hoursString.split('-');
  const formattedOpen = formatTime12Hour(openTime);
  const formattedClose = formatTime12Hour(closeTime);
  
  return `${formattedOpen} - ${formattedClose}`;
}

export function isVenueOpen(venue: Venue): boolean {
  const currentDay = getCurrentDay();
  const currentTime = getCurrentTime();
  const hours = venue.hours[currentDay];
  
  if (!hours) return false;
  
  const [openTime, closeTime] = hours.split('-');
  return currentTime >= openTime && currentTime <= closeTime;
}

export function hasActiveDeals(venue: Venue): boolean {
  const currentDay = getCurrentDay();
  const currentTime = getCurrentTime();
  
  return venue.deals.some(deal => {
    if (!deal.days.includes(currentDay)) return false;
    return currentTime >= deal.start && currentTime <= deal.end;
  });
}

export function getActiveDeals(venue: Venue): Deal[] {
  const currentDay = getCurrentDay();
  const currentTime = getCurrentTime();
  
  return venue.deals.filter(deal => {
    if (!deal.days.includes(currentDay)) return false;
    return currentTime >= deal.start && currentTime <= deal.end;
  });
}

export function getDealTimeRemaining(deal: Deal): number {
  const currentTime = getCurrentTime();
  const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
  const [endHours, endMinutes] = deal.end.split(':').map(Number);
  
  const currentTotal = currentHours * 60 + currentMinutes;
  const endTotal = endHours * 60 + endMinutes;
  
  return Math.max(0, endTotal - currentTotal);
}

export function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function getTimeWindowLabel(timeWindow: string): string {
  switch (timeWindow) {
    case 'now':
      return 'Now';
    case 'tonight':
      return 'Tonight';
    case 'weekend':
      return 'Weekend';
    default:
      return 'All Day';
  }
}

export function isDealEndingSoon(deal: Deal): boolean {
  const timeRemaining = getDealTimeRemaining(deal);
  return timeRemaining <= 60; // 1 hour or less
}

export function getVenueStatus(venue: Venue): {
  isOpen: boolean;
  hasDeals: boolean;
  endingSoon: boolean;
} {
  const isOpen = isVenueOpen(venue);
  const hasDeals = hasActiveDeals(venue);
  const activeDeals = getActiveDeals(venue);
  const endingSoon = activeDeals.some(deal => isDealEndingSoon(deal));
  
  return {
    isOpen,
    hasDeals,
    endingSoon,
  };
}

export function getSmartDefaultTimeWindow(): 'now' | 'tonight' | 'weekend' | 'all' {
  const now = new Date();

  const currentHour = now.getHours();
  
  // Check if it's currently happy hour time (typically 3-7 PM)
  const isHappyHourTime = currentHour >= 15 && currentHour <= 19;
  
  // If it's happy hour time, default to 'now'
  if (isHappyHourTime) {
    console.log('🕐 Smart default: NOW (currently happy hour time)');
    return 'now';
  }
  
  // If it's before happy hour time today, default to 'tonight'
  if (currentHour < 15) {
    console.log('🕐 Smart default: TONIGHT (before happy hour time)');
    return 'tonight';
  }
  
  // If it's after happy hour time today, check if tomorrow is weekend
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = tomorrow.getDay();
  
  // If tomorrow is Friday, Saturday, or Sunday, default to 'weekend'
  if (tomorrowDay === 5 || tomorrowDay === 6 || tomorrowDay === 0) {
    console.log('🕐 Smart default: WEEKEND (tomorrow is weekend)');
    return 'weekend';
  }
  
  // If tomorrow is a weekday and it's after happy hour, default to 'tonight' (for tomorrow)
  if (tomorrowDay >= 1 && tomorrowDay <= 5) {
    console.log('🕐 Smart default: TONIGHT (tomorrow is weekday)');
    return 'tonight';
  }
  
  // Fallback to 'all' if none of the above conditions are met
  console.log('🕐 Smart default: ALL (fallback)');
  return 'all';
}

export function getDealEmoji(dealLabel: string, dealType: 'drink' | 'food'): string {
  const label = dealLabel.toLowerCase();
  
  // Drink emojis
  if (dealType === 'drink') {
    if (label.includes('cocktail')) return '🍸';
    if (label.includes('margarita')) return '🍹';
    if (label.includes('wine')) return '🍷';
    if (label.includes('beer')) return '🍺';
    if (label.includes('whiskey') || label.includes('bourbon')) return '🥃';
    if (label.includes('vodka')) return '🍸';
    if (label.includes('gin')) return '🍸';
    if (label.includes('rum')) return '🍹';
    if (label.includes('tequila')) return '🍸';
    if (label.includes('sangria')) return '🍷';
    if (label.includes('mimosa')) return '🥂';
    if (label.includes('champagne')) return '🍾';
    if (label.includes('shot')) return '🥃';
    if (label.includes('half-price') || label.includes('discount')) return '💰';
    return '🍺'; // default drink emoji
  }
  
  // Food emojis
  if (dealType === 'food') {
    if (label.includes('oyster')) return '🦪';
    if (label.includes('taco')) return '🌮';
    if (label.includes('pizza')) return '🍕';
    if (label.includes('burger')) return '🍔';
    if (label.includes('slider')) return '🍔';
    if (label.includes('wings')) return '🍗';
    if (label.includes('nachos')) return '🧀';
    if (label.includes('fries')) return '🍟';
    if (label.includes('appetizer') || label.includes('app')) return '🥨';
    if (label.includes('snack')) return '🥨';
    if (label.includes('bites')) return '🥨';
    if (label.includes('canapé')) return '🥨';
    if (label.includes('complementary') || label.includes('complimentary')) return '🎁';
    if (label.includes('free')) return '🎁';
    if (label.includes('discount') || label.includes('half-price')) return '💰';
    return '🍽️'; // default food emoji
  }
  
  return '🍺'; // fallback
}
