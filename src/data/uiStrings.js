// Static chrome text (buttons, labels, generic messages) that isn't part of
// any island's content. Read through the same `t()` helper as content data
// so components never need two different translation APIs.
export const uiStrings = {
  gameTitle: { vi: 'Hành Trình Khám Phá', en: 'Voyage of Discovery' },
  gameSubtitle: {
    vi: 'Vượt qua 5 hòn đảo, chinh phục từng thử thách, và khám phá chiếc La Bàn đã thất lạc.',
    en: 'Cross 5 islands, conquer every challenge, and uncover the lost Compass.',
  },
  newVoyage: { vi: 'Hành Trình Mới', en: 'New Voyage' },
  continueVoyage: { vi: 'Tiếp Tục Hành Trình', en: 'Continue Voyage' },
  resetProgress: { vi: 'Đặt lại tiến trình', en: 'Reset progress' },

  // Title screen loading overlay — cycled while the intro scene loads.
  loadingFlavor1: { vi: 'Đang giong buồm...', en: 'Hoisting the sails...' },
  loadingFlavor2: { vi: 'Đang mở la bàn...', en: 'Unfolding the compass...' },
  loadingFlavor3: { vi: 'Đang dựng cột buồm...', en: 'Raising the mast...' },
  loadingFlavor4: { vi: 'Đang vẽ lại hải đồ...', en: 'Charting the seas...' },

  nameEntryTitle: { vi: 'Bạn tên là gì?', en: "What's your name?" },
  nameEntrySubtitle: {
    vi: 'Trước khi lên thuyền, hãy cho tôi biết nên gọi bạn là gì.',
    en: 'Before we set sail, tell me what to call you.',
  },
  nameEntryPlaceholder: { vi: 'Nhập tên của bạn...', en: 'Enter your name...' },
  nameEntryButton: { vi: 'Tiếp Tục', en: 'Continue' },
  // Shown when the entered name doesn't match isHienName() — see utils/secretMode.js
  nameEntryRejected: {
    vi: 'Ơ, không phải An Hiền thì vô đây làm gì? Game này đóng cửa với người lạ, out ngay đi nha!',
    en: "Hey, if you're not An Hiền, what are you doing here? This game's closed to strangers — scram!",
  },

  // Identity-check quiz, shown right after a successful name entry.
  verifyTitle: { vi: 'Xác Minh Danh Tính', en: 'Identity Check' },
  verifyBirthdayQuestion: { vi: 'Bạn chắc là An Hiền? Vậy bạn sinh ngày mấy?', en: "You sure you're An Hiền? So what's your birthday?" },
  verifyNumerologyQuestion: { vi: 'Vậy bạn thần số học số mấy?', en: "So, what's your numerology number?" },
  verifyRelationshipQuestion: { vi: 'Bạn có đang quen ai không?', en: 'Are you seeing anyone right now?' },
  verifyRelationshipYes: { vi: 'Có', en: 'Yes' },
  verifyRelationshipNo: { vi: 'Không', en: 'No' },
  verifyRelationshipYesResponse: { vi: 'Haha, mình cũng nghĩ vậy đó!', en: 'Haha, I thought so too!' },
  verifyRelationshipNoResponse: { vi: 'Vậy bạn làm mình buồn nhiều rồi đó...', en: 'Well, that makes me a little sad...' },

  greetingTitle: { vi: 'Chào', en: 'Hi' }, // rendered as "{greetingTitle} {playerName}!"
  greetingBody: {
    vi: 'Chào mừng bạn đến với Hành Trình Khám Phá. Phía trước là 5 hòn đảo với những thử thách đang chờ bạn chinh phục.',
    en: 'Welcome to Voyage of Discovery. Ahead of you lie 5 islands, each with a challenge waiting to be conquered.',
  },
  // Only shown when secretModeUnlocked (playerName === "Hiền") — see utils/secretMode.js
  secretGreetingTease: {
    vi: 'À mà này... "Hiền" mà lại thích phiêu lưu thế này à? Để xem lần này có "hiền" nổi hết cả hành trình không nhé!',
    en: '...wait, "Hiền" out here chasing adventures? Let\'s see if you can stay "gentle" through the whole voyage!',
  },
  startJourney: { vi: 'Bắt Đầu Hành Trình', en: 'Start the Journey' },

  levelLabel: { vi: 'Level', en: 'Level' },

  compassFragments: { vi: 'Mảnh La Bàn', en: 'Compass Fragments' },
  fragmentUnknown: { vi: '???', en: '???' },
  awaitsOnIsland: { vi: 'Đang chờ đâu đó trên', en: 'Waits somewhere on' },

  achievementsTitle: { vi: 'Thành Tựu', en: 'Achievements' },
  achievementUnlocked: { vi: 'Mở Khóa Thành Tựu', en: 'Achievement Unlocked' },

  continueLabel: { vi: 'Tiếp Tục', en: 'Continue' },
  returnToShip: { vi: 'Quay Về Thuyền', en: 'Return to Ship' },
  islandCompleteMessage: {
    vi: 'đã hé lộ bí mật của mình. Con đường phía trước đã rõ ràng hơn rồi.',
    en: 'has given up its secret. The way onward is a little clearer now.',
  },
  islandRevisitMessage: {
    vi: 'Bạn đã khám phá bí mật của hòn đảo này rồi.',
    en: "You've already charted this island's secret.",
  },

  fragmentFoundTitle: { vi: 'Đã Tìm Thấy Mảnh La Bàn', en: 'Compass Fragment Found' },

  answerPlaceholder: { vi: 'Nhập câu trả lời...', en: 'Type your answer...' },
  answerButton: { vi: 'Trả Lời', en: 'Answer' },
  checkButton: { vi: 'Kiểm Tra', en: 'Check' },
  hintPrompt: { vi: 'Bí quá? Gợi ý sẽ xuất hiện sau khi đoán sai.', en: 'Stuck? A hint appears after a wrong guess.' },
  skipQuestion: { vi: 'Chưa biết? Bỏ qua câu này', en: "Don't know? Skip this question" },
  resetSelectionHint: {
    vi: 'Chọn một bên trái và một bên phải để ghép cặp.',
    en: 'Pick one from each side to try a match.',
  },
  observationPrompt: {
    vi: 'Tìm biểu tượng khác biệt trước khi hết giờ!',
    en: 'Find the odd one out before time runs out!',
  },

  // Word-chain lesson
  wordChainInputPlaceholder: { vi: 'Nhập một từ có 2 tiếng...', en: 'Enter a 2-syllable word...' },
  wordChainSubmit: { vi: 'Nối Từ', en: 'Chain It' },
  wordChainProgress: { vi: 'Đã nối đúng', en: 'Correct chains' },
  wordChainAiThinking: { vi: 'Máy đang nghĩ...', en: 'The AI is thinking...' },
  wordChainAiTurn: { vi: 'Lượt của máy', en: "AI's turn" },
  wordChainYourTurn: { vi: 'Lượt của bạn', en: 'Your turn' },
  wordChainNeedsSyllable: { vi: 'Từ tiếp theo phải bắt đầu bằng', en: 'The next word must start with' },
  wordChainUnknown: {
    vi: 'Từ này chưa có trong vốn từ của tôi, thử từ khác nhé.',
    en: "That word isn't in my vocabulary yet — try another.",
  },
  wordChainWrongStart: { vi: 'Từ phải bắt đầu đúng tiếng yêu cầu.', en: 'The word must start with the required syllable.' },
  wordChainUsed: { vi: 'Từ này đã dùng rồi, thử từ khác nhé.', en: "That word's already been used — try another." },
  wordChainNeedsTwoSyllables: { vi: 'Hãy nhập một từ có đúng 2 tiếng.', en: 'Enter a word with exactly 2 syllables.' },
  wordChainAiStuck: {
    vi: 'Máy chịu thua lượt này! Bạn ra một từ mới để tiếp tục nhé.',
    en: "The AI is stuck this round! Start a fresh word to keep going.",
  },

  endingTitle: { vi: 'Hành Trình Đã Hoàn Tất', en: 'The Voyage is Complete' },
  endingSubtitle: {
    vi: 'Chúc mừng bạn đã vượt qua tất cả thử thách và tìm lại được chiếc La Bàn Khám Phá.',
    en: "Congratulations — you've conquered every challenge and recovered the Compass of Discovery.",
  },
  playAgain: { vi: 'Chơi Lại', en: 'Play Again' },

  sailingTo: { vi: 'Đang chèo thuyền tới', en: 'Sailing to' },
  skip: { vi: 'Bỏ Qua', en: 'Skip' },
  next: { vi: 'Tiếp', en: 'Next' },
}
