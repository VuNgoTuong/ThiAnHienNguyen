// Island 3 — "Chuyện Của Chúng Ta" (Our Story) content. A short memory quiz
// about the two of you. Every question uses `layout: 'image-options'` (each
// option carries its own emoji, no external image needed) so there's
// nothing to host or swap out — just edit the prompts/options/answers below
// whenever the real memories are ready.
export const quizQuestions = [
  {
    id: 'q1',
    category: '📱',
    layout: 'image-options',
    prompt: { vi: 'Lần đầu tiên chúng ta nói chuyện là khi nào?', en: 'When did we first talk?' },
    options: [
      { id: 'a', emoji: '📱', text: { vi: 'Trên mạng xã hội', en: 'On social media' } },
      { id: 'b', emoji: '👯', text: { vi: 'Qua bạn chung', en: 'Through a mutual friend' } },
      { id: 'c', emoji: '🚶', text: { vi: 'Tình cờ gặp ngoài đời', en: 'Ran into each other' } },
      { id: 'd', emoji: '🎉', text: { vi: 'Ở một sự kiện', en: 'At an event' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q2',
    category: '🍜',
    layout: 'image-options',
    prompt: { vi: 'Món ăn đầu tiên hai đứa ăn cùng nhau là gì?', en: 'What was the first meal we ate together?' },
    options: [
      { id: 'a', emoji: '🧋', text: { vi: 'Trà sữa', en: 'Milk tea' } },
      { id: 'b', emoji: '🍚', text: { vi: 'Cơm', en: 'Rice' } },
      { id: 'c', emoji: '🍲', text: { vi: 'Lẩu', en: 'Hot pot' } },
      { id: 'd', emoji: '🍟', text: { vi: 'Đồ ăn vặt', en: 'Street food' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q3',
    category: '💌',
    layout: 'image-options',
    prompt: { vi: 'Ai là người chủ động nhắn tin trước?', en: 'Who texted first?' },
    options: [
      { id: 'a', emoji: '🙋‍♂️', text: { vi: 'Anh', en: 'Me' } },
      { id: 'b', emoji: '🙋‍♀️', text: { vi: 'Em', en: 'You' } },
      { id: 'c', emoji: '🤝', text: { vi: 'Cả hai cùng lúc', en: 'Both at once' } },
      { id: 'd', emoji: '🤔', text: { vi: 'Không nhớ nữa', en: "Can't remember" } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q4',
    category: '📍',
    layout: 'image-options',
    prompt: { vi: 'Buổi hẹn nào là đáng nhớ nhất?', en: 'Which date was the most memorable?' },
    options: [
      { id: 'a', emoji: '💫', text: { vi: 'Buổi hẹn đầu tiên', en: 'Our first date' } },
      { id: 'b', emoji: '✈️', text: { vi: 'Một chuyến đi xa', en: 'A trip away' } },
      { id: 'c', emoji: '🌙', text: { vi: 'Một buổi tối bình thường', en: 'An ordinary night' } },
      { id: 'd', emoji: '🎂', text: { vi: 'Một dịp đặc biệt', en: 'A special occasion' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q5',
    category: '💬',
    layout: 'image-options',
    prompt: { vi: 'Câu nói nào khiến em nhớ nhất?', en: 'Which line do you remember most?' },
    options: [
      { id: 'a', emoji: '🍚', text: { vi: '"Ăn cơm chưa?"', en: '"Have you eaten?"' } },
      { id: 'b', emoji: '🌙', text: { vi: '"Ngủ ngon nha"', en: '"Sleep well"' } },
      { id: 'c', emoji: '😏', text: { vi: 'Một câu trêu chọc', en: 'A teasing line' } },
      { id: 'd', emoji: '🤍', text: { vi: 'Một lời hứa nhỏ', en: 'A small promise' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q6',
    category: '❤️',
    layout: 'image-options',
    cinematic: true, // last question — presented with extra flourish, see QuizStage
    prompt: {
      vi: 'Và câu hỏi cuối — em còn nhớ cảm giác lần đầu gặp anh không?',
      en: 'And the last one — do you remember how it felt, the first time we met?',
    },
    options: [
      { id: 'a', emoji: '😳', text: { vi: 'Hồi hộp', en: 'Nervous' } },
      { id: 'b', emoji: '😄', text: { vi: 'Vui', en: 'Happy' } },
      { id: 'c', emoji: '😌', text: { vi: 'Bình thường thôi', en: 'Just normal' } },
      { id: 'd', emoji: '🤍', text: { vi: 'Không nhớ rõ, chỉ nhớ là thích', en: "Don't remember exactly, just that I liked it" } },
    ],
    correctOptionId: 'd',
  },
]

export const AI_REACTIONS = {
  correct: [
    { vi: 'Đúng rồi đó!', en: 'That\'s right!' },
    { vi: 'Em nhớ dai ghê.', en: 'You remember well.' },
    { vi: 'Chuẩn không cần chỉnh.', en: 'Exactly.' },
    { vi: 'Giỏi lắm nha.', en: 'Nicely done.' },
  ],
  wrong: [
    { vi: 'Sai rồi nha 😌', en: "Nope 😌" },
    { vi: 'Trớt quớt luôn.', en: 'Way off.' },
    { vi: 'Gần đúng thôi... nhưng chưa đúng.', en: 'Close... but not quite.' },
    { vi: 'Thôi, anh cho em qua 😏', en: "Fine, I'll let you slide 😏" },
  ],
  streak: [
    { vi: 'Đỉnh của chóp.', en: 'On fire.' },
    { vi: 'Nhớ dữ vậy?', en: 'You remember that much?' },
    { vi: 'Ồ...', en: 'Oh...' },
  ],
}

export const COMBO_LABELS = {
  2: '🔥 x2',
  3: '🔥 x3',
  4: '🔥 x4',
  5: '🔥 x5',
  6: '🔥 PERFECT',
}

export const island3Copy = {
  eyebrow: { vi: 'ĐẢO 3', en: 'ISLAND 3' },
  title: { vi: 'Chuyện Của Chúng Ta', en: 'Our Story' },
  aiIntro: [
    { vi: 'Được rồi.', en: 'Alright.' },
    { vi: 'Giờ đến lượt anh hỏi em vài câu.', en: "Now it's my turn to ask you a few things." },
    { vi: 'Không khó đâu.', en: "It's not hard." },
    { vi: 'Chỉ là... đừng đoán bừa nha 😏', en: "Just... don't just guess randomly 😏" },
  ],
  aiIntroSecret: { vi: 'À mà An Hiền... nhớ kỹ vô nha, anh biết hết đó 😏', en: "Oh, and An Hiền... remember carefully, I'll know 😏" },
  startButton: { vi: 'BẮT ĐẦU', en: 'START' },
  endingLines: [
    { vi: 'Xong rồi đó.', en: "That's it." },
    { vi: 'Em nhớ nhiều hơn anh tưởng.', en: 'You remember more than I thought.' },
  ],
  resultsTitle: { vi: 'HOÀN THÀNH', en: 'COMPLETE' },
  scoreHigh: [
    { vi: 'Ồ...', en: 'Oh...' },
    { vi: 'Em nhớ hết luôn à?', en: 'You remember everything?' },
  ],
  scoreMid: [{ vi: 'Cũng không tệ.', en: 'Not bad at all.' }],
  scoreLow: [
    { vi: 'Không sao hết.', en: "It's totally fine." },
    { vi: 'Quan trọng là mình đang nhớ lại cùng nhau.', en: "What matters is we're remembering it together." },
  ],
  scoreGeneric: { vi: 'Dù gì thì cũng vui mà.', en: 'It was fun either way.' },
  continueButton: { vi: 'ĐI TIẾP', en: 'CONTINUE' },
  island4Lines: [
    { vi: 'Giờ đổi vai nha.', en: "Let's switch roles now." },
    { vi: 'Để anh thử đoán về em.', en: 'Let me try to guess about you.' },
  ],
  island4Eyebrow: { vi: 'ĐẢO 4', en: 'ISLAND 4' },
  island4Title: { vi: 'Những Điều Nhỏ Xíu', en: 'Little Things' },
  skipHint: { vi: 'Nhấn để bỏ qua', en: 'Click to skip' },
}
