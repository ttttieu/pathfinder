import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400 inline-block" />
          <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
            PathFinder
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-semibold leading-tight mb-4 text-stone-900">
          Lựa chọn môn học hôm nay<br />
          <span className="text-brand-600">mở ra cánh cửa nào tương lai?</span>
        </h1>

        <p className="text-stone-500 text-base leading-relaxed mb-8">
          Hoàn thành 4 bước đơn giản trong <strong className="text-stone-700">10–15 phút</strong> để
          hiểu tác động của tổ hợp môn bạn dự kiến chọn — trước khi đăng ký đầu năm học.
        </p>

        {/* CTA */}
        <Link href="/assessment" className="btn-primary text-base px-8 py-3">
          Bắt đầu ngay →
        </Link>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-12 text-left">
          {[
            { icon: '🎯', title: 'Không đoán nghề', desc: 'Chỉ giúp bạn nhìn thấy hệ quả của lựa chọn môn học' },
            { icon: '⚡', title: '10–15 phút', desc: 'Không cần đăng ký, không cần cài app' },
            { icon: '🔒', title: 'Bảo mật', desc: 'Email chỉ dùng để gửi kết quả, không chia sẻ bên thứ ba' },
          ].map(f => (
            <div key={f.title} className="card text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-xs font-semibold text-stone-700 mb-1">{f.title}</div>
              <div className="text-xs text-stone-400 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
