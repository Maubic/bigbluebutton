const MATCH_URL = new RegExp('https?://(\\w+)?[.]?(quizizz.com)(/admin/quiz)?/([-abcdef0-9]+)(/(.*))?');

export class Quizizz {
  static canPlay(url) {
    return MATCH_URL.test(url);
  }

  static getQuizizzId(url) {
    const m = url.match(MATCH_URL);
    return m[4];
  }

  static getAdminUrl(url) {
    const m = url.match(MATCH_URL);
    return `https://quizizz.com/admin/quiz/tp/${m[4]}`;
  }
}

export default Quizizz;
