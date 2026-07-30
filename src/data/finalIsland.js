// The Final Island (Level 5) unlocks once every Compass Fragment has been
// collected.

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
        vi: 'Mày cân hết cả 4 hòn đảo rồi. Chỉ còn một thử thách cuối.',
        en: "You've conquered all 4 islands. One last trial left.",
      },
      { vi: 'Giờ tự sắp xếp lại hành trình của chính mày đi.', en: 'Now put your own journey back in order.' },
    ],
    secretLines: [
      {
        vi: 'Đi được tới đây luôn à, Hiền? Thật tình tao hơi bất ngờ đó — bất ngờ kiểu nể luôn ấy haha.',
        en: "Made it all the way here, Hiền? Honestly kinda impressed — the good kind of surprised.",
      },
    ],
  },
  discovery: {
    title: { vi: 'Hành Trình Của Bạn', en: 'Your Journey' },
    story: [
      {
        vi: 'Từng mảnh la bàn mày gom được giờ hội tụ hết rồi. Sắp đúng thứ tự là xong.',
        en: 'Every fragment you scraped together has come together now. Just order them right to finish.',
      },
    ],
  },
  lessons: [
    {
      id: 'level5-sequence',
      type: 'sequence',
      prompt: { vi: 'Sắp xếp lại đúng thứ tự các hòn đảo mày đã đi qua:', en: "Arrange the islands you've been through in the right order:" },
      secretPrompt: {
        vi: 'Sắp lại đúng thứ tự các hòn đảo — mày mà sắp sai, tao cạy mồm mày ra cười cả năm luôn đó!!!:',
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
      { vi: 'Ngon, mày hoàn thành hành trình rồi đó!', en: "Nice — you finished the whole damn journey!" },
      {
        vi: 'Mày cân hết mọi thử thách bằng chính sự lì lợm và thông minh của mày.',
        en: 'You crushed every trial with your own stubbornness and wit.',
      },
      {
        vi: 'Chiếc La Bàn Khám Phá giờ ráp đủ rồi. Hẹn gặp lại ở hành trình sau!',
        en: 'The Compass of Discovery is whole again. See you next voyage!',
      },
    ],
  },
}
