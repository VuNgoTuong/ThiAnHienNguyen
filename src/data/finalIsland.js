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
        vi: 'Cậu đã đi qua cả 4 hòn đảo rồi. Chỉ còn thử thách cuối cùng thôi.',
        en: "You've conquered all 4 islands. One last trial left.",
      },
      {
        vi: 'Giờ thử tự ghép lại hành trình của chính mình xem nào.',
        en: 'Now put your own journey back in order.',
      },
    ],

    secretLines: [
      {
        vi: 'Đi được tới tận đây luôn à, Hiền? Tui hơi bất ngờ đó… kiểu bất ngờ mà nể thật ấy 😆',
        en: "Made it all the way here, Hiền? Honestly kinda impressed — the good kind of surprised.",
      },
    ],
  },

  discovery: {
    title: { vi: 'Hành Trình Của Bạn', en: 'Your Journey' },
    story: [
      {
        vi: 'Những mảnh la bàn cậu nhặt được giờ đã tụ lại đầy đủ. Chỉ cần sắp đúng thứ tự nữa là xong.',
        en: 'Every fragment you scraped together has come together now. Just order them right to finish.',
      },
    ],
  },

  lessons: [
    {
      id: 'level5-sequence',
      type: 'sequence',

      prompt: {
        vi: 'Sắp xếp lại đúng thứ tự các hòn đảo cậu đã đi qua:',
        en: "Arrange the islands you've been through in the right order:",
      },

      secretPrompt: {
        vi: 'Sắp đúng nha, Hiền. Sai là tao nhắc hoài đó 😏',
        en: "Arrange them right — screw it up, Hiền, and I will never let you live it down:",
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
        vi: 'Chuẩn rồi, cậu hoàn thành chuyến hành trình này rồi!',
        en: "Nice — you finished the whole damn journey!",
      },
      {
        vi: 'Cậu đã vượt qua mọi thử thách bằng sự kiên trì và đầu óc của mình.',
        en: 'You crushed every trial with your own stubbornness and wit.',
      },
      {
        vi: 'Chiếc La Bàn Khám Phá giờ đã hoàn chỉnh. Hẹn gặp lại ở chuyến phiêu lưu tiếp theo!',
        en: 'The Compass of Discovery is whole again. See you next voyage!',
      },
    ],
  },
}