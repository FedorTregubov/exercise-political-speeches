export enum DICTIONARY_TARGET_SPEECH_TOPICS {
  INTERNAL_SECURITY = 'Internal Security',
  EDUCATION_POLICY = 'Education Policy',
  COAL_SUBSIDIES = 'Coal Subsidies',
}

export interface SpeechInput {
  speaker: string;
  topic: DICTIONARY_TARGET_SPEECH_TOPICS;
  date: Date;
  words: number;
}

export type Speakers = { [key: string]: SpeechModel[] };

export class SpeechModel {
  public topic = '';
  public date!: Date;
  public words!: number;

  constructor (model: SpeechInput) {
    this.topic = model.topic;
    this.date = model.date;
    this.words = model.words;
  }
}

export interface SpeechesEvaluationResponse {
  mostSpeeches: null | string;
  mostSecurity: null | string;
  leastWordy: null | string;
}
