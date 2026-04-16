import { useState, useRef, useEffect } from 'react'
import { Download, Upload, Type, Image, Palette, Settings, Plus, Trash2 } from 'lucide-react'

function App() {
  const canvasRef = useRef(null)
  const [text, setText] = useState('Enter your text here...')
  const [selectedFont, setSelectedFont] = useState('Arial')
  const [fontSize, setFontSize] = useState(24)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [fontWeight, setFontWeight] = useState('normal')
  const [fontStyle, setFontStyle] = useState('normal')
  const [padding, setPadding] = useState(40)
  const [selectedBackground, setSelectedBackground] = useState('#ffffff')
  const [uploadedFonts, setUploadedFonts] = useState([])
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState([])
  const [showFontUpload, setShowFontUpload] = useState(false)
  const [showBackgroundUpload, setShowBackgroundUpload] = useState(false)

  // Default backgrounds
  const defaultBackgrounds = [
    '#ffffff',
    '#f8f9fa',
    '#e9ecef',
    '#fef3c7',
    '#dbeafe',
    '#fce7f3',
    '#d1fae5',
    '#fed7aa'
  ]

  useEffect(() => {
    renderCanvas()
  }, [text, selectedFont, fontSize, lineHeight, letterSpacing, fontWeight, fontStyle, padding, selectedBackground])

  const renderCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const width = 1080
    const height = 1440
    
    canvas.width = width
    canvas.height = height
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Draw background
    if (selectedBackground.startsWith('#')) {
      ctx.fillStyle = selectedBackground
      ctx.fillRect(0, 0, width, height)
    } else {
      // Handle image background
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
        drawText(ctx, width, height)
      }
      img.src = selectedBackground
      return
    }
    
    drawText(ctx, width, height)
  }

  const drawText = (ctx, width, height) => {
    ctx.fillStyle = '#000000'
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize * 4}px ${selectedFont}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    
    const maxWidth = width - (padding * 2)
    const lineHeightPx = fontSize * 4 * lineHeight
    const letterSpacingPx = letterSpacing * 4
    
    const lines = wrapText(ctx, text, maxWidth, letterSpacingPx)
    let y = padding
    
    lines.forEach(line => {
      let x = padding
      for (let i = 0; i < line.length; i++) {
        ctx.fillText(line[i], x, y)
        x += ctx.measureText(line[i]).width + letterSpacingPx
      }
      y += lineHeightPx
    })
  }

  const wrapText = (ctx, text, maxWidth, letterSpacing) => {
    const words = text.split(' ')
    const lines = []
    let currentLine = ''
    
    for (let word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const testWidth = ctx.measureText(testLine).width + (testLine.length - 1) * letterSpacing
      
      if (testWidth <= maxWidth) {
        currentLine = testLine
      } else {
        if (currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          lines.push(word)
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines
  }

  const exportImage = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'perkins-export.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleFontUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const fontName = file.name.replace(/\.[^/.]+$/, '')
        const fontUrl = event.target.result
        
        // Create font face
        const fontFace = new FontFace(fontName, `url(${fontUrl})`)
        fontFace.load().then(() => {
          document.fonts.add(fontFace)
          setUploadedFonts(prev => [...prev, { name: fontName, url: fontUrl }])
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleBackgroundUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedBackgrounds(prev => [...prev, { name: file.name, url: event.target.result }])
      }
      reader.readAsDataURL(file)
    })
  }

  const deleteFont = (fontName) => {
    setUploadedFonts(prev => prev.filter(font => font.name !== fontName))
  }

  const deleteBackground = (bgName) => {
    setUploadedBackgrounds(prev => prev.filter(bg => bg.name !== bgName))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Perkins</h1>
          <p className="text-gray-600 mt-2">Transform text into beautiful images</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Preview</h2>
                <button
                  onClick={exportImage}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Export Image
                </button>
              </div>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto"
                  style={{ maxHeight: '600px', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Text Input */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Text Content</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your text here..."
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Font Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Type size={20} />
                  Typography
                </h2>
                <button
                  onClick={() => setShowFontUpload(!showFontUpload)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Upload size={16} />
                </button>
              </div>

              {showFontUpload && (
                <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    multiple
                    onChange={handleFontUpload}
                    className="text-sm"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Courier New">Courier New</option>
                    {uploadedFonts.map(font => (
                      <option key={font.name} value={font.name}>{font.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">{fontSize}px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                  <select
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Style</label>
                  <select
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">{lineHeight}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Letter Spacing</label>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">{letterSpacing}px</div>
                </div>
              </div>
            </div>

            {/* Background Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Palette size={20} />
                  Background
                </h2>
                <button
                  onClick={() => setShowBackgroundUpload(!showBackgroundUpload)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Upload size={16} />
                </button>
              </div>

              {showBackgroundUpload && (
                <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBackgroundUpload}
                    className="text-sm"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Solid Colors</label>
                  <div className="grid grid-cols-4 gap-2">
                    {defaultBackgrounds.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedBackground(color)}
                        className={`w-full h-10 rounded-lg border-2 transition-all ${
                          selectedBackground === color ? 'border-blue-500' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {uploadedBackgrounds.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Images</label>
                    <div className="space-y-2">
                      {uploadedBackgrounds.map(bg => (
                        <div key={bg.name} className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBackground(bg.url)}
                            className={`flex-1 h-10 rounded border-2 transition-all ${
                              selectedBackground === bg.url ? 'border-blue-500' : 'border-gray-300'
                            }`}
                            style={{ 
                              backgroundImage: `url(${bg.url})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          />
                          <button
                            onClick={() => deleteBackground(bg.name)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Layout Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Settings size={20} />
                Layout
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">{padding}px</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
