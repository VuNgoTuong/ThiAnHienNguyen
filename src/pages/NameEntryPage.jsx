import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { Button } from '../components/ui/Button.jsx'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { Ocean } from '../components/world/Ocean.jsx'
import { uiStrings } from '../data/uiStrings.js'
import { isHienName } from '../utils/secretMode.js'
import { submitPlayerInfo } from '../utils/submitPlayerInfo.js'

const EMPTY_FORM = { name: '', birthday: '', phone: '', email: '', school: '', address: '' }

const inputClass =
  'w-full rounded-lg border border-ink-900/20 bg-parchment-100 px-4 py-2.5 font-body text-ink-900 placeholder:text-ink-700/50 focus:border-gold-600 focus:outline-none'

function Field({ label, children }) {
  return (
    <label className="block text-left">
      <span className="mb-1 block font-body text-xs font-medium text-ink-700">{label}</span>
      {children}
    </label>
  )
}

export function NameEntryPage() {
  const { setPlayerName, setPlayerInfo, setScene } = useGame()
  const { t } = useTranslation()
  const [form, setForm] = useState(EMPTY_FORM)
  const [rejected, setRejected] = useState(false)

  const isComplete = Object.values(form).every((value) => value.trim().length > 0)

  function updateField(field) {
    return (event) => {
      setForm((f) => ({ ...f, [field]: event.target.value }))
      setRejected(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = form.name.trim()
    if (!isComplete) return
    if (!isHienName(trimmedName)) {
      setRejected(true)
      setForm((f) => ({ ...f, name: '' }))
      return
    }
    const info = {
      birthday: form.birthday.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      school: form.school.trim(),
      address: form.address.trim(),
    }
    setPlayerName(trimmedName)
    setPlayerInfo(info)
    submitPlayerInfo({ fullName: trimmedName, ...info })
    setScene('verify')
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <ParchmentPanel className="p-8 text-center">
          <h1 className="mb-2 font-display text-2xl text-ink-900">{t(uiStrings.nameEntryTitle)}</h1>
          <p className="mb-6 text-sm text-ink-700">{t(uiStrings.nameEntrySubtitle)}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label={t(uiStrings.playerInfoNameLabel)}>
              <input
                autoFocus
                value={form.name}
                onChange={updateField('name')}
                placeholder={t(uiStrings.nameEntryPlaceholder)}
                className={`${inputClass} text-center`}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t(uiStrings.playerInfoBirthdayLabel)}>
                <input type="date" value={form.birthday} onChange={updateField('birthday')} className={inputClass} />
              </Field>
              <Field label={t(uiStrings.playerInfoPhoneLabel)}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                  placeholder={t(uiStrings.playerInfoPhonePlaceholder)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label={t(uiStrings.playerInfoEmailLabel)}>
              <input
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder={t(uiStrings.playerInfoEmailPlaceholder)}
                className={inputClass}
              />
            </Field>
            <Field label={t(uiStrings.playerInfoSchoolLabel)}>
              <input
                value={form.school}
                onChange={updateField('school')}
                placeholder={t(uiStrings.playerInfoSchoolPlaceholder)}
                className={inputClass}
              />
            </Field>
            <Field label={t(uiStrings.playerInfoAddressLabel)}>
              <input
                value={form.address}
                onChange={updateField('address')}
                placeholder={t(uiStrings.playerInfoAddressPlaceholder)}
                className={inputClass}
              />
            </Field>
            <Button type="submit" icon={ArrowRight} disabled={!isComplete} className="w-full">
              {t(uiStrings.nameEntryButton)}
            </Button>
          </form>
          <AnimatePresence>
            {rejected ? (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 font-body text-sm font-medium text-red-700"
              >
                {t(uiStrings.nameEntryRejected)}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </ParchmentPanel>
      </motion.div>
    </div>
  )
}
