// Static chrome text (buttons, labels, generic messages) that isn't part of
// any island's content. Read through the same `t()` helper as content data
// so components never need two different translation APIs.
export const uiStrings = {
  gameTitle: { vi: 'Chinh phục em, nhầm!! Chinh phục thử thách đê', en: 'Challenge for you muahaha' },
  gameSubtitle: {
    vi: 'Lụm nhẹ 5 cái đảo, mỗi đảo có những thử thách cho em á kkk, chinh phục đuợc quà nha!',
    en: 'Smash through 5 islands, crush every challenge, and drag that missing Compass back home.',
  },
  newVoyage: { vi: 'Hành Trình Mới', en: 'New Voyage' },
  continueVoyage: { vi: 'Tiếp Tục Hành Trình', en: 'Continue Voyage' },
  resetProgress: { vi: 'Đặt lại tiến trình', en: 'Reset progress' },

  // Title screen loading overlay — cycled while the intro scene loads.
  loadingFlavor1: { vi: 'Đang giong buồm...', en: 'Hoisting the sails...' },
  loadingFlavor2: { vi: 'Đang mở la bàn...', en: 'Unfolding the compass...' },
  loadingFlavor3: { vi: 'Đang dựng cột buồm...', en: 'Raising the mast...' },
  loadingFlavor4: { vi: 'Đang vẽ lại hải đồ...', en: 'Charting the seas...' },

  nameEntryTitle: { vi: 'Tên gì? Khai mau!', en: 'Name? Spit it out!' },
  nameEntrySubtitle: {
    vi: 'Trước khi lên thuyền thì khai tên ra đã, đừng có giấu giếm.',
    en: "Before we set sail, cough up your name — no hiding.",
  },
  nameEntryPlaceholder: { vi: 'Gõ tên vô đây...', en: 'Type your name already...' },
  nameEntryButton: { vi: 'Tiếp Tục', en: 'Continue' },
  // Shown when the entered name doesn't match isHienName() — see utils/secretMode.js
  nameEntryRejected: {
    vi: 'Không phải An Hiền thì vô đây làm cái gì? Game này không tiếp người lạ, lượn nha!',
    en: "If you're not An Hiền, what are you doing here? This game's not for strangers — go on, shoo!",
  },

  // Identity-check quiz, shown right after a successful name entry.
  verifyTitle: { vi: 'Xác Minh Danh Tính', en: 'Identity Check' },
  verifyBirthdayQuestion: { vi: 'Chắc là An Hiền thật không đấy? Sinh ngày mấy, khai mau!', en: "You sure you're really An Hiền? Spit out your birthday!" },
  verifyNumerologyQuestion: { vi: 'Thần số học số mấy, nói lẹ lên.', en: "What's your numerology number — hurry up." },
  verifyRelationshipQuestion: { vi: 'Dạo này có đang quen người nào lạ không?', en: 'Been getting close to anyone new lately?' },
  verifyRelationshipYes: { vi: 'Có', en: 'Yes' },
  verifyRelationshipNo: { vi: 'Không', en: 'No' },
  verifyRelationshipYesResponse: { vi: 'Hê, biết ngay mà!', en: 'Ha, knew it!' },
  verifyRelationshipNoResponse: { vi: 'Ế dữ vậy, thảm ghê đó...', en: "Damn, still single? Rough..." },

  greetingTitle: { vi: 'Chào', en: 'Hi' }, // rendered as "{greetingTitle} {playerName}!"
  greetingBody: {
    vi: 'Chào mừng tới Hành Trình Khám Phá. Phía trước có 5 hòn đảo với cả đống thử thách đang đợi, đừng có than mệt giữa chừng đó.',
    en: "Welcome to Voyage of Discovery. Ahead of you are 5 islands loaded with challenges — don't you dare whine about being tired halfway through.",
  },
  // Only shown when secretModeUnlocked (playerName === "Hiền") — see utils/secretMode.js
  secretGreetingTease: {
    vi: 'À mà này... "Hiền" mà bày đặt thích phiêu lưu vậy à? Coi you có "hiền" nổi hết cả hành trình này không kkk!',
    en: '...wait, "Hiền" out here acting all adventurous? Let\'s see if you can stay "gentle" through the whole damn voyage!',
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
    vi: 'chịu khai bí mật ra rồi đó. Đường phía trước rõ hơn chút, đi tiếp lẹ lên.',
    en: "spilled its secret. The way onward's a bit clearer now — keep moving.",
  },
  islandRevisitMessage: {
    vi: 'Bí mật chỗ này khui banh rồi, khỏi mò lại cho mệt.',
    en: "You already cracked this island's secret — quit poking around.",
  },

  fragmentFoundTitle: { vi: 'Đã Tìm Thấy Mảnh La Bàn', en: 'Compass Fragment Found' },

  answerPlaceholder: { vi: 'Nhập câu trả lời...', en: 'Type your answer...' },
  answerButton: { vi: 'Trả Lời', en: 'Answer' },
  openAnswerPlaceholder: { vi: 'Nghĩ gì thì gõ đó...', en: 'Whatever comes to mind...' },
  openAnswerButton: { vi: 'Chia Sẻ', en: 'Share' },
  openAnswerRequired: { vi: 'Câu này bắt buộc trả lời, không bỏ qua được đâu.', en: "This one's mandatory — no skipping." },
  openAnswerTooShort: { vi: 'Ngắn quá, viết thêm chút nữa đi.', en: "Too short — write a bit more." },
  checkButton: { vi: 'Kiểm Tra', en: 'Check' },
  hintPrompt: { vi: 'Bí á? Đoán trật một phát là có gợi ý liền, khỏi kêu ca.', en: "Stuck? Guess wrong once and a hint shows up — stop whining." },
  skipQuestion: { vi: 'Không biết thì thôi, bỏ qua luôn cho lẹ.', en: "Don't know? Just skip it already." },
  resetSelectionHint: {
    vi: 'Chọn một bên trái và một bên phải để ghép cặp.',
    en: 'Pick one from each side to try a match.',
  },
  observationPrompt: {
    vi: 'Lẹ lên, tìm cái khác biệt trước khi hết giờ, đừng có lề mề!',
    en: "Hurry up, find the odd one out before time's up — quit dawdling!",
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
    vi: 'Từ này tao chưa nghe qua bao giờ, kiếm từ khác đi.',
    en: "Never heard that word in my life — try another.",
  },
  wordChainWrongStart: { vi: 'Từ phải bắt đầu đúng tiếng yêu cầu.', en: 'The word must start with the required syllable.' },
  wordChainUsed: { vi: 'Từ này xài rồi, lặp lại làm gì, kiếm từ khác đi.', en: "Already used that one — quit repeating, pick another." },
  wordChainNeedsTwoSyllables: { vi: 'Hãy nhập một từ có đúng 2 tiếng.', en: 'Enter a word with exactly 2 syllables.' },
  wordChainAiStuck: {
    vi: 'Tao chịu thua lượt này! Ra từ mới đi rồi tính tiếp.',
    en: "I'm stuck this round! Throw out a new word so we can keep going.",
  },

  endingTitle: { vi: 'Hành Trình Đã Hoàn Tất', en: 'The Voyage is Complete' },
  endingSubtitle: {
    vi: 'Ngon, cân hết mọi thử thách và đem được chiếc La Bàn Khám Phá về rồi đó.',
    en: "Nice — you crushed every challenge and dragged the Compass of Discovery back.",
  },
  playAgain: { vi: 'Chơi Lại', en: 'Play Again' },

  sailingTo: { vi: 'Đang chèo thuyền tới', en: 'Sailing to' },
  skip: { vi: 'Bỏ Qua', en: 'Skip' },
  next: { vi: 'Tiếp', en: 'Next' },
}
