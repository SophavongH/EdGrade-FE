'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createStudent } from '@/lib/api'
import { useLanguage } from "@/lib/LanguageProvider";

const StudentForm = () => {
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: '',
    address: '',
    parentPhone: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage();

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setImage(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createStudent({
        ...form,
        avatar: image,
        gender: form.gender === 'male' ? 'Male' : 'Female',
      })
      router.push('/school/student')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Failed to create student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        asChild
        className="mb-10 w-fit border bg-white text-xs text-dark-200 hover:bg-light-300"
      >
        <Link href="/school/student" className="flex items-center gap-2 text-2xl font-semibold">
          <Image
            src="/icons/undo-arrow.svg"
            alt={t("back")}
            width={20}
            height={20}
          />
          {t("goBack")}
        </Link>
      </Button>
      <section className="flex flex-col">
        {/* Uploadable Circle */}
        <div
          className="w-36 h-36 rounded-full bg-orange-200 flex items-center justify-center cursor-pointer mb-6 overflow-hidden"
          onClick={handleImageClick}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={t("profile")} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl text-white">+</span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        {/* Form */}
        <form className="w-full max-w-2xl space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">{t("name")}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded border px-4 py-2"
              placeholder={t("enterName")}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">{t("dob")}</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full rounded border px-4 py-2"
                placeholder={t("selectDate")}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">{t("gender")}</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded border px-4 py-2"
                required
              >
                <option value="">{t("select")}</option>
                <option value="male">{t("male")}</option>
                <option value="female">{t("female")}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1">{t("address")}</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded border px-4 py-2"
              placeholder={t("enterAddress")}
            />
          </div>
          <div>
            <label className="block mb-1">{t("parentPhone")}</label>
            <input
              name="parentPhone"
              value={form.parentPhone}
              onChange={handleChange}
              className="w-full rounded border px-4 py-2"
              placeholder={t("enterPhoneNumber")}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#25388C] hover:bg-[#1e2e6d] text-white text-lg"
            disabled={loading}
          >
            {loading ? t("creating") : t("create")}
          </Button>
        </form>
      </section>
    </>
  )
}

export default StudentForm