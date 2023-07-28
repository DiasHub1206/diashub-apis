export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked',
}

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
}

export enum EmploymentType {
  FULL_TIME = 'full time',
  PART_TIME = 'part time',
  SELF_EMPLOYED = 'self employed',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  TRAINEE = 'trainee',
}

export enum WorkLocationType {
  ON_SITE = 'on site',
  HYBRID = 'hybrid',
  REMOTE = 'remote',
}

export enum SkillProficiency {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum FeedVisibility {
  PUBLIC = 'public',
  CONNECTION = 'connection',
  // We have to define group
  GROUP = 'group',
}

export enum FeedAssetType {
  IMAGE = 'image',
  VIDEO = 'video',
}
