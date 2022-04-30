import {
  Speakers,
  SpeechModel,
  DICTIONARY_TARGET_SPEECH_TOPICS,
} from '../models';

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

  static getByMostSpeechesFromSpecialYear (speakers: Speakers, targetYear = defaultOptions.targetYear) {
    if (!Object.values(speakers).length) return null;

    const candidateEntry = Object.entries(speakers)
      .filter(([, speeches]) => {
        return speeches.some(speech => {
          return new Date(speech.date).getFullYear() === targetYear;
        });
      })
      .sort(([, a], [, b]) => {
        return b.length - a.length;
      })[0];

      return candidateEntry ? candidateEntry[0] : null;
  }

  static getByMostPublicTopic (speakers: Speakers, targetTopic = defaultOptions.targetTopic) {
    if (!Object.values(speakers).length) return null;

    const getByTopic = (arr: SpeechModel[]) => {
      return arr.reduce((acc, curr) => {
        acc = curr.topic === targetTopic ? acc += 1 : acc;

        return acc;
      }, 0);
    };

    const candidateEntry = Object.entries(speakers)
      .filter(([, speeches]) => {
        return speeches.some(({ topic }) => topic === targetTopic);
      })
      .sort(([, a], [, b]) => {
        const aTopicsCount = getByTopic(a);
        const bTopicsCount = getByTopic(b);

        return bTopicsCount - aTopicsCount;
      })[0];

    return candidateEntry ? candidateEntry[0] : null;
  }

  static getByWordsCount (speakers: Speakers, isSearchingMinimum = defaultOptions.isSearchingMinimum) {
    if (!Object.values(speakers).length) return null;

    const getWordsCount = (arr: SpeechModel[]): number => {
      return arr.reduce((acc, curr) => acc += curr.words, 0);
    };

    return Object.entries(speakers).sort(([, a], [, b]) => {
      const aCurrWordsCount = getWordsCount(a);
      const bCurrWordsCount = getWordsCount(b);

      return isSearchingMinimum
        ? aCurrWordsCount - bCurrWordsCount
        : bCurrWordsCount - aCurrWordsCount;
    })[0][0];
  }
}
