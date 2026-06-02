'use client'

import { useState } from 'react'
import type { StudentProfile } from '@/types'

interface Props {
  value: StudentProfile
  onChange: (p: StudentProfile) => void
  onNext: () => void
}

export default function StepProfile({ value, onChange, onNext }: Props) {
  const [emailError, setEmailError] = useState('')

  function update(field: keyof StudentProfile, val: string) {
    onChange({ ...value, [field]: val })
  }

  function handleNext() {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
    if (!emailOk) {
      setEmailError(value.email ? 'Email không hợp lệ. Vd: vanAn@gmail.com' : 'Vui lòng nhập email để nhận kết quả.')
      return
    }
    setEmailError('')
    onNext()
  }

  return (
    <div className="card space-y-4">
      <div className="field-label">Thông tin học sinh</div>

      {/* Name */}
      <div>
        <label className="block text-xs text-stone-500 mb-1">
          Họ và tên <span className="text-stone-300">(không bắt buộc)</span>
        </label>
        <input
          className="input"
          type="text"
          placeholder="Vd: Nguyễn Văn An"
          value={value.name ?? ''}
          onChange={e => update('name', e.target.value)}
        />
      </div>

      {/* Email — required */}
      <div>
        <label className="block text-xs text-stone-500 mb-1">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          className={`input ${emailError ? 'input-error' : ''}`}
          type="email"
          placeholder="Vd: vanAn@gmail.com"
          value={value.email}
          onChange={e => { update('email', e.target.value); setEmailError('') }}
        />
        {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs text-stone-500 mb-1">
          Số điện thoại <span className="text-stone-300">(không bắt buộc)</span>
        </label>
        <input
          className="input"
          type="tel"
          placeholder="Vd: 0912 345 678"
          value={value.phone ?? ''}
          onChange={e => update('phone', e.target.value)}
        />
      </div>

      <hr className="border-stone-100" />

      {/* Grade */}
      <div>
        <label className="block text-xs text-stone-500 mb-1">Lớp</label>
        <select
          className="input"
          value={value.grade}
          onChange={e => update('grade', e.target.value)}
        >
          <option value="10">Lớp 10</option>
          <option value="11">Lớp 11</option>
          <option value="12">Lớp 12</option>
        </select>
      </div>

      {/* School */}
      <div>
        <label className="block text-xs text-stone-500 mb-1">
          Tên trường <span className="text-stone-300">(không bắt buộc)</span>
        </label>
        <input
          className="input"
          type="text"
          placeholder="Vd: THPT Chuyên Lê Hồng Phong"
          value={value.school ?? ''}
          onChange={e => update('school', e.target.value)}
        />
      </div>

      {/* Province */}
      <div>
        <label className="block text-xs text-stone-500 mb-1">
          Tỉnh / Thành phố <span className="text-stone-300">(không bắt buộc)</span>
        </label>
        <input
          className="input"
          type="text"
          placeholder="Vd: TP. Hồ Chí Minh"
          value={value.province ?? ''}
          onChange={e => update('province', e.target.value)}
        />
      </div>

      {/* Privacy */}
      <p className="text-xs text-stone-400 bg-stone-50 rounded-lg p-3 border border-stone-200 leading-relaxed">
        🔒 Email chỉ dùng để gửi kết quả và thông tin hỗ trợ định hướng. Không chia sẻ với bên thứ ba.
      </p>

      {/* Action */}
      <div className="flex justify-end pt-1">
        <button className="btn-primary" onClick={handleNext}>
          Tiếp theo →
        </button>
      </div>
    </div>
  )
}
