import { 
  Speakers, 
  Speech, 
  DICTIONARY_TARGET_SPEECH_TOPICS, 
} from '../models/Speech';

export interface SpeechEvaluationServiceOptions {
  targetYear: number,
  targetTopic: DICTIONARY_TARGET_SPEECH_TOPICS,
  isSearchingMinimum: boolean,
}

export const defaultOptions: SpeechEvaluationServiceOptions = {
  targetYear: 2013,
  targetTopic: DICTIONARY_TARGET_SPEECH_TOPICS.INTERNAL_SECURITY,
  isSearchingMinimum: true,
};

export class SpeechEvaluationService {
  constructor () {
  }

  static getByMostSpeechesFromSpecialYear (speakers: Speakers, targetyear = defaultOptions.targetYear) {
    if (!Object.values(speakers).length) return null;

    const candidateEntry = Object.entries(speakers)
      .filter(([_, speeches]) => {
        return speeches.some(speech => {
          return new Date(speech.date).getFullYear() === targetyear
        })
      })
      .sort(([_, a], [__, b]) => {
        return b.length - a.length;
      })[0];

      return candidateEntry ? candidateEntry[0] : null; 
  }

  static getByMostPublicTopic (speakers: Speakers, targetTopic = defaultOptions.targetTopic) {
    if (!Object.values(speakers).length) return null;

    const getByTopic = (arr: Speech[]) => {
      return arr.reduce((acc, curr) => {
        acc = curr.topic === targetTopic ? acc += 1 : acc;
        
        return acc;
      }, 0);
    };

    const candidateEntry = Object.entries(speakers)
      .filter(([_, speeches]) => {
        return speeches.some(({ topic }) => topic === targetTopic);
      })
      .sort(([_, a], [__, b]) => {
        const aTopicsCount = getByTopic(a);
        const bTopicsCount = getByTopic(b);

        return bTopicsCount - aTopicsCount;
      })[0];
    
    return candidateEntry ? candidateEntry[0] : null;
  }

  static getByWordsCount (speakers: Speakers, isSearchingMinimum = defaultOptions.isSearchingMinimum) {
    if (!Object.values(speakers).length) return null;

    const getWordsCount = (arr: Speech[]): number => {
      return arr.reduce((acc, curr) => acc += curr.words, 0); 
    };

    return Object.entries(speakers).sort(([_, a], [__, b]) => {
      const aCurrWordsCount = getWordsCount(a); 
      const bCurrWordsCount = getWordsCount(b); 
      
      return isSearchingMinimum 
        ? aCurrWordsCount - bCurrWordsCount 
        : bCurrWordsCount - aCurrWordsCount;
    })[0][0];
  } 
}
