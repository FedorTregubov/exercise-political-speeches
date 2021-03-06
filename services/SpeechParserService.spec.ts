import { SpeechParserService, DICTIONARY_SPEECH_PARSER_SERVICE_ERRORS } from './SpeechParserService';
import { speakersMock, speakersMockSingleFile } from '../mocks/speakers.mock';

describe('SpeechParserService', () => {
  it.concurrent('returns empty object, if empty array passed',  () => {
    const speechParserService = new SpeechParserService([]);

    speechParserService.run().then((speakers) => {
      expect(speakers).toEqual({});
    });
  });

  it.concurrent('throws exception, if there is some error in the input file', () => {
    const speechParserService = new SpeechParserService(['./mocks/speeches-1.mock.csv']);

    speechParserService.run().catch((e) => {
      expect(e.message.trim()).toMatch(DICTIONARY_SPEECH_PARSER_SERVICE_ERRORS.CSV);
    });
  });

  it.concurrent('throws exception, if there is some error in the input URL', () => {
    const speechParserService = new SpeechParserService(['./mocks/speeches-exception.mock.csv']);

    speechParserService.run().catch((e) => {
      expect(e.message.trim()).toMatch(DICTIONARY_SPEECH_PARSER_SERVICE_ERRORS.URL);
    });
  });

  it.concurrent('returns speakers object properly if 1 file passed', () => {
    const speechParserService = new SpeechParserService(['./mocks/speeches-1.mock.csv']);

    speechParserService.run().then((speakers) => {
      expect(speakers).toEqual(speakersMockSingleFile);
    });
  });

  it.concurrent('returns speakers object properly if multiple files passed', () => {
    const speechParserService = new SpeechParserService([
      './mocks/speeches-1.mock.csv',
      './mocks/speeches-2.mock.csv',
    ]);

    speechParserService.run().then((speakers) => {
      expect(speakers).toEqual(speakersMock);
    });
  });
});
