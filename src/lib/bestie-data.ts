// ─── Types ───────────────────────────────────────────────────────────────────

export type GenderTarget = 'nam' | 'nu'

export interface ScoreDims {
  E: number  // Extroversion vs Introversion
  F: number  // Feeling (empathy) vs Thinking (solution)
  O: number  // Openness to experience
  S: number  // Social expressiveness
  J: number  // Judging (planned) vs Perceiving (spontaneous)
  T: number  // Trustworthiness / loyalty
  A: number  // Aesthetic / creative drive
  D: number  // Depth of connection needed
}

export interface Choice {
  emoji: string
  label: string
  sub?: string
  val: number
}

export interface Question {
  id: keyof ScoreDims
  text: string
  sub?: string
  choices: Choice[]
}

export interface BestieProfile {
  name: string
  emoji: string
  mbti: string
  color: string       // background fill
  textColor: string   // text on that background
  tagline: string
  traits: string[]
  hobbies: string[]
  compat: Record<string, number>
  insight: string     // "why this person fits you"
  quote: string
  fit: (s: ScoreDims) => boolean
}

// ─── Questions ───────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  {
    id: 'E',
    text: 'Tan học, bạn thường làm gì?',
    sub: 'Thành thật nhé — không ai phán xét đâu.',
    choices: [
      { emoji: '🎮', label: 'Rủ cả nhóm đi chơi hoặc tụ tập nhà ai đó', sub: 'Ở nhà một mình = hơi buồn', val: 2 },
      { emoji: '🎧', label: 'Về nhà, nằm nghe nhạc hoặc xem video một mình', sub: 'Nạp lại năng lượng kiểu introvert', val: -2 },
      { emoji: '📱', label: 'Nhắn tin với 1-2 người thân, không ra ngoài', sub: 'Cần người nhưng không cần đông', val: 0 },
    ],
  },
  {
    id: 'F',
    text: 'Bạn thân nhắn: "Hôm nay mình buồn lắm". Bạn làm gì?',
    sub: 'Phản xạ đầu tiên thôi.',
    choices: [
      { emoji: '🫂', label: '"Sao vậy? Kể mình nghe đi"', sub: 'Cần nghe hết câu chuyện', val: 2 },
      { emoji: '💡', label: 'Đưa giải pháp luôn — giải quyết xong là hết buồn', val: -1 },
      { emoji: '😂', label: 'Gửi meme vui để kéo mood lên', sub: 'Cười là thuốc chữa bách bệnh', val: 1 },
    ],
  },
  {
    id: 'O',
    text: 'Nhóm cần chọn chủ đề học nhóm. Bạn chọn kiểu nào?',
    choices: [
      { emoji: '🌍', label: 'Chủ đề lạ, chưa ai làm — độc lạ càng tốt', sub: 'Làm giống người khác = nhạt', val: 2 },
      { emoji: '📊', label: 'Chủ đề quen, nhiều tài liệu — an toàn', sub: 'Điểm cao là ưu tiên', val: -2 },
      { emoji: '🎯', label: 'Cái gì thầy cô thích nhất', sub: 'Thực tế thôi', val: -1 },
    ],
  },
  {
    id: 'S',
    text: 'Trong nhóm bạn, bạn thường là người như thế nào?',
    sub: 'Chọn cái gần nhất.',
    choices: [
      { emoji: '🎤', label: 'Người hay nói, kể chuyện, dẫn mood', sub: 'Không có mình thì im lặng hết', val: 2 },
      { emoji: '🧠', label: 'Ít nói nhưng khi nói thì hay', sub: 'Chất lượng hơn số lượng', val: -1 },
      { emoji: '🫶', label: 'Người hòa giải — ai cũng hợp', sub: 'Cầu nối của nhóm', val: 1 },
    ],
  },
  {
    id: 'J',
    text: 'Kỳ thi sắp đến. Bạn học kiểu nào?',
    choices: [
      { emoji: '📅', label: 'Lên lịch từ 2 tuần trước, rõ từng môn', sub: 'Ai cũng hỏi mình để học theo', val: 2 },
      { emoji: '🔥', label: 'Học dồn 2-3 ngày cuối — adrenaline mới vào', sub: 'Áp lực là động lực', val: -2 },
      { emoji: '🌊', label: 'Học từng đợt, không cần kế hoạch cứng', sub: 'Tuỳ hứng nhưng vẫn xong', val: 0 },
    ],
  },
  {
    id: 'T',
    text: 'Bạn vừa biết một bí mật của bạn trong lớp. Bạn làm gì?',
    sub: 'Thành thật đi bạn ơi.',
    choices: [
      { emoji: '🤐', label: 'Giữ im hoàn toàn', sub: 'Tin tưởng là quý giá', val: 2 },
      { emoji: '🗣️', label: 'Kể cho 1 người thân nhất thôi', sub: '1 người không tính là gossip', val: -1 },
      { emoji: '😬', label: 'Vô tình "slip" ra... không cố ý', sub: 'Kiểm soát kém hơn tưởng', val: -2 },
    ],
  },
  {
    id: 'A',
    text: 'Cuối tuần lý tưởng của bạn trông như thế nào?',
    choices: [
      { emoji: '🎨', label: 'Làm gì đó creative: vẽ, chụp ảnh, edit video', sub: 'Cần outlet sáng tạo', val: 2 },
      { emoji: '⚽', label: 'Ra ngoài vận động: bóng đá, bơi, đạp xe', sub: 'Đổ mồ hôi là thư giãn', val: -1 },
      { emoji: '🛋️', label: 'Chill ở nhà: phim, sách, game hoặc ngủ bù', sub: 'Hết tuần cần recharge', val: 0 },
    ],
  },
  {
    id: 'D',
    text: 'Với bạn, tình bạn tốt là khi nào?',
    sub: 'Câu cuối — quan trọng nhất.',
    choices: [
      { emoji: '💬', label: 'Nói được mọi thứ, kể cả chuyện xấu hổ nhất', sub: 'Vulnerability = trust', val: 2 },
      { emoji: '😂', label: 'Cười không cần lý do — vui là đủ', sub: 'Fun > Deep talk', val: -1 },
      { emoji: '🤝', label: 'Tin tưởng, không cần nói nhiều vẫn hiểu nhau', sub: 'Comfortable silence', val: 1 },
    ],
  },
]

// ─── Profiles ─────────────────────────────────────────────────────────────────

export const PROFILES_MALE: BestieProfile[] = [
  {
    name: 'Minh Khoa', emoji: '🧢', mbti: 'ENFJ',
    color: '#E1F5EE', textColor: '#085041',
    tagline: 'Kiểu bạn mà cả lớp đều thích — năng lượng tốt, lắng nghe giỏi, không để bạn chill một mình quá lâu.',
    traits: ['Nghe chuyện không phán xét', 'Rủ đi chơi cuối tuần', 'Nhớ ngày sinh nhật', 'Nói thẳng nhưng nhẹ nhàng'],
    hobbies: ['Bóng rổ', 'Podcast', 'Nấu ăn', 'Travel vlog'],
    compat: { 'Hiểu ý nhau': 91, 'Cùng vibe': 88, 'Không drama': 85, 'Trung thành': 95 },
    insight: 'Bạn có xu hướng cần người lắng nghe hơn người đưa giải pháp ngay — Minh Khoa làm được điều đó mà không cần nhắc.',
    quote: '"Mày cứ kể đi, tao nghe hết. Không phán xét, thề."',
    fit: (s) => s.E >= 0 && s.F >= 1 && s.D >= 1,
  },
  {
    name: 'Gia Huy', emoji: '🎧', mbti: 'INTJ',
    color: '#EEEDFE', textColor: '#26215C',
    tagline: 'Ít nói ngoài đời nhưng nhắn tin thì dài vô tận. Lời khuyên thực tế đến hơi bực — nhưng lúc nào cũng đúng.',
    traits: ['Phân tích mọi thứ rất kỹ', 'Thẳng thắn, không nịnh', 'Loyal 100% khi tin', 'Không gossip bao giờ'],
    hobbies: ['Đọc sách', 'Chess', 'Lo-fi', 'Lập trình'],
    compat: { 'Tin tưởng được': 97, 'Góc nhìn mới': 90, 'Không drama': 98, 'Học nhóm': 82 },
    insight: 'Bạn giữ bí mật tốt và cần sự ổn định — Gia Huy không drama, không phán xét, và không bao giờ kể chuyện của bạn cho người khác.',
    quote: '"Mày đang làm sai rồi. Nhưng không sao, mình sửa được."',
    fit: (s) => s.E < 0 && s.J >= 1 && s.T >= 1,
  },
  {
    name: 'Bảo Long', emoji: '😂', mbti: 'ENTP',
    color: '#FAEEDA', textColor: '#412402',
    tagline: 'Người bạn biến mọi buổi học nhóm buồn ngủ thành cuộc tranh luận thú vị. Chaotic nhưng không bao giờ nhàm.',
    traits: ['Meme lord của nhóm', 'Tranh luận chỉ để vui', 'Ý tưởng lạ liên tục', 'Trễ deadline nhưng làm tốt'],
    hobbies: ['Debate', 'YouTube rabbit holes', 'Stand-up', 'Kịch bản'],
    compat: { 'Không bao giờ chán': 95, 'Ý tưởng hay': 92, 'Vui khi buồn': 90, 'Đúng giờ': 55 },
    insight: 'Bạn cần người kéo mình ra khỏi comfort zone bằng sự hài hước thay vì áp lực — Bảo Long làm điều đó tự nhiên mà không cần cố.',
    quote: '"Thực ra nếu mày nghĩ theo hướng này... okay mình giải thích nha."',
    fit: (s) => s.O >= 1 && s.S >= 1 && s.E >= 1,
  },
  {
    name: 'Trọng Nghĩa', emoji: '🫶', mbti: 'ISFJ',
    color: '#FAECE7', textColor: '#4A1B0C',
    tagline: 'Không rầm rộ nhưng luôn ở đó khi cần. Nhớ bạn thích ăn gì, đang bận lúc nào.',
    traits: ['Nhớ mọi chi tiết nhỏ', 'Giúp đỡ không cần hỏi', 'Ổn định như núi', 'Ghét drama'],
    hobbies: ['Nấu ăn', 'Nhiếp ảnh', 'Đọc manga', 'Cây cảnh'],
    compat: { 'Đáng tin cậy': 99, 'Hiểu ý không cần nói': 87, 'Không drama': 96, 'Chia sẻ sâu': 80 },
    insight: 'Bạn cần người bạn ổn định và đáng tin hơn là người vui vẻ ồn ào — Trọng Nghĩa là người bạn cảm thấy bình yên khi ở bên.',
    quote: '"Mày ổn không? Mình mua trà sữa cho mày nha."',
    fit: (s) => s.F >= 0 && s.J >= 0 && s.D >= 0,
  },
]

export const PROFILES_FEMALE: BestieProfile[] = [
  {
    name: 'Minh Thư', emoji: '🌸', mbti: 'ENFP',
    color: '#FBEAF0', textColor: '#4B1528',
    tagline: 'Buổi sáng thứ 2 nào cũng đủ sức kéo mood cả nhóm lên. Năng lượng không giải thích được.',
    traits: ['Hype mọi người thật lòng', '100 ý tưởng lúc 11h đêm', 'Nhớ ngày sinh nhật ai', 'Khóc khi xem phim buồn'],
    hobbies: ['Chụp ảnh film', 'Playlist Spotify', 'Thrift shopping', 'Journaling'],
    compat: { 'Vibe cùng nhau': 93, 'Không bao giờ nhàm': 91, 'Chia sẻ được': 88, 'Giữ bí mật': 78 },
    insight: 'Bạn cần người kéo mình ra ngoài vùng an toàn bằng sự nhiệt tình chân thật — Minh Thư làm điều đó mà không khiến bạn áp lực.',
    quote: '"Ơ mày ơi mình có ý tưởng hay lắm — 12h đêm nhưng nghe không?"',
    fit: (s) => s.E >= 1 && s.O >= 1 && s.A >= 1,
  },
  {
    name: 'Hà Anh', emoji: '📚', mbti: 'INFJ',
    color: '#E6F1FB', textColor: '#042C53',
    tagline: 'Nhìn ngoài thì yên tĩnh, nhưng là người hiểu bạn nhất — đôi khi còn hơn bạn tự hiểu mình.',
    traits: ['Đọc được cảm xúc của bạn', 'Lời khuyên chạm đúng tim', 'Trung thành tuyệt đối', 'Cần thời gian để mở lòng'],
    hobbies: ['Sách tâm lý', 'Nhật ký', 'Phim arthouse', 'Thiền'],
    compat: { 'Hiểu sâu': 98, 'Tin tưởng được': 95, 'Đồng cảm': 94, 'Fun ngẫu hứng': 72 },
    insight: 'Bạn cần được hiểu mà không cần giải thích nhiều — Hà Anh có khả năng đọc cảm xúc người khác mà không cần hỏi thẳng.',
    quote: '"Mày không cần giải thích — mình biết mày đang cảm thấy gì rồi."',
    fit: (s) => s.E < 1 && s.F >= 1 && s.D >= 1,
  },
  {
    name: 'Khánh Linh', emoji: '✨', mbti: 'ESFP',
    color: '#EAF3DE', textColor: '#173404',
    tagline: 'Phòng nào có Linh là ồn ào hơn 3 lần và vui hơn 10 lần. Không bao giờ thiếu chuyện để kể.',
    traits: ['Rủ đi chơi lúc 9h tối', 'Nhảy trend TikTok nhiệt tình', 'Bạn của mọi người', 'Không giữ thù quá 1 ngày'],
    hobbies: ['Dance cover', 'Karaoke', 'Ăn vặt khắp nơi', 'Thời trang'],
    compat: { 'Không bao giờ chán': 97, 'Mood booster': 99, 'Vui ngẫu hứng': 95, 'Học nhóm focus': 61 },
    insight: 'Bạn cần người kéo mình ra khỏi đầu mình bằng sự vui vẻ tự nhiên — Khánh Linh làm điều đó mà không cần biết vấn đề của bạn là gì.',
    quote: '"Thôi đi ăn đi mày, ăn xong buồn cũng hết buồn."',
    fit: (s) => s.E >= 1 && s.S >= 1 && s.J < 0,
  },
  {
    name: 'Thu Hằng', emoji: '🌿', mbti: 'ISTP',
    color: '#F1EFE8', textColor: '#2C2C2A',
    tagline: 'Ít nói nhiều làm — không drama, không phán xét, chill tuyệt đối. Bên cạnh là tự nhiên thấy bình yên.',
    traits: ['Không phán xét bao giờ', 'Fix vấn đề thay vì than', 'Chill 100%', 'Nói thẳng không ác ý'],
    hobbies: ['Cắm hoa', 'DIY', 'Nhạc indie', 'Đi bộ một mình'],
    compat: { 'Không drama': 100, 'Comfortable silence': 97, 'Tin tưởng được': 92, 'Tụ tập đông': 65 },
    insight: 'Bạn cần không gian im lặng thoải mái mà không cảm thấy awkward — Thu Hằng là người bạn có thể ngồi cạnh mà không cần nói gì cũng ổn.',
    quote: '"Mày không cần giải thích. Mình không phán xét. Cứ kể đi."',
    fit: (s) => s.E < 0 && s.T >= 1 && s.S < 1,
  },
]

// ─── Engine ───────────────────────────────────────────────────────────────────

export function pickProfile(scores: ScoreDims, gender: GenderTarget): BestieProfile {
  const pool = gender === 'nu' ? PROFILES_FEMALE : PROFILES_MALE
  const matched = pool.filter(p => p.fit(scores))
  if (matched.length > 0) return matched[Math.floor(Math.random() * matched.length)]
  return pool[Math.floor(Math.random() * pool.length)]
}

export function buildShareCaption(profile: BestieProfile): string {
  return (
    `Chân dung bạn thân suốt thời trung học của mình là ${profile.name} (${profile.mbti}) 🔮\n` +
    `"${profile.tagline.slice(0, 65)}..."\n\n` +
    `Bạn thân của mày là ai? 👉 pathfinder.careerplan.vn/bestie\n` +
    `#bạnthân #thpt #2k11 #lớp10`
  )
}

export const DEFAULT_SCORES: ScoreDims = { E: 0, F: 0, O: 0, S: 0, J: 0, T: 0, A: 0, D: 0 }
