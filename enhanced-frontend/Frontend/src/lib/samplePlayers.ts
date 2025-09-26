export interface Player {
  id: string;
  name: string;
  age: number;
  location: string;
  primarySport: string;
  joinDate: string;
  totalVideos: number;
  averageScore: number;
  personalBests: Record<string, string>;
  inTalentPool: boolean;
  lastActive: string;
}

export const players: Player[] = [
  {
    id: 'ATH001',
    name: 'Priya Sharma',
    age: 19,
    location: 'Mumbai, Maharashtra',
    primarySport: 'Athletics',
    joinDate: '2024-08-15',
    totalVideos: 23,
    averageScore: 8.7,
    personalBests: { verticalJump: '45cm', shuttleRun: '12.3s', sitUps: '52 reps' },
    inTalentPool: true,
    lastActive: '2 hours ago'
  },
  {
    id: 'BBL002',
    name: 'Arjun Singh',
    age: 20,
    location: 'Chandigarh, Punjab',
    primarySport: 'Basketball',
    joinDate: '2024-07-22',
    totalVideos: 31,
    averageScore: 9.1,
    personalBests: { verticalJump: '58cm', shuttleRun: '11.8s', pushUps: '67 reps' },
    inTalentPool: true,
    lastActive: '1 hour ago'
  },
  {
    id: 'SWM003',
    name: 'Meera Patel',
    age: 18,
    location: 'Ahmedabad, Gujarat',
    primarySport: 'Swimming',
    joinDate: '2024-09-10',
    totalVideos: 18,
    averageScore: 8.9,
    personalBests: { freestyle50m: '26.8s', butterfly100m: '1:02.3', endurance: '15min' },
    inTalentPool: false,
    lastActive: '30 minutes ago'
  },
  {
    id: 'FTB004',
    name: 'Rohit Kumar',
    age: 21,
    location: 'Kochi, Kerala',
    primarySport: 'Football',
    joinDate: '2024-06-18',
    totalVideos: 27,
    averageScore: 8.3,
    personalBests: { sprint20m: '3.2s', ballControl: '95%', endurance: '18min' },
    inTalentPool: false,
    lastActive: '5 hours ago'
  },
  {
    id: 'BDM005',
    name: 'Sneha Rao',
    age: 19,
    location: 'Bangalore, Karnataka',
    primarySport: 'Badminton',
    joinDate: '2024-08-03',
    totalVideos: 22,
    averageScore: 8.5,
    personalBests: { smashSpeed: '285kmh', agility: '9.2s', precision: '92%' },
    inTalentPool: true,
    lastActive: '3 hours ago'
  },
  {
    id: 'WRS006',
    name: 'Vikram Joshi',
    age: 22,
    location: 'Gurgaon, Haryana',
    primarySport: 'Wrestling',
    joinDate: '2024-05-12',
    totalVideos: 35,
    averageScore: 7.9,
    personalBests: { strength: '180kg', technique: '8.7/10', flexibility: '85%' },
    inTalentPool: false,
    lastActive: '1 day ago'
  }
];

export default players;
