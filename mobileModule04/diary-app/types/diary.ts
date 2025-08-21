export interface DiaryEntry {
  id: string;
  email: string;
  date: string;
  title: string;
  icon: string;
  text: string;
  createdAt: Date;
}

export interface CreateDiaryEntry {
  email: string;
  date: string;
  title: string;
  icon: string;
  text: string;
}
