export interface FormattedDate {
    day: string;
    weekDay: string;
    month: string;
    year: number;
  }
  
export interface DateCardProps {
    date: Date;
    formattedDate: FormattedDate;
    isToday: boolean;
  }
  
export interface ScheduleItemProps {
    date: Date;
    formattedDate: FormattedDate;
  }
  
export interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }

  export interface WeekNavProps {
    weekDates: Date[];
    monday: Date;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
  }

export interface Equipment {
  _id: string;
  name: string;
  quantity: number;
  dependentId: number;
}

export interface RoomRequirement {
  capacity: number;
  equipment: Array<{
    name: string;
    quantity: number;
  }>;
  needsChemicals: boolean;
}

export interface RoomRequirementBackend {
  name: string;
  _id: string;
  quantity: number;
}

export interface StaffRequestDetail {
  _id: string;
  name: string;
  dates: string[];
  roomRequirement: RoomRequirement;
}

export interface StaffRequest {
  _id: string;
  name: string;
  workingDays: number;
  hasRoomRequirement: boolean;
}

export interface User {
  _id: number;
  name: string;
  isManager: boolean;
  unavailability: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
  };
  roomPreference?: {
    capacity: number;
    chemicalUse: boolean;
    equipment: Array<{
      _id: string | number;
      name?: string;
      quantity: number;
    }>;
  };
}

export interface Allocation {
  user_name: string;
  room_name: string;
  user_id: number;
  room_id: number;
}

export interface TimetableData {
  [key: string]: Allocation[];
}

export interface RoomDetails {
  _id: string;
  name: string;
  attributes: {
    capacity: number;
    chemicalUse: boolean;
    equipment: Array<{
      _id: string;
      name: string;
      quantity: number;
    }>;
  };
}

export interface UnavailabilityPayload {
  userId: number;
  unavailability: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
  };
}

export interface TimetableDocument {
  _id: number;
  timetable: TimetableData;
}

export interface UserLocalStorage {
  _id: number;
  name: string;
  isManager: boolean;
  unavailability: {
    [key: string]: boolean;
  };
}

export interface UserApprove {
  _id: number;
  name: string;
  roomPreference: RoomRequirement;
  workingDays: number;
  hasRoomRequirement: boolean;
  unavailability: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
  }
}
