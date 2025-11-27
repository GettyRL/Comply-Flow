export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface RegulationUpdate {
  id: string;
  title: string;
  region: string;
  severity: 'high' | 'medium' | 'low';
  summary: string;
  date: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  DRAFTER = 'DRAFTER',
  ANALYZER = 'ANALYZER',
  MEDIA_STUDIO = 'MEDIA_STUDIO',
  LIVE_AGENT = 'LIVE_AGENT',
  IMAGE_EDITOR = 'IMAGE_EDITOR',
  CHAT_BOT = 'CHAT_BOT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  COMPLIANCE_DETAILS = 'COMPLIANCE_DETAILS',
  COUNTRY_DETAILS = 'COUNTRY_DETAILS'
}

export enum VideoAspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16'
}

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}

export interface GeoStatus {
  country: string;
  code: string; // ISO code for flag
  status: 'compliant' | 'warning' | 'critical';
  score: number;
}