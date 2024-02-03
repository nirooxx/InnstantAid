// Typdefinitionen
export type Shift = {
    name: string;
    startTime: Date;
    endTime: Date;
    employeeName: string,
    role: string,
    // Andere Eigenschaften nach Bedarf
  };

  export type FirestoreTimestamp = {
    seconds: number;
    nanoseconds: number;
  }
  
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

  
  export type Role = 'maid' | 'receptionist' | 'waiter' | 'spa' | 'zimmermaedchen' | 'other'; // Erweitern Sie diese Aufzählung entsprechend Ihrer Anwendung
  

  