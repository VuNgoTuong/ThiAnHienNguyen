// Island 4 — "AI Đoán Bạn" (AI Guesses You) content. Same `{ vi, en }`
// pattern as quizAssets.js. The AI never truly analyzes anything — every
// round pulls a short, semi-random line plus a prediction that leans on
// `state.island3Result` when it exists (see utils/predictionEngine.js) and
// falls back to a playful, ungrounded guess when it doesn't.
export const island4Copy = {
  eyebrow: { vi: 'ĐẢO 4', en: 'ISLAND 4' },
  title: { vi: 'AI Room', en: 'The AI Room' },

  approachLines: [
    { vi: 'Lần này...', en: 'This time...' },
    { vi: 'Bạn không trả lời.', en: "You're not the one answering." },
    { vi: 'Để tôi thử đoán.', en: 'Let me try to guess.' },
  ],
  approachLinesSecret: { vi: 'Đừng lo, Hiền — dù đoán trật anh vẫn thương em y vậy.', en: "Don't worry, Hiền — even if I guess wrong, anh adores you just the same." },

  startButton: { vi: 'BẮT ĐẦU', en: 'START' },
  skipHint: { vi: 'Nhấn để bỏ qua', en: 'Click to skip' },

  aiIntro: [
    { vi: 'Được rồi.', en: 'Alright.' },
    { vi: 'Lần này tôi sẽ đoán về bạn.', en: "This time I'll guess about you." },
    { vi: 'Mỗi lượt tôi đưa ra một dự đoán.', en: "Each round I'll make a prediction." },
    { vi: 'Bạn chỉ cần nói nó ĐÚNG hay SAI.', en: 'You just tell me if it\'s TRUE or FALSE.' },
  ],

  predictionHeader: { vi: 'TÔI ĐOÁN RẰNG...', en: 'I PREDICT THAT...' },
  trueLabel: { vi: 'ĐÚNG', en: 'TRUE' },
  falseLabel: { vi: 'SAI', en: 'FALSE' },

  aiScoreLabel: { vi: 'AI', en: 'AI' },
  playerScoreLabel: { vi: 'BẠN', en: 'YOU' },

  finalRoundIntro: [
    { vi: 'Được rồi.', en: 'Alright.' },
    { vi: 'Round cuối.', en: 'Last round.' },
    { vi: 'Lần này tôi sẽ không dựa vào điểm số.', en: "This time I won't rely on the score." },
    { vi: 'Tôi chỉ đoán.', en: "I'll just guess." },
  ],

  resultsTitle: { vi: 'KẾT QUẢ', en: 'RESULTS' },
  aiGuessedLabel: { vi: 'AI ĐÃ ĐOÁN', en: 'AI GUESSED' },
  playerFooledLabel: { vi: 'BẠN ĐÃ ĐÁNH LỪA AI', en: 'YOU FOOLED THE AI' },
  timesSuffix: { vi: 'LẦN', en: 'TIMES' },

  aiWinsLines: [
    { vi: 'Được rồi...', en: 'Alright...' },
    { vi: 'Tôi hiểu bạn hơn một chút rồi.', en: 'I understand you a little better now.' },
  ],
  playerWinsLines: [
    { vi: 'Ồ.', en: 'Oh.' },
    { vi: 'Bạn khó đoán hơn tôi nghĩ.', en: "You're harder to guess than I thought." },
  ],
  tieLines: [
    { vi: 'Không ai thắng.', en: 'No one wins.' },
    { vi: 'Khá công bằng.', en: "That's fair enough." },
  ],

  continueButton: { vi: 'ĐI TIẾP', en: 'CONTINUE' },

  teaserLines: [
    { vi: 'Nhưng...', en: 'But...' },
    { vi: 'Có một thứ tôi không đoán được.', en: "There's one thing I can't guess." },
  ],
  teaserLines2: [
    { vi: 'Đảo tiếp theo.', en: 'The next island.' },
    { vi: 'Bạn sẽ chọn gì?', en: 'What will you choose?' },
  ],
  island5Label: { vi: 'ĐẢO 5', en: 'ISLAND 5' },
}

// Short reaction pools, keyed by what just happened. `wrongStreak` fires
// once the AI has whiffed 2+ predictions in a row, `correctStreak` once it's
// nailed 3+ in a row — both override the plain correct/wrong pool for that
// beat so the AI's "personality" reads as reactive, not just randomized.
export const AI_GUESS_REACTIONS = {
  correct: [
    { vi: 'Biết ngay.', en: 'Knew it.' },
    { vi: 'Tôi bắt đầu hiểu bạn rồi.', en: "I'm starting to understand you." },
    { vi: 'Thấy chưa?', en: 'See?' },
  ],
  wrong: [
    { vi: 'Ồ.', en: 'Oh.' },
    { vi: 'Bạn làm tôi bất ngờ.', en: 'You surprised me.' },
    { vi: 'Được rồi... tôi cần suy nghĩ lại.', en: 'Alright... I need to rethink this.' },
  ],
  wrongStreak: [
    { vi: 'Khoan.', en: 'Wait.' },
    { vi: 'Bạn đang cố tình đánh lừa tôi đúng không?', en: "You're doing this on purpose, aren't you?" },
  ],
  correctStreak: [
    { vi: 'Không ổn rồi.', en: "This isn't good." },
    { vi: 'Tôi đang đoán đúng quá nhiều.', en: "I'm guessing right way too often." },
  ],
  thinking: [
    { vi: 'Hmm...', en: 'Hmm...' },
    { vi: 'Để xem nào...', en: 'Let\'s see...' },
    { vi: 'Khoan đã...', en: 'Wait a second...' },
    { vi: 'Ừm...', en: 'Um...' },
  ],
}

// Each round's `getText(profile)` picks a prediction sentence: a
// data-grounded one when `profile.hasIsland3Data` is true, and a fallback
// otherwise. `thinkingLine` overrides the random `thinking` pool for beats
// that need a specific line (spec's Round 1 opener, Round 7's meta-guess).
export const ROUND_DEFS = [
  {
    round: 1,
    icon: '🖼️',
    thinkingLine: { vi: 'Khởi động nhẹ nhé.', en: "Let's warm up a little." },
    getText: (profile) => {
      if (profile.hasIsland3Data && profile.imageAccuracy != null && profile.imageAccuracy < 0.5) {
        return { vi: 'Bạn để ý chữ nhiều hơn là hình ảnh.', en: 'You pay more attention to text than pictures.' }
      }
      return { vi: 'Bạn thích những câu hỏi có hình ảnh.', en: 'You like questions with pictures.' }
    },
  },
  {
    round: 2,
    icon: '🅰️',
    getText: (profile) => {
      if (!profile.hasIsland3Data) return { vi: 'Bạn có kiểu chọn đáp án riêng của mình.', en: 'You have your own way of picking answers.' }
      return profile.firstOptionRate > 0.5
        ? { vi: 'Bạn thường chọn đáp án đầu tiên.', en: 'You usually pick the first option.' }
        : { vi: 'Bạn ít khi chọn đáp án đầu tiên.', en: 'You rarely pick the first option.' }
    },
  },
  {
    round: 3,
    icon: '💪',
    getText: (profile) => {
      if (!profile.hasIsland3Data) return { vi: 'Bạn khá tự tin khi chơi.', en: 'You seem pretty confident when you play.' }
      return profile.quizAccuracy > 0.75
        ? { vi: 'Bạn khá tự tin khi chơi.', en: 'You seem pretty confident when you play.' }
        : { vi: 'Bạn chơi khá thận trọng.', en: 'You play things pretty carefully.' }
    },
  },
  {
    round: 4,
    icon: '⏱️',
    getText: (profile) => {
      if (!profile.hasIsland3Data) return { vi: 'Bạn thường suy nghĩ khá lâu trước khi chọn.', en: 'You tend to think a while before choosing.' }
      return profile.avgAnswerTimeMs < 6000
        ? { vi: 'Bạn trả lời rất nhanh, gần như không do dự.', en: 'You answer fast, almost without hesitating.' }
        : { vi: 'Bạn thường suy nghĩ khá lâu trước khi chọn.', en: 'You tend to think a while before choosing.' }
    },
  },
  {
    round: 5,
    icon: '🌍',
    getText: (profile) => {
      if (!profile.hasIsland3Data || profile.worldTotal === 0 || profile.animalTotal === 0) {
        return { vi: 'Bạn thích khám phá những điều mới.', en: 'You like exploring new things.' }
      }
      return profile.worldCorrect >= profile.animalCorrect
        ? { vi: 'Bạn thích những câu hỏi về thế giới hơn động vật.', en: 'You like world trivia more than animal questions.' }
        : { vi: 'Bạn giỏi mấy câu về động vật hơn về thế giới.', en: "You're better at animal questions than world trivia." }
    },
  },
  {
    round: 6,
    icon: '🌊',
    // Deliberately ungrounded — the spec's own "vibe" example, kept as a
    // pure playful beat even when real data exists for other rounds.
    getText: () => ({ vi: 'Bạn thích biển.', en: 'You like the ocean.' }),
  },
  {
    round: 7,
    icon: '🎯',
    special: 'meta',
    getText: () => ({ vi: 'Bạn sẽ chọn ĐÚNG.', en: 'You will choose TRUE.' }),
  },
]
