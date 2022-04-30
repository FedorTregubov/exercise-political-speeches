import { SpeechEvaluationService } from './SpeechEvaluationService';
import { speakersMock } from '../mocks/speeches.mock';
import { DICTIONARY_TARGET_SPEECH_TOPICS } from '../models';

const speakersMockCloned = JSON.parse(JSON.stringify(speakersMock));

describe('SpeechEvaluationService', () => {
  describe('SpeechEvaluationService.getByMostSpeechesFromSpecialYear', () => {
    const speakersMockCloned = JSON.parse(JSON.stringify(speakersMock));

    it.concurrent('returns null, if empty obj passed', () => {
      expect(
        SpeechEvaluationService.getByMostSpeechesFromSpecialYear({}),
      ).toBe(null);
    });

    it.concurrent('returns null, if there is no speeches in specified year', () => {
      expect(
        SpeechEvaluationService.getByMostSpeechesFromSpecialYear(speakersMock, 2000),
      ).toBe(null);
    });

    const expectedSpeakerName = 'Alexander Abel';
    it.concurrent(`returns speaker name ${expectedSpeakerName}, if there is most person with most speeches in specified year`, () => {
      expect(
        SpeechEvaluationService.getByMostSpeechesFromSpecialYear(speakersMock),
      ).toBe(expectedSpeakerName);
    });

    it.skip('input obj should be the same after method call', () => { // TODO
      expect(speakersMock).toEqual(speakersMockCloned);
    });
  });

  describe('SpeechEvaluationService.getByMostPublicTopic', () => {
    it.concurrent('returns null, if empty obj passed', () => {
      expect(
        SpeechEvaluationService.getByMostPublicTopic({}, DICTIONARY_TARGET_SPEECH_TOPICS.INTERNAL_SECURITY),
      ).toBe(null);
    });

    it.concurrent('returns null, if there is no speeches in specified topic', () => {
      expect(
        SpeechEvaluationService.getByMostPublicTopic({}, 'bla-bla-bla topic' as DICTIONARY_TARGET_SPEECH_TOPICS),
      ).toBe(null);
    });

    const expectedSpeakerName = 'Alexander Abel';
    it.concurrent(`returns speaker name ${expectedSpeakerName}, if there is most person with speeches in specified topic`, () => {
      expect(
        SpeechEvaluationService.getByMostPublicTopic(speakersMock, DICTIONARY_TARGET_SPEECH_TOPICS.INTERNAL_SECURITY),
      ).toBe(expectedSpeakerName);
    });

    it.skip('input obj should be the same after method call', () => { // TODO
      expect(speakersMock).toEqual(speakersMockCloned);
    });
  });

  describe('SpeechEvaluationService.getByWordsCount', () => {
    it.concurrent('returns null, if empty obj passed', () => {
      expect(
        SpeechEvaluationService.getByWordsCount({}),
      ).toBe(null);
    });

    const expectedLeastWordySpeakerName = 'Bernhard Belling';
    it.concurrent(`returns least wordy person name "${expectedLeastWordySpeakerName}"`, () => {
      expect(
        SpeechEvaluationService.getByWordsCount(speakersMock),
      ).toBe(expectedLeastWordySpeakerName);
    });

    const expectedMostWordySpeakerName = 'Caesare Collins';
    it.concurrent(`returns most wordy person name "${expectedMostWordySpeakerName}"`, () => {
      expect(
        SpeechEvaluationService.getByWordsCount(speakersMock, false),
      ).toBe(expectedMostWordySpeakerName);
    });

    it.skip('input obj should be the same after method call', () => { // TODO
      expect(speakersMock).toEqual(speakersMockCloned);
    });
  });
});
