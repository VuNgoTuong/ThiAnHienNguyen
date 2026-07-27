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
        vi: 'Bạn đã vượt qua cả 4 hòn đảo. Chỉ còn một thử thách cuối cùng.',
        en: "You've conquered all 4 islands. Just one final trial remains.",
      },
      { vi: 'Hãy sắp xếp lại hành trình của chính bạn.', en: 'Put your own journey back in order.' },
    ],
    secretLines: [
      {
        vi: 'Đi được đến đây rồi cơ à, Hiền? Thật sự tôi hơi bất ngờ đấy — theo kiểu bất ngờ tốt thôi nhé.',
        en: "Made it all the way here, Hiền? Honestly a bit surprised — the good kind of surprised, I promise.",
      },
    ],
  },
  discovery: {
    title: { vi: 'Hành Trình Của Bạn', en: 'Your Journey' },
    story: [
      {
        vi: 'Từng mảnh la bàn bạn thu thập được giờ đây đã hội tụ. Chỉ cần sắp xếp đúng thứ tự để hoàn tất.',
        en: 'Every compass fragment you collected has now come together. Just put them in the right order to finish.',
      },
    ],
  },
  lessons: [
    {
      id: 'level5-sequence',
      type: 'sequence',
      prompt: { vi: 'Sắp xếp lại đúng thứ tự các hòn đảo bạn đã đi qua:', en: "Arrange the islands you've visited in the right order:" },
      secretPrompt: {
        vi: 'Sắp xếp lại đúng thứ tự các hòn đảo — nếu Hiền làm sai, tôi sẽ không để yên đâu đấy nhé:',
        en: "Arrange the islands in the right order — get it wrong, Hiền, and I will never let you hear the end of it:",
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
      { vi: 'Chúc mừng bạn đã hoàn thành hành trình!', en: "Congratulations — you've completed the journey!" },
      {
        vi: 'Bạn đã vượt qua mọi thử thách bằng chính sự kiên trì và thông minh của mình.',
        en: 'You conquered every trial with your own persistence and wit.',
      },
      {
        vi: 'Chiếc La Bàn Khám Phá giờ đã trọn vẹn. Hẹn gặp lại ở hành trình tiếp theo!',
        en: 'The Compass of Discovery is whole once more. See you on the next voyage!',
      },
    ],
  },
}
