import { Component } from 'react'

// Nothing in this app catches render errors otherwise, so any uncaught
// throw (a failed texture fetch, a bad shader, a null-deref deep in a
// scene) unmounts the whole React tree and leaves only the page's dark
// background — a silent, unrecoverable black screen. This is the one
// safety net that turns that into a visible, reloadable error instead.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error in app tree:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-ocean-950 p-6 text-center text-parchment-100">
          <p className="font-display text-lg">Đã có lỗi xảy ra. Vui lòng tải lại trang.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full border border-gold-400/60 bg-gradient-to-b from-gold-400 to-gold-600 px-6 py-2.5 font-display text-sm tracking-wide text-ink-900"
          >
            Tải lại
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
