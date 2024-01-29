// Typdefinitionen
export type Shift = {
    name: string;
    startTime: string;
    endTime: string;
    // Andere Eigenschaften nach Bedarf
  };
  
  export type AgendaEntry = {
    name: string;
    height: number;
    day: string;
    startTime: string;
    endTime: string;
  };
  
  export type ShiftsForDay = {
    [date: string]: Shift[];
  };

  
  export type Role = 'maid' | 'receptionist' | 'waiter' | 'spa' | 'other'; // Erweitern Sie diese Aufzählung entsprechend Ihrer Anwendung
  