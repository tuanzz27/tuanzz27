export type Category = 'Ăn uống' | 'Học tập' | 'Giải trí' | 'Di chuyển' | 'Mua sắm' | 'Khác';

export type JarName = 'NEC' | 'LTSS' | 'EDU' | 'PLAY' | 'FFA' | 'GIVE';

export interface Jar {
  name: JarName;
  fullName: string;
  percentage: number;
  balance: number;
  icon: string;
  color: string;
  description: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: Category;
  jar: JarName;
  date: Date;
}

export interface PetEvolution {
  name: string;
  image: string;
  requiredSavings: number;
}

export interface Pet {
  id: string;
  name: string;
  description: string;
  evolutions: PetEvolution[];
}

export interface UserPet {
  petId: string;
  unlockedAt: Date;
}


export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  completed?: boolean;
}

export interface UserData {
  username: string;
  income: number;
  jars: Record<JarName, Jar>;
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  activePetId: string | null;
  collectedPets: UserPet[];
}

export type DashboardView = 'dashboard' | 'history' | 'add' | 'analysis' | 'settings';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
