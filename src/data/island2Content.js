// Content for Island 2 — "Những Điều Nhỏ" (Little Things). Replaces the old
// find-the-hidden-object / right-or-wrong quiz concept with a sequence of
// small either/or interactions: no scoring, no correct answer, just a way
// to surface little real preferences one at a time. Grouped into `sections`
// (chapters) so HiddenCoveScene can pace itself and show a short section
// title between chapters; `micro` picks which small on-select animation
// LittleThingsCard plays for every option in that section.
//
// Every option carries its own `keyword` — the short tag collected into the
// finale's keyword grid once the player has picked it, regardless of which
// side of the either/or they chose.
export const island2Content = {
  sections: [
    {
      id: 'food',
      title: { vi: 'Gu Ăn Uống', en: 'Taste' },
      micro: 'ripple',
      interactions: [
        {
          id: 'food-1',
          prompt: { vi: 'Hôm nay ăn gì?', en: 'What to eat today?' },
          options: [
            {
              id: 'soup',
              label: { vi: 'Món nước 🥣', en: 'Noodle soup 🥣' },
              reaction: { vi: 'Có tô nóng là thấy yên.', en: 'A warm bowl and everything feels settled.' },
              keyword: { vi: 'Món nước', en: 'Noodle soup' },
            },
            {
              id: 'dry',
              label: { vi: 'Món khô 🍝', en: 'Dry noodles 🍝' },
              reaction: { vi: 'Gọn gàng, nhanh, cũng đủ ngon.', en: 'Quick, simple, still good.' },
              keyword: { vi: 'Món khô', en: 'Dry noodles' },
            },
          ],
        },
        {
          id: 'food-2',
          prompt: { vi: 'Team nào?', en: 'Which team?' },
          options: [
            {
              id: 'sweet',
              label: { vi: 'Đồ ngọt 🍰', en: 'Sweet 🍰' },
              reaction: { vi: 'Một chút ngọt là đủ vui cả ngày.', en: 'A little sweetness makes the whole day better.' },
              keyword: { vi: 'Đồ ngọt', en: 'Sweet tooth' },
            },
            {
              id: 'savory',
              label: { vi: 'Đồ mặn 🥨', en: 'Savory 🥨' },
              reaction: { vi: 'Đậm đà thì nhớ lâu hơn.', en: 'Bold flavors are the ones you remember.' },
              keyword: { vi: 'Đồ mặn', en: 'Savory' },
            },
          ],
        },
        {
          id: 'food-3',
          prompt: { vi: 'Mít?', en: 'Jackfruit?' },
          options: [
            {
              id: 'fresh-jackfruit',
              label: { vi: 'Mít tươi 🍈', en: 'Fresh jackfruit 🍈' },
              reaction: { vi: 'Vị thật, ăn phát ghiền luôn.', en: "The real thing — one bite and you're hooked." },
              keyword: { vi: 'Mít tươi', en: 'Fresh jackfruit' },
            },
            {
              id: 'freeze-dried-jackfruit',
              label: { vi: 'Mít sấy thăng hoa ✨', en: 'Freeze-dried jackfruit ✨' },
              reaction: { vi: 'Giòn tan, mang theo đâu cũng tiện.', en: 'Crisp and light — easy to carry anywhere.' },
              keyword: { vi: 'Mít sấy thăng hoa', en: 'Freeze-dried jackfruit' },
            },
          ],
        },
        {
          id: 'food-4',
          prompt: { vi: 'Chọn một món ăn vặt?', en: 'Pick a snack?' },
          options: [
            {
              id: 'freeze-dried-strawberry',
              label: { vi: 'Dâu sấy thăng hoa 🍓', en: 'Freeze-dried strawberries 🍓' },
              reaction: { vi: 'Chua chua ngọt ngọt, nhâm nhi cả buổi.', en: 'Sweet and tangy — good for nibbling all afternoon.' },
              keyword: { vi: 'Dâu sấy thăng hoa', en: 'Freeze-dried strawberries' },
            },
            {
              id: 'fried-macaroni',
              label: { vi: 'Nui chiên giòn 🍝', en: 'Crispy fried pasta 🍝' },
              reaction: { vi: 'Vặt vãnh vậy mà ghiền mới lạ.', en: "Just a little snack, somehow addictive." },
              keyword: { vi: 'Nui ăn vặt', en: 'Crispy pasta snack' },
            },
          ],
        },
      ],
    },
    {
      id: 'likes',
      title: { vi: 'Những Thứ Thích', en: 'Little Likes' },
      micro: 'glow',
      interactions: [
        {
          id: 'likes-1',
          prompt: { vi: 'Một chút thư giãn?', en: 'A little downtime?' },
          options: [
            {
              id: 'music',
              label: { vi: 'Nghe nhạc 🎧', en: 'Music 🎧' },
              reaction: { vi: 'Một bài đúng lúc, vậy là đủ.', en: "The right song at the right time — that's enough." },
              keyword: { vi: 'Nghe nhạc', en: 'Music' },
            },
            {
              id: 'scent',
              label: { vi: 'Mùi thơm dịu nhẹ 🕯️', en: 'A soft scent 🕯️' },
              reaction: { vi: 'Một mùi quen thuộc, thấy dễ chịu liền.', en: 'A familiar scent, and everything feels lighter.' },
              keyword: { vi: 'Mùi thơm', en: 'A soft scent' },
            },
          ],
        },
        {
          id: 'likes-2',
          prompt: { vi: 'Một buổi chiều rảnh rỗi?', en: 'A free afternoon?' },
          options: [
            {
              id: 'sky',
              label: { vi: 'Ngắm bầu trời 🌇', en: 'Watching the sky 🌇' },
              reaction: { vi: 'Không cần đi đâu xa, ngước lên là đủ.', en: 'No need to go far — just look up.' },
              keyword: { vi: 'Ngắm bầu trời', en: 'Watching the sky' },
            },
            {
              id: 'pampered',
              label: { vi: 'Được chiều một chút 🤍', en: 'Being pampered a little 🤍' },
              reaction: { vi: 'Ai mà chẳng thích được để ý một chút.', en: 'Everyone likes a little extra care.' },
              keyword: { vi: 'Được chiều', en: 'A little pampering' },
            },
          ],
        },
        {
          id: 'likes-3',
          prompt: { vi: 'Điều gì xoa dịu một ngày dài?', en: 'What eases a long day?' },
          options: [
            {
              id: 'familiar-song',
              label: { vi: 'Một bản nhạc quen 🎵', en: 'A familiar song 🎵' },
              reaction: { vi: 'Nghe vài giây là thấy nhẹ hẳn.', en: 'A few seconds in, and the day feels lighter.' },
              keyword: { vi: 'Âm nhạc', en: 'Music' },
            },
            {
              id: 'quiet-sky',
              label: { vi: 'Một khoảng trời yên tĩnh 🌌', en: 'A quiet stretch of sky 🌌' },
              reaction: { vi: 'Đôi khi chỉ cần vậy là đủ.', en: "Sometimes that's really all it takes." },
              keyword: { vi: 'Khoảng trời yên tĩnh', en: 'A quiet sky' },
            },
          ],
        },
      ],
    },
    {
      id: 'lifestyle',
      title: { vi: 'Cách Sống', en: 'How She Moves' },
      micro: 'wave',
      interactions: [
        {
          id: 'lifestyle-1',
          prompt: { vi: 'Việc đang chờ xử lý?', en: 'Something on the to-do list?' },
          options: [
            {
              id: 'leave-it',
              label: { vi: 'Để đó rồi tính 🛋️', en: 'Leave it for later 🛋️' },
              reaction: { vi: 'Đôi khi để đầu óc thở một chút cũng cần.', en: 'Sometimes the mind needs room to breathe too.' },
              keyword: { vi: 'Để đó rồi tính', en: 'Leave it for later' },
            },
            {
              id: 'handle-first',
              label: { vi: 'Xử lý được gì thì làm trước ⚡', en: 'Handle what you can, first ⚡' },
              reaction: { vi: 'Dọn xong một việc, đầu óc nhẹ hẳn.', en: 'Clear one thing, and everything feels lighter.' },
              keyword: { vi: 'Luôn có việc để làm', en: 'Always something to do' },
            },
          ],
        },
        {
          id: 'lifestyle-2',
          prompt: { vi: 'Một người khiến bạn nể?', en: 'Someone you admire?' },
          options: [
            {
              id: 'easy-going',
              label: { vi: 'Sống thoải mái, không cần mục tiêu 😌', en: 'Living easy, no goals needed 😌' },
              reaction: { vi: 'Sống nhẹ nhàng cũng là một cách chọn.', en: "Taking it easy is its own kind of choice." },
              keyword: { vi: 'Sống thoải mái', en: 'Living easy' },
            },
            {
              id: 'ambitious',
              label: { vi: 'Có mục tiêu và muốn tiến lên 🚀', en: 'Has goals, keeps pushing forward 🚀' },
              reaction: { vi: 'Nhìn một người cứ tiến lên, tự dưng thấy nể.', en: 'Watching someone keep moving forward — hard not to admire that.' },
              keyword: { vi: 'Có tham vọng', en: 'Ambitious' },
            },
          ],
        },
        {
          id: 'lifestyle-3',
          prompt: { vi: 'Nhịp làm việc lý tưởng?', en: 'An ideal work pace?' },
          options: [
            {
              id: 'slow-steady',
              label: { vi: 'Chậm mà chắc 🐢', en: 'Slow and steady 🐢' },
              reaction: { vi: 'Không vội, miễn đi đúng hướng.', en: "No rush, as long as it's the right direction." },
              keyword: { vi: 'Chậm mà chắc', en: 'Slow and steady' },
            },
            {
              id: 'fast-done',
              label: { vi: 'Nhanh, dứt điểm ⚡', en: 'Fast, get it done ⚡' },
              reaction: { vi: 'Xong sớm, nhẹ đầu sớm.', en: 'Finish early, rest easy early.' },
              keyword: { vi: 'Dứt điểm nhanh', en: 'Quick to finish' },
            },
          ],
        },
        {
          id: 'lifestyle-4',
          prompt: { vi: 'Khi bị ai đó hối thúc?', en: 'When someone tries to rush you?' },
          options: [
            {
              id: 'slower',
              label: { vi: 'Càng hối càng chậm lại 😤', en: 'The more they rush, the slower it goes 😤' },
              reaction: { vi: 'Có nhịp riêng, khó mà đẩy nhanh hơn được.', en: "Everyone has their own pace — hard to force it." },
              keyword: { vi: 'Không thích bị hối', en: "Doesn't like being rushed" },
            },
            {
              id: 'own-pace',
              label: { vi: 'Tự có nhịp riêng, không cần nhắc 🎯', en: 'Has their own rhythm, no reminders needed 🎯' },
              reaction: { vi: 'Việc nào cũng đến lượt của nó thôi.', en: 'Everything gets its turn eventually.' },
              keyword: { vi: 'Tự có nhịp riêng', en: 'Sets her own pace' },
            },
          ],
        },
      ],
    },
    {
      id: 'communication',
      title: { vi: 'Cách Giao Tiếp', en: 'How She Talks' },
      micro: 'sparkle',
      interactions: [
        {
          id: 'comm-1',
          prompt: { vi: 'Có chuyện cần nói?', en: 'Something that needs saying?' },
          options: [
            {
              id: 'say-nicely',
              label: { vi: 'Nói sao cho dễ nghe 🤐', en: 'Say it gently 🤐' },
              reaction: { vi: 'Khéo léo cũng là một cách quan tâm.', en: "Being gentle about it is its own kind of care." },
              keyword: { vi: 'Khéo léo', en: 'Gentle' },
            },
            {
              id: 'say-true',
              label: { vi: 'Nói thật 🗣️', en: 'Say it straight 🗣️' },
              reaction: { vi: 'Không cần nói hay. Chỉ cần thật.', en: 'No need to sound perfect. Just be honest.' },
              keyword: { vi: 'Thẳng thắn', en: 'Honest' },
            },
          ],
        },
        {
          id: 'comm-2',
          prompt: { vi: 'Tin nhắn được trả lời lúc nào?', en: 'When do messages get answered?' },
          options: [
            {
              id: 'anytime',
              label: { vi: 'Bất cứ lúc nào ☀️', en: 'Whenever ☀️' },
              reaction: { vi: 'Rảnh là trả lời liền, đơn giản vậy thôi.', en: 'Free means reply right away — simple as that.' },
              keyword: { vi: 'Trả lời liền', en: 'Replies right away' },
            },
            {
              id: 'evening',
              label: { vi: 'Chiều / tối 🌤️', en: 'Afternoon / evening 🌤️' },
              reaction: { vi: 'Bận cả ngày, tối mới có chút thời gian thở.', en: 'Busy all day — evening is finally a breath of space.' },
              keyword: { vi: 'Bận rộn cả ngày', en: 'Busy all day' },
            },
          ],
        },
        {
          id: 'comm-3',
          prompt: { vi: 'Khi có điều không hài lòng?', en: "When something's bothering you?" },
          options: [
            {
              id: 'stay-quiet',
              label: { vi: 'Im lặng cho qua 😶', en: 'Stay quiet, let it pass 😶' },
              reaction: { vi: 'Có lúc im lặng cũng là một câu trả lời.', en: "Sometimes silence is its own kind of answer." },
              keyword: { vi: 'Im lặng', en: 'Stays quiet' },
            },
            {
              id: 'speak-gently',
              label: { vi: 'Nói ra, nhẹ nhàng thôi 🙂', en: 'Say it, but gently 🙂' },
              reaction: { vi: 'Nói thẳng, nhưng không cần gắt.', en: 'Say it plainly — no need for an edge.' },
              keyword: { vi: 'Nói ra nhẹ nhàng', en: 'Speaks up gently' },
            },
          ],
        },
      ],
    },
  ],
  outro: {
    intro: { vi: 'Có vẻ đã biết thêm vài điều rồi.', en: 'Seems like a few more things are known now.' },
    reflect: [
      { vi: 'Mỗi người đều có những điều rất riêng.', en: 'Everyone carries little things that are only theirs.' },
      { vi: 'Và đôi khi, những điều nhỏ nhất lại nói lên nhiều nhất.', en: 'And sometimes, the smallest things say the most.' },
    ],
  },
}
