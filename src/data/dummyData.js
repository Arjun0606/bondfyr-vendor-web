// Generate a month of realistic club analytics data
const generateMonthData = () => {
  const month = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1); // Start from a month ago
  
  // Configure typical weekly patterns
  const weekdayPatterns = {
    0: { baseAttendance: 200, peak: 22 }, // Sunday
    1: { baseAttendance: 120, peak: 23 }, // Monday
    2: { baseAttendance: 150, peak: 23 }, // Tuesday
    3: { baseAttendance: 180, peak: 23 }, // Wednesday
    4: { baseAttendance: 250, peak: 0 },  // Thursday
    5: { baseAttendance: 500, peak: 1 },  // Friday
    6: { baseAttendance: 650, peak: 1 }   // Saturday
  };
  
  // Special events that increase attendance
  const specialEvents = [
    { date: 5, name: "DJ Anish Live", boost: 200 },
    { date: 12, name: "Ladies Night", boost: 150 },
    { date: 19, name: "Bollywood Night", boost: 250 },
    { date: 26, name: "EDM Festival", boost: 300 }
  ];
  
  // Generate daily data
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    const dayOfMonth = currentDate.getDate();
    
    // Check if it's a special event day
    const specialEvent = specialEvents.find(event => event.date === dayOfMonth);
    const eventBoost = specialEvent ? specialEvent.boost : 0;
    const eventName = specialEvent ? specialEvent.name : null;
    
    // Calculate attendance with some randomness
    const pattern = weekdayPatterns[dayOfWeek];
    const baseAttendance = pattern.baseAttendance;
    const randomFactor = 0.8 + Math.random() * 0.4; // 80% to 120% of base
    const totalAttendance = Math.round((baseAttendance * randomFactor) + eventBoost);
    
    // Generate hourly breakdown
    const hourlyData = [];
    for (let hour = 19; hour <= 28; hour++) { // 7pm to 4am (28 is 4am next day)
      const displayHour = hour > 24 ? hour - 24 : hour;
      const peakHourFactor = Math.abs(hour - (pattern.peak + 24)) <= 1 ? 1.5 : 1;
      const hourAttendance = Math.round((totalAttendance / 8) * peakHourFactor * (0.7 + Math.random() * 0.6));
      
      hourlyData.push({
        hour: `${displayHour}:00`,
        entries: Math.round(hourAttendance * 0.7),
        exits: Math.round(hourAttendance * 0.6),
        occupancy: hourAttendance
      });
    }
    
    // Entry tier distribution
    const earlyEntries = Math.round(totalAttendance * (0.2 + Math.random() * 0.1)); // 20-30%
    const regularEntries = Math.round(totalAttendance * (0.5 + Math.random() * 0.1)); // 50-60%
    const lateEntries = totalAttendance - earlyEntries - regularEntries;
    
    // Calculate revenue
    const earlyRevenue = 0; // Free entries
    const regularRevenue = regularEntries * 500;
    const lateRevenue = lateEntries * 800;
    
    month.push({
      date: currentDate.toISOString().split('T')[0],
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      totalAttendance,
      hourlyData,
      eventName,
      revenue: {
        total: regularRevenue + lateRevenue,
        entryFees: regularRevenue + lateRevenue,
        foodAndBeverage: Math.round(totalAttendance * (800 + Math.random() * 400)), // Average spend 800-1200 per person
        merchandise: Math.round(totalAttendance * 0.05 * 1500) // 5% buy merch at ₹1500 avg
      },
      entryTiers: {
        early: {
          count: earlyEntries,
          revenue: earlyRevenue
        },
        regular: {
          count: regularEntries,
          revenue: regularRevenue
        },
        late: {
          count: lateEntries,
          revenue: lateRevenue
        }
      },
      demographics: {
        gender: {
          male: Math.round(totalAttendance * (0.55 + Math.random() * 0.1)),
          female: Math.round(totalAttendance * (0.42 + Math.random() * 0.1)),
          other: Math.round(totalAttendance * 0.03)
        },
        ageGroups: {
          "18-24": Math.round(totalAttendance * (0.3 + Math.random() * 0.1)),
          "25-34": Math.round(totalAttendance * (0.45 + Math.random() * 0.1)),
          "35-44": Math.round(totalAttendance * (0.15 + Math.random() * 0.05)),
          "45+": Math.round(totalAttendance * (0.05 + Math.random() * 0.05))
        }
      },
      bookingTypes: {
        direct: Math.round(totalAttendance * (0.25 + Math.random() * 0.1)),
        groupBookings: Math.round(totalAttendance * (0.4 + Math.random() * 0.15)),
        pr: Math.round(totalAttendance * (0.35 + Math.random() * 0.1))
      }
    });
  }
  
  return month;
};

// Generate the latest real-time stats for dashboard
const generateCurrentStats = (monthData) => {
  // Use the latest data as a base
  const latest = monthData[monthData.length - 1];
  
  // For demo, assume we're in the middle of an evening
  const currentHourIndex = 3; // Around 10pm
  const currentHour = latest.hourlyData[currentHourIndex];
  
  return {
    currentOccupancy: currentHour.occupancy,
    hourlyCheckins: latest.hourlyData.map(hour => hour.entries),
    peakTime: "11:00 PM",
    genderRatio: latest.demographics.gender,
    averageAge: "28",
    totalRevenue: latest.revenue.total,
    revenueBreakdown: {
      entryFees: latest.revenue.entryFees / latest.revenue.total,
      fnb: latest.revenue.foodAndBeverage / latest.revenue.total,
      merchandise: latest.revenue.merchandise / latest.revenue.total
    }
  };
};

// Generate 20 upcoming events
const generateUpcomingEvents = () => {
  const events = [];
  const eventTypes = [
    { name: "DJ Night", icon: "🎧" },
    { name: "Ladies Night", icon: "💃" },
    { name: "Live Band", icon: "🎸" },
    { name: "Hip Hop Night", icon: "🎤" },
    { name: "EDM Festival", icon: "🎭" },
    { name: "Bollywood Night", icon: "🎬" },
    { name: "Retro Classics", icon: "🕺" },
    { name: "Techno Underground", icon: "🔊" }
  ];
  
  const startDate = new Date();
  
  for (let i = 0; i < 20; i++) {
    const eventDate = new Date(startDate);
    eventDate.setDate(startDate.getDate() + Math.floor(i / 2) + 1);
    
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomCapacity = 200 + Math.floor(Math.random() * 800);
    const randomTicketsSold = Math.floor(Math.random() * (randomCapacity * 0.8));
    
    events.push({
      id: `EVT-${1000 + i}`,
      name: `${randomType.name} - ${["Neon", "Glow", "Elite", "Premium", "Exclusive", "VIP"][Math.floor(Math.random() * 6)]} Edition`,
      date: eventDate.toISOString().split('T')[0],
      time: `${7 + Math.floor(Math.random() * 2)}:00 PM`,
      icon: randomType.icon,
      ticketsSold: randomTicketsSold,
      capacity: randomCapacity,
      revenue: randomTicketsSold * (500 + Math.floor(Math.random() * 1000)),
      status: randomTicketsSold > (randomCapacity * 0.9) ? "Almost Full" : 
              randomTicketsSold > (randomCapacity * 0.5) ? "Selling Fast" : "Available"
    });
  }
  
  return events;
};

// Generate guest list samples
const generateGuestLists = () => {
  const vipNames = [
    "Arjun Kapoor", "Disha Patel", "Ranbir Singh", "Sonam Kapadia", 
    "Vikram Malhotra", "Neha Sharma", "Raj Mehta", "Priya Khurana",
    "Karan Johar", "Deepika Singhania", "Aditya Chopra", "Meera Rajput"
  ];
  
  const regularNames = [
    "Rohan Mehra", "Ananya Joshi", "Varun Khanna", "Tanya Agarwal",
    "Suresh Kumar", "Pooja Desai", "Rahul Verma", "Kavita Singh",
    "Mohit Kapoor", "Shikha Patel", "Vivek Sharma", "Nisha Gupta",
    "Rajiv Malhotra", "Mira Reddy", "Gaurav Sinha", "Sonia Arora"
  ];
  
  const statuses = ["Confirmed", "Checked In", "Cancelled", "Waiting"];
  const tables = ["A1", "A2", "B1", "B2", "C1", "VIP1", "VIP2", "PRIME"];
  
  const createGuest = (name, isVip = false) => {
    const randStatus = statuses[Math.floor(Math.random() * (isVip ? 2 : 4))]; // VIPs rarely get cancelled
    return {
      name,
      guests: 1 + Math.floor(Math.random() * 5),
      bookingId: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      time: `${7 + Math.floor(Math.random() * 5)}:${Math.random() > 0.5 ? '30' : '00'} PM`,
      status: randStatus,
      table: isVip ? tables[Math.floor(Math.random() * 3) + 5] : tables[Math.floor(Math.random() * 5)],
      spendAmount: isVip ? 15000 + Math.floor(Math.random() * 35000) : 5000 + Math.floor(Math.random() * 10000)
    };
  };
  
  const vipGuests = vipNames.map(name => createGuest(name, true));
  
  const waitingList = regularNames.slice(0, 8).map(name => ({
    name,
    guests: 1 + Math.floor(Math.random() * 3),
    phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
    time: `${Math.floor(Math.random() * 3) + 1} hours ago`,
    status: "Waiting"
  }));
  
  const directBookings = regularNames.slice(8).map(name => createGuest(name));
  
  return {
    vipGuests,
    waitingList,
    directBookings
  };
};

// Generate group bookings
const generateGroupBookings = () => {
  const groups = [];
  const hosts = [
    "Rohit Sharma", "Anita Desai", "Vikrant Massey", "Priya Singh",
    "Rajat Kapoor", "Neha Kakkar", "Amit Shah", "Divya Khosla"
  ];
  
  for (let i = 0; i < 8; i++) {
    const groupSize = 3 + Math.floor(Math.random() * 8);
    const bookingTime = new Date();
    bookingTime.setHours(bookingTime.getHours() - Math.floor(Math.random() * 48));
    
    groups.push({
      id: `GRP-${2000 + i}`,
      host: hosts[i],
      totalMembers: groupSize,
      bookingTime: bookingTime.toISOString(),
      phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
      entryTime: {
        before9PM: { price: 0, label: "Free Entry (Before 9PM)" },
        before1045PM: { price: 500, label: "Regular Entry (9:30PM-10:45PM)" },
        after1045PM: { price: 800, label: "Late Entry (After 10:45PM)" }
      },
      members: Array(groupSize).fill().map((_, idx) => ({
        id: idx + 1,
        name: idx === 0 ? 
          `${hosts[i]} G1 (Host)` : 
          `${hosts[i]} G${idx + 1}`,
        checked: Math.random() > 0.7
      }))
    });
  }
  
  return groups;
};

// Generate dummy recent activity feed
const generateRecentActivity = () => {
  const activities = [
    { type: "check-in", icon: "🚪", message: "Rahul Khanna checked in with 3 guests" },
    { type: "order", icon: "🍾", message: "VIP Table 3 ordered bottle service (₹28,000)" },
    { type: "reservation", icon: "📱", message: "New reservation: Priya Shah + 5 guests for Friday" },
    { type: "alert", icon: "⚠️", message: "Capacity at 85% - 120 guests remaining" },
    { type: "check-in", icon: "🚪", message: "VIP Ranbir Kapoor checked in with 4 guests" },
    { type: "pr", icon: "👤", message: "PR Amit brought in 12 guests (₹6,000 commission)" },
    { type: "order", icon: "🍹", message: "Table B4 ordered 2 cocktail pitchers (₹4,400)" },
    { type: "alert", icon: "🔊", message: "Noise complaint registered from neighboring building" },
    { type: "check-in", icon: "🚪", message: "Group booking GRP-2045 arrived (4 of 6 members)" },
    { type: "reservation", icon: "📱", message: "Waitlist updated: 8 groups (24 guests) waiting" },
    { type: "pr", icon: "👤", message: "PR Neha reached 85% of monthly target" },
    { type: "order", icon: "🍾", message: "VIP Table 1 ordered premium package (₹45,000)" }
  ];
  
  const times = [];
  const now = new Date();
  for (let i = 0; i < activities.length; i++) {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - i * 8 - Math.floor(Math.random() * 5));
    times.push(time);
  }
  
  return activities.map((activity, idx) => ({
    ...activity,
    id: `act-${idx}`,
    time: times[idx].toISOString()
  }));
};

// Compile all the data
export const dummyAnalyticsData = {
  monthlyData: generateMonthData(),
  currentStats: generateCurrentStats(generateMonthData()),
  events: generateUpcomingEvents(),
  guestList: generateGuestLists(),
  groupBookings: generateGroupBookings(),
  recentActivity: generateRecentActivity(),
  tieredEntryData: {
    tiers: [
      { tier: "Early (Before 9PM)", price: 0, scanned: 425, percentage: 22.7 },
      { tier: "Regular (9:30PM-10:45PM)", price: 500, scanned: 1025, percentage: 54.6 },
      { tier: "Late (After 10:45PM)", price: 800, scanned: 426, percentage: 22.7 }
    ],
    revenue: {
      earlyTier: 0,
      regularTier: 512500, // 1025 guests × ₹500
      lateTier: 340800, // 426 guests × ₹800
      total: 853300
    },
    partialGroups: {
      totalPartialScans: 182, // Number of groups where not all members arrived together
      averageTimeBetweenScans: "42 minutes",
      tieredUpgrades: 56, // Number of guests who had to pay tier price difference
      additionalRevenue: 16800 // Revenue from tier upgrades
    }
  }
}; 