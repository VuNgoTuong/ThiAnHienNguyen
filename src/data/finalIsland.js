// Đảo cuối cùng (Level 5) sẽ mở khi người chơi thu thập đủ tất cả Mảnh La Bàn.

const GUIDE = { vi: 'Người Dẫn Đường', en: 'The Guide' }

export const finalIsland = {
  id: 'lost-horizon',
  name: { vi: 'Chân Trời Cuối Cùng', en: 'The Final Horizon' },
  level: 5,
  position: { x: 50, y: 12 },

  arrival: {
    speaker: GUIDE,
    lines: [
      {
        vi: 'Em đã đi qua cả 4 hòn đảo rồi đó. Chỉ còn một thử thách cuối cùng thôi.',
        en: "You've made it through all 4 islands. Just one last trial left.",
      },
      {
        vi: 'Giờ mình cùng ghép lại hành trình này một lần nữa nha em.',
        en: 'Now, let\'s piece this whole journey back together, together.',
      },
    ],

    secretLines: [
      {
        vi: 'Đi được tới tận đây luôn à, Hiền? Anh không bất ngờ đâu, vì anh luôn tin em làm được — chỉ là thấy thương em nhiều hơn thôi 🥹',
        en: "Made it all the way here, Hiền? Not surprised, honestly — anh always believed you could. Just love you a little more for it. 🥹",
      },
    ],
  },

  discovery: {
    title: { vi: 'Hành Trình Của Bạn', en: 'Your Journey' },
    story: [
      {
        vi: 'Những mảnh la bàn em nhặt được trên đường đi giờ đã tụ đủ cả rồi. Chỉ cần sắp đúng thứ tự nữa thôi là xong.',
        en: 'Every fragment you gathered along the way has finally come together. Just put them in order and you\'re done.',
      },
    ],
  },

  lessons: [
    {
      id: 'level5-sequence',
      type: 'sequence',

      prompt: {
        vi: 'Sắp lại đúng thứ tự những hòn đảo em đã đi qua nha:',
        en: "Put the islands you've traveled through back in order:",
      },

      secretPrompt: {
        vi: 'Sắp đúng nha, Hiền. Dù có sai anh cũng thương thôi, nhưng đúng thì vui hơn nè 😌',
        en: "Get it right, Hiền. Even if you don't, anh will still adore you — but it's more fun when you nail it. 😌",
      },

      data: {
        items: [
          { id: 's1', label: { vi: 'Đảo Khởi Hành', en: 'Isle of Beginnings' } },
          { id: 's2', label: { vi: 'Đảo Bí Ẩn', en: 'Isle of Mystery' } },
          { id: 's3', label: { vi: 'Đảo Thử Thách', en: 'Isle of Challenge' } },
          { id: 's4', label: { vi: 'Đảo Trí Tuệ', en: 'Isle of Wit' } },
        ],

        correctOrder: ['s1', 's2', 's3', 's4'],
      },
    },
  ],

  ending: {
    speaker: GUIDE,

    lines: [
      {
        vi: 'Tuyệt, em phá đảo rùi kkk!',
        en: "That's it — you've completed the whole journey!",
      },
      {
        vi: 'Em thật peak :v',
        en: 'You cleared every trial with your own patience and smarts — anh is so proud of you.',
      },
      {
        vi: 'Chiếc La Bàn Khám Phá giờ đã hoàn chỉnh rồi. Cảm ơn em đã đi hết chặng đường này cùng anh — hẹn gặp lại ở chuyến phiêu lưu tiếp theo, công chúa nhé!',
        en: 'The Compass of Discovery is whole again. Thank you for walking this whole road with anh — see you on the next adventure, princess.',
      },
    ],
  },
}
