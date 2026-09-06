// Island 4 — "Những Điều Nhỏ Xíu" (Little Things) content. Same `{ vi, en }`
// pattern as quizAssets.js. Each round is a light, low-stakes guess about a
// small preference (home vs. out, sea vs. mountain, ...) — the player just
// taps ĐÚNG/SAI, and `recap(isTrue)` turns that answer into a sentence Island
// 5 can play back later.
export const island4Copy = {
  eyebrow: { vi: 'ĐẢO 4', en: 'ISLAND 4' },
  title: { vi: 'Những Điều Nhỏ Xíu', en: 'Little Things' },

  approachLines: [
    { vi: 'Lần này...', en: 'This time...' },
    { vi: 'Em không cần trả lời gì cả.', en: "You don't need to answer anything." },
    { vi: 'Để anh thử đoán vài điều nhỏ về em.', en: 'Let me try to guess a few little things about you.' },
  ],
  approachLinesSecret: { vi: 'Đoán trúng hay trật cũng được, An Hiền — vui là chính kkk!', en: "Right or wrong, it's fine, An Hiền — it's just for fun kkk!" },

  startButton: { vi: 'BẮT ĐẦU', en: 'START' },
  skipHint: { vi: 'Nhấn để bỏ qua', en: 'Click to skip' },

  aiIntro: [
    { vi: 'Được rồi.', en: 'Alright.' },
    { vi: 'Mỗi lượt anh sẽ đoán một điều nhỏ về em.', en: "Each round I'll guess one little thing about you." },
    { vi: 'Em chỉ cần nói ĐÚNG hay SAI thôi.', en: 'You just tell me TRUE or FALSE.' },
    { vi: 'Không có điểm số nào quan trọng cả — chỉ là để anh hiểu em hơn thôi.', en: "No score really matters here — it's just so I understand you a little better." },
  ],

  predictionHeader: { vi: 'ANH ĐOÁN LÀ...', en: 'I GUESS THAT...' },
  trueLabel: { vi: 'ĐÚNG', en: 'TRUE' },
  falseLabel: { vi: 'SAI', en: 'FALSE' },

  aiScoreLabel: { vi: 'ANH ĐOÁN TRÚNG', en: 'I GUESSED RIGHT' },
  playerScoreLabel: { vi: 'EM BẤT NGỜ ANH', en: 'YOU SURPRISED ME' },

  finalRoundIntro: [
    { vi: 'Được rồi.', en: 'Alright.' },
    { vi: 'Điều cuối cùng.', en: 'One last thing.' },
    { vi: 'Lần này anh chỉ đoán theo cảm giác thôi.', en: "This time I'm just going with my gut." },
  ],

  resultsTitle: { vi: 'MỘT CHÚT VỀ EM', en: 'A LITTLE ABOUT YOU' },
  aiGuessedLabel: { vi: 'ANH ĐOÁN TRÚNG', en: 'I GUESSED RIGHT' },
  playerFooledLabel: { vi: 'EM LÀM ANH BẤT NGỜ', en: 'YOU SURPRISED ME' },
  timesSuffix: { vi: 'LẦN', en: 'TIMES' },

  aiWinsLines: [
    { vi: 'Thấy chưa.', en: 'See?' },
    { vi: 'Anh để ý em nhiều hơn em nghĩ đó.', en: "I notice you more than you think." },
  ],
  playerWinsLines: [
    { vi: 'Ồ.', en: 'Oh.' },
    { vi: 'Em vẫn còn nhiều điều anh chưa biết hết.', en: "There's still plenty about you I don't know yet." },
  ],
  tieLines: [
    { vi: 'Cũng hay.', en: 'Fair enough.' },
    { vi: 'Mình vẫn đang tìm hiểu nhau từng chút một.', en: "We're still learning each other, one little bit at a time." },
  ],

  continueButton: { vi: 'ĐI TIẾP', en: 'CONTINUE' },

  teaserLines: [
    { vi: 'Nhưng...', en: 'But...' },
    { vi: 'Có một thứ anh không cần đoán.', en: "There's one thing I don't need to guess." },
  ],
  teaserLines2: [
    { vi: 'Đảo tiếp theo.', en: 'The next island.' },
    { vi: 'Không phải để chơi nữa đâu.', en: "It's not really for playing anymore." },
  ],
  island5Label: { vi: 'ĐẢO 5', en: 'ISLAND 5' },
}

// Short reaction pools, keyed by what just happened. `wrongStreak` fires
// once the guess has whiffed 2+ times in a row, `correctStreak` once it's
// nailed 3+ in a row.
export const AI_GUESS_REACTIONS = {
  correct: [
    { vi: 'Biết ngay mà.', en: 'Knew it.' },
    { vi: 'Anh hiểu em thêm chút rồi.', en: "I understand you a little better now." },
    { vi: 'Thấy chưa?', en: 'See?' },
  ],
  wrong: [
    { vi: 'Ồ.', en: 'Oh.' },
    { vi: 'Em làm anh bất ngờ đó.', en: 'You surprised me there.' },
    { vi: 'Để anh đoán lại nha.', en: "Let me guess again." },
  ],
  wrongStreak: [
    { vi: 'Khoan.', en: 'Wait.' },
    { vi: 'Em đang chọc anh đúng không 😏', en: "You're messing with me, aren't you 😏" },
  ],
  correctStreak: [
    { vi: 'Ơ hay.', en: 'Huh.' },
    { vi: 'Sao anh đoán trúng hoài vậy ta.', en: "How am I guessing right so much." },
  ],
  thinking: [
    { vi: 'Hmm...', en: 'Hmm...' },
    { vi: 'Để anh nghĩ xíu...', en: "Let me think a second..." },
    { vi: 'Khoan đã...', en: 'Wait a second...' },
    { vi: 'Ừm...', en: 'Um...' },
  ],
}

// Each round is a light either/or guess. `getText` returns the on-screen
// prediction line; `recap(isTrue)` turns the player's ĐÚNG/SAI answer into a
// short sentence Island 5 plays back in its recap. Round 7 is a pure playful
// meta-beat (no real preference), so it has no `recap`.
export const ROUND_DEFS = [
  {
    round: 1,
    icon: '🏠',
    thinkingLine: { vi: 'Khởi động nhẹ nhé.', en: "Let's warm up a little." },
    getText: () => ({ vi: 'Anh đoán là... em thích ở nhà hơn ra ngoài.', en: 'I guess... you prefer staying home over going out.' }),
    recap: (isTrue) =>
      isTrue
        ? { vi: 'Em thích ở nhà hơn.', en: 'You prefer staying home.' }
        : { vi: 'Em thích ra ngoài hơn.', en: 'You prefer going out.' },
  },
  {
    round: 2,
    icon: '🌊',
    getText: () => ({ vi: 'Anh đoán là... em thích biển hơn núi.', en: 'I guess... you like the sea more than the mountains.' }),
    recap: (isTrue) =>
      isTrue
        ? { vi: 'Em thích biển hơn.', en: 'You like the sea more.' }
        : { vi: 'Em thích núi hơn.', en: 'You like the mountains more.' },
  },
  {
    round: 3,
    icon: '🍜',
    getText: () => ({ vi: 'Anh đoán là... em thích ăn ngon hơn là xem phim.', en: 'I guess... you\'d rather eat well than watch a movie.' }),
    recap: (isTrue) =>
      isTrue
        ? { vi: 'Em thích ăn ngon hơn.', en: "You'd rather eat well." }
        : { vi: 'Em thích xem phim hơn.', en: "You'd rather watch a movie." },
  },
  {
    round: 4,
    icon: '🤗',
    getText: () => ({ vi: 'Anh đoán là... em thích được ôm hơn nắm tay.', en: 'I guess... you like hugs more than holding hands.' }),
    recap: (isTrue) =>
      isTrue
        ? { vi: 'Em thích những cái ôm.', en: 'You like hugs.' }
        : { vi: 'Em thích nắm tay hơn.', en: 'You like holding hands more.' },
  },
  {
    round: 5,
    icon: '🌙',
    getText: () => ({ vi: 'Anh đoán là... em là người của buổi tối hơn buổi sáng.', en: 'I guess... you\'re more of a night person than a morning one.' }),
    recap: (isTrue) =>
      isTrue
        ? { vi: 'Em thích những buổi tối.', en: 'You like the evenings.' }
        : { vi: 'Em là người của buổi sáng.', en: 'You\'re a morning person.' },
  },
  {
    round: 6,
    icon: '💬',
    getText: () => ({ vi: 'Anh đoán là... em thích nhắn tin hơn gọi điện.', en: 'I guess... you prefer texting over calling.' }),
    recap: (isTrue) =>
      isTrue
        ? { vi: 'Em thích nhắn tin hơn.', en: 'You prefer texting.' }
        : { vi: 'Em thích gọi điện hơn.', en: 'You prefer calling.' },
  },
  {
    round: 7,
    icon: '🎯',
    special: 'meta',
    getText: () => ({ vi: 'Và... anh đoán là em sẽ bấm ĐÚNG cho câu này.', en: "And... I guess you'll press TRUE on this one." }),
    recap: null,
  },
]
