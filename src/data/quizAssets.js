// Island 3 — Quiz Arena content. All external image URLs live here (never
// hard-coded in JSX) so they're easy to audit/replace later. Every URL is a
// real, verified Wikimedia Commons file via their stable Special:FilePath-
// resolved address (public domain / permissively licensed, no watermark).
// Each image also carries a `fallbackEmoji` — QuizImage (see
// island3/QuizCard.jsx) swaps to it automatically on a load error, so a
// dead link never breaks the quiz.
export const QUIZ_IMAGES = {
  italy: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Italy_map_blank.png',
  horse: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Appaloosa_horse.JPG',
  jupiter: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
  pizza: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
  eiffelTower: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg',
  earthFromSpace: 'https://upload.wikimedia.org/wikipedia/commons/7/78/The_Blue_Marble.jpg',
}

// `layout: 'image-question'` — one big image above 4 plain text option
// cards. `layout: 'image-options'` — no central image, each option card
// carries its own emoji (used for the two "odd one out" questions, exactly
// like the spec's own emoji-illustrated option lists).
export const quizQuestions = [
  {
    id: 'q1',
    category: '🌍',
    layout: 'image-question',
    prompt: { vi: 'Quốc gia nào có hình dạng giống một chiếc ủng?', en: 'Which country is shaped like a boot?' },
    image: { src: QUIZ_IMAGES.italy, fallbackEmoji: '🥾', alt: 'Italy' },
    options: [
      { id: 'a', text: { vi: 'Pháp', en: 'France' } },
      { id: 'b', text: { vi: 'Ý', en: 'Italy' } },
      { id: 'c', text: { vi: 'Hy Lạp', en: 'Greece' } },
      { id: 'd', text: { vi: 'Tây Ban Nha', en: 'Spain' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q2',
    category: '🐘',
    layout: 'image-question',
    prompt: { vi: 'Con vật nào có thể ngủ đứng?', en: 'Which animal can sleep standing up?' },
    image: { src: QUIZ_IMAGES.horse, fallbackEmoji: '🐴', alt: 'Horse' },
    options: [
      { id: 'a', text: { vi: 'Voi', en: 'Elephant' } },
      { id: 'b', text: { vi: 'Cá heo', en: 'Dolphin' } },
      { id: 'c', text: { vi: 'Ngựa', en: 'Horse' } },
      { id: 'd', text: { vi: 'Chim cánh cụt', en: 'Penguin' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q3',
    category: '🌌',
    layout: 'image-question',
    prompt: { vi: 'Hành tinh nào lớn nhất trong Hệ Mặt Trời?', en: 'Which is the largest planet in the Solar System?' },
    image: { src: QUIZ_IMAGES.jupiter, fallbackEmoji: '🪐', alt: 'Jupiter' },
    options: [
      { id: 'a', text: { vi: 'Trái Đất', en: 'Earth' } },
      { id: 'b', text: { vi: 'Sao Hỏa', en: 'Mars' } },
      { id: 'c', text: { vi: 'Sao Mộc', en: 'Jupiter' } },
      { id: 'd', text: { vi: 'Sao Thổ', en: 'Saturn' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q4',
    category: '🍕',
    layout: 'image-question',
    prompt: { vi: 'Món ăn này nổi tiếng đến từ quốc gia nào?', en: 'This famous dish comes from which country?' },
    image: { src: QUIZ_IMAGES.pizza, fallbackEmoji: '🍕', alt: 'Pizza' },
    options: [
      { id: 'a', text: { vi: 'Ý', en: 'Italy' } },
      { id: 'b', text: { vi: 'Nhật Bản', en: 'Japan' } },
      { id: 'c', text: { vi: 'Mexico', en: 'Mexico' } },
      { id: 'd', text: { vi: 'Ấn Độ', en: 'India' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q5',
    category: '🌿',
    layout: 'image-options',
    prompt: { vi: 'Thứ nào KHÔNG thuộc nhóm còn lại?', en: "Which one doesn't belong with the rest?" },
    options: [
      { id: 'a', emoji: '🍎', text: { vi: 'Apple', en: 'Apple' } },
      { id: 'b', emoji: '🍌', text: { vi: 'Banana', en: 'Banana' } },
      { id: 'c', emoji: '🍊', text: { vi: 'Orange', en: 'Orange' } },
      { id: 'd', emoji: '🐘', text: { vi: 'Elephant', en: 'Elephant' } },
    ],
    correctOptionId: 'd',
  },
  {
    id: 'q6',
    category: '🏛️',
    layout: 'image-question',
    prompt: { vi: 'Bạn có nhận ra địa danh này không?', en: 'Do you recognize this landmark?' },
    image: { src: QUIZ_IMAGES.eiffelTower, fallbackEmoji: '🗼', alt: 'Eiffel Tower' },
    options: [
      { id: 'a', text: { vi: 'Paris', en: 'Paris' } },
      { id: 'b', text: { vi: 'Rome', en: 'Rome' } },
      { id: 'c', text: { vi: 'London', en: 'London' } },
      { id: 'd', text: { vi: 'New York', en: 'New York' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q7',
    category: '🧠',
    layout: 'image-question',
    prompt: { vi: 'Đại dương nào lớn nhất thế giới?', en: "Which is the world's largest ocean?" },
    image: { src: QUIZ_IMAGES.earthFromSpace, fallbackEmoji: '🌊', alt: 'Earth from space' },
    options: [
      { id: 'a', text: { vi: 'Đại Tây Dương', en: 'Atlantic Ocean' } },
      { id: 'b', text: { vi: 'Ấn Độ Dương', en: 'Indian Ocean' } },
      { id: 'c', text: { vi: 'Thái Bình Dương', en: 'Pacific Ocean' } },
      { id: 'd', text: { vi: 'Bắc Băng Dương', en: 'Arctic Ocean' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q8',
    category: '🎬',
    layout: 'image-options',
    cinematic: true, // last question — presented with extra flourish, see QuizStage
    prompt: {
      vi: 'Trong những thứ này, thứ nào có thể nhìn thấy trên bầu trời vào ban đêm?',
      en: 'Which of these can you actually see in the night sky?',
    },
    options: [
      { id: 'a', emoji: '🌙', text: { vi: 'Mặt Trăng', en: 'The Moon' } },
      { id: 'b', emoji: '🌊', text: { vi: 'Sóng biển', en: 'Ocean waves' } },
      { id: 'c', emoji: '🌲', text: { vi: 'Cây', en: 'A tree' } },
      { id: 'd', emoji: '🏠', text: { vi: 'Ngôi nhà', en: 'A house' } },
    ],
    correctOptionId: 'a',
  },
]

export const AI_REACTIONS = {
  correct: [
    { vi: 'Đúng rồi!', en: 'Right!' },
    { vi: 'Nhanh vậy?', en: 'That fast?' },
    { vi: 'Chính xác.', en: 'Exactly.' },
    { vi: 'Bạn biết nhiều đấy.', en: 'You know your stuff.' },
  ],
  wrong: [
    { vi: 'Không phải rồi 😂', en: "Nope 😂" },
    { vi: 'Suýt nữa.', en: 'So close.' },
    { vi: 'Không sao.', en: "It's fine." },
    { vi: 'Ồ, câu này khó hơn một chút.', en: 'Ooh, that one was trickier.' },
  ],
  streak: [
    { vi: 'Được đó.', en: 'Nice.' },
    { vi: 'Đang vào form rồi.', en: "You're on a roll." },
    { vi: 'Ồ...', en: 'Oh...' },
  ],
}

export const COMBO_LABELS = {
  2: '🔥 x2',
  3: '🔥 x3',
  4: '🔥 x4',
  5: '🔥 PERFECT',
}

export const island3Copy = {
  eyebrow: { vi: 'ĐẢO 3', en: 'ISLAND 3' },
  title: { vi: 'Quiz Arena', en: 'Quiz Arena' },
  aiIntro: [
    { vi: 'Được rồi.', en: 'Alright.' },
    { vi: 'Đến lượt tôi hỏi bạn vài câu.', en: "It's my turn to ask you a few questions." },
    { vi: 'Yên tâm.', en: 'Relax.' },
    { vi: 'Không khó đâu 😏', en: "It's not hard 😏" },
  ],
  aiIntroSecret: { vi: 'À mà này Hiền... đừng đoán bừa nha 😏', en: "Oh, and Hiền... don't just guess randomly 😏" },
  startButton: { vi: 'BẮT ĐẦU', en: 'START' },
  endingLines: [
    { vi: 'Xong rồi.', en: "That's it." },
    { vi: 'Không tệ.', en: 'Not bad.' },
  ],
  resultsTitle: { vi: 'HOÀN THÀNH', en: 'COMPLETE' },
  scoreHigh: [
    { vi: 'Ồ...', en: 'Oh...' },
    { vi: 'Bạn làm tôi bất ngờ đấy.', en: "You actually surprised me." },
  ],
  scoreMid: [{ vi: 'Khá ổn.', en: 'Pretty solid.' }],
  scoreLow: [
    { vi: 'Không sao.', en: "It's okay." },
    { vi: 'Ít nhất chúng ta đã vui.', en: 'At least we had fun.' },
  ],
  scoreGeneric: { vi: 'Bạn làm tốt đấy.', en: 'You did well.' },
  continueButton: { vi: 'ĐI TIẾP', en: 'CONTINUE' },
  island4Lines: [
    { vi: 'Lần này...', en: 'This time...' },
    { vi: 'Để tôi thử đoán bạn.', en: 'Let me try to guess you.' },
  ],
  island4Eyebrow: { vi: 'ĐẢO 4', en: 'ISLAND 4' },
  island4Title: { vi: 'AI Đoán Bạn', en: 'AI Guesses You' },
  skipHint: { vi: 'Nhấn để bỏ qua', en: 'Click to skip' },
}
