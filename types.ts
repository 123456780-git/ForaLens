
export interface PlantIdentification {
  commonName: string;
  scientificName: string;
  family: string;
  description: string;
  careInstructions: {
    watering: string;
    sunlight: string;
    soil: string;
    fertilizer: string;
  };
  toxicity: {
    isToxic: boolean;
    details: string;
  };
  healthStatus: {
    isHealthy: boolean;
    diagnosis: string;
    treatment?: string;
    healthScore: number; // 0 to 100
  };
  isWeed: {
    status: boolean;
    reasoning: string;
  };
  suggestedReminders: {
    task: string;
    description: string;
    frequency: string;
  }[];
  mapData?: {
    summary: string;
    links: { title: string; uri: string }[];
  };
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
}

export interface Reminder {
  id: string;
  plant: string;
  task: string;
  dateTime: string;
  completed: boolean;
  icon: string;
}

export type ViewType = 'home' | 'about' | 'contact' | 'result' | 'history' | 'reminders' | 'profile' | 'auth' | 'library' | 'stats' | 'settings' | 'community';
