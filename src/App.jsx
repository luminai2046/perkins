import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Moon, Sun, Home, Settings, User, Menu, X } from 'lucide-react'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <Router>
      <div className={`min-h-screen bg-background text-foreground ${darkMode ? 'dark' : ''}`}>
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-2xl font-bold text-primary">Web App</h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
            <nav className="p-4 space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-primary">Welcome to Your Web App</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A modern, responsive web application built with React, TailwindCSS, and shadcn/ui components.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 text-primary">Modern Design</h3>
          <p className="text-muted-foreground">
            Clean, minimalist interface with a focus on user experience and accessibility.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 text-primary">Responsive Layout</h3>
          <p className="text-muted-foreground">
            Fully responsive design that works seamlessly on desktop, tablet, and mobile devices.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 text-primary">Dark Mode</h3>
          <p className="text-muted-foreground">
            Toggle between light and dark themes for comfortable viewing in any environment.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">Getting Started</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">1</div>
            <span>Navigate through the sidebar to explore different sections</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">2</div>
            <span>Toggle dark mode using the button in the header</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">3</div>
            <span>Customize the application to fit your needs</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Profile</h2>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-semibold">
            JD
          </div>
          <div>
            <h3 className="text-xl font-semibold">John Doe</h3>
            <p className="text-muted-foreground">john.doe@example.com</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Settings</h2>
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span>Enable notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span>Auto-save drafts</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span>Show keyboard shortcuts</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Language</h3>
          <select className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Time Zone</h3>
          <select className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option>UTC-08:00 Pacific Time</option>
            <option>UTC-05:00 Eastern Time</option>
            <option>UTC+00:00 GMT</option>
            <option>UTC+08:00 China Standard Time</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default App
