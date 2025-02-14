import { User } from '../data/model.ts';

export enum UserType {
  chef = 'chef',
  host = 'host',
  admin = 'admin'
}

export enum UserHeaderTab {
  profile = 'profile',
  account = 'account',
  password = 'password',
  notification = 'notification',
  services = 'services',
  verification = 'verification',
  settings = 'settings'
}

export interface UserPageProps {
  user: User;
  type: UserType;
  className?: string;
}
