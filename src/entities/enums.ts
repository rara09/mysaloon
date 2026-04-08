export enum ServiceType {
  NATTES = 'Nattes',
  TRESSES = 'Tresses',
  TISSAGE = 'Tissage',
  COUPE = 'Coupe',
  COLORATION = 'Coloration',
  ONGLERIE = 'Onglerie',
  AUTRE = 'Autre',
}

export enum PaymentMethod {
  CASH = 'Espèces',
  MOBILE_MONEY = 'Mobile Money',
  CREDIT = 'Crédit',
  CARD = 'Carte',
}

export enum ProductCategory {
  HAIR = 'Hair',
  NAILS = 'Nails',
  AESTHETICS = 'Aesthetics',
  OTHER = 'Other',
}

export enum ExpenseCategory {
  PRODUCTS = 'Produits',
  WATER = 'Eau',
  ELECTRICITY = 'Électricité',
  SALARIES = 'Salaires',
  RENT = 'Loyer',
  OTHER = 'Autre',
}

export enum DebtStatus {
  UNPAID = 'IMPAYÉ',
  PARTIAL = 'PARTIEL',
  PAID = 'PAYÉ',
}

// Loyalty / Fidelity
export enum LoyaltyLevel {
  BRONZE = 'bronze',
  SILVER = 'argent',
  GOLD = 'or',
  PLATINUM = 'platine',
}

export enum LoyaltyTransactionReason {
  VISIT = 'visite',
  BIRTHDAY = 'anniversaire',
  REWARD = 'récompense',
}

// Reminders
export enum ReminderType {
  BIRTHDAY = 'anniversaire',
  INACTIVITY = 'inactivite',
  CUSTOM = 'custom',
}

export enum ReminderChannel {
  SMS = 'sms',
  EMAIL = 'email',
}

export enum ReminderStatus {
  PENDING = 'en_attente',
  SENT = 'envoye',
  FAILED = 'echoue',
}

// Appointment / Rendez-vous
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CLIENT = 'CLIENT',
}

export enum NotificationType {
  APPOINTMENT_CREATED = 'APPOINTMENT_CREATED',
}

export enum GalleryMediaKind {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}
