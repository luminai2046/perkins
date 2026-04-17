import { useState, useRef, useEffect } from 'react'
import { Download, Upload, Type, Image, Palette, Settings, Plus, Trash2 } from 'lucide-react'

function App() {
  const canvasRef = useRef(null)
  
  // Default text constant
  const defaultText = "Here's to the crazy ones. The misfits. The rebels. The troublemakers. The round pegs in the square holes. The ones who see things differently. They're not fond of rules. And they have no respect for the status quo. You can quote them, disagree with them, glorify or vilify them. About the only thing you can't do is ignore them. Because they change things. They push the human race forward. And while some may see them as the crazy ones, we see genius. Because the people who are crazy enough to think they can change the world, are the ones who do."
  
  // Load saved settings from localStorage
  const loadSettings = () => {
    const savedFont = localStorage.getItem('perkins-selectedFont') || 'Arial'
    const savedFontSize = parseInt(localStorage.getItem('perkins-fontSize')) || 14
    const savedLineHeight = parseFloat(localStorage.getItem('perkins-lineHeight')) || 1.7
    const savedLetterSpacing = parseFloat(localStorage.getItem('perkins-letterSpacing')) || 0
    const savedFontWeight = localStorage.getItem('perkins-fontWeight') || 'normal'
    const savedFontStyle = localStorage.getItem('perkins-fontStyle') || 'normal'
    const savedPadding = parseInt(localStorage.getItem('perkins-padding')) || 72
    const savedBackground = localStorage.getItem('perkins-selectedBackground') || '#f3f4f6'
    const savedText = localStorage.getItem('perkins-text') || defaultText
    const savedFonts = JSON.parse(localStorage.getItem('perkins-uploadedFonts') || '[]')
    const savedBackgrounds = JSON.parse(localStorage.getItem('perkins-uploadedBackgrounds') || '[]')
    
    return {
      selectedFont: savedFont,
      fontSize: savedFontSize,
      lineHeight: savedLineHeight,
      letterSpacing: savedLetterSpacing,
      fontWeight: savedFontWeight,
      fontStyle: savedFontStyle,
      padding: savedPadding,
      selectedBackground: savedBackground,
      text: savedText,
      uploadedFonts: savedFonts,
      uploadedBackgrounds: savedBackgrounds
    }
  }
  
  const savedSettings = loadSettings()
  
  const [text, setText] = useState(savedSettings.text)
  const [selectedFont, setSelectedFont] = useState(savedSettings.selectedFont)
  const [fontSize, setFontSize] = useState(savedSettings.fontSize)
  const [lineHeight, setLineHeight] = useState(savedSettings.lineHeight)
  const [letterSpacing, setLetterSpacing] = useState(savedSettings.letterSpacing)
  const [fontWeight, setFontWeight] = useState(savedSettings.fontWeight)
  const [fontStyle, setFontStyle] = useState(savedSettings.fontStyle)
  const [padding, setPadding] = useState(savedSettings.padding)
  const [selectedBackground, setSelectedBackground] = useState(savedSettings.selectedBackground)
  const [uploadedFonts, setUploadedFonts] = useState(savedSettings.uploadedFonts)
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState(savedSettings.uploadedBackgrounds)
  const [showFontUpload, setShowFontUpload] = useState(false)
  const [showBackgroundUpload, setShowBackgroundUpload] = useState(false)
  const [isTextFocused, setIsTextFocused] = useState(false)
  const [hasUserInput, setHasUserInput] = useState(false)
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('perkins-selectedFont', selectedFont)
    localStorage.setItem('perkins-fontSize', fontSize.toString())
    localStorage.setItem('perkins-lineHeight', lineHeight.toString())
    localStorage.setItem('perkins-letterSpacing', letterSpacing.toString())
    localStorage.setItem('perkins-fontWeight', fontWeight)
    localStorage.setItem('perkins-fontStyle', fontStyle)
    localStorage.setItem('perkins-padding', padding.toString())
    localStorage.setItem('perkins-selectedBackground', selectedBackground)
    localStorage.setItem('perkins-text', text)
    localStorage.setItem('perkins-uploadedFonts', JSON.stringify(uploadedFonts))
    localStorage.setItem('perkins-uploadedBackgrounds', JSON.stringify(uploadedBackgrounds))
  }, [selectedFont, fontSize, lineHeight, letterSpacing, fontWeight, fontStyle, padding, selectedBackground, text, uploadedFonts, uploadedBackgrounds])
  
  // Handle text focus and blur events
  const handleTextFocus = () => {
    setIsTextFocused(true)
    if (text === defaultText) {
      setText('')
    }
  }
  
  const handleTextBlur = () => {
    setIsTextFocused(false)
    if (text.trim() === '') {
      setText(defaultText)
      setHasUserInput(false)
    } else {
      setHasUserInput(true)
    }
  }
  
  const handleTextChange = (e) => {
    setText(e.target.value)
    if (e.target.value.trim() !== '') {
      setHasUserInput(true)
    }
  }
  
  // Load fonts from localStorage on mount
  useEffect(() => {
    const savedFonts = JSON.parse(localStorage.getItem('perkins-uploadedFonts') || '[]')
    savedFonts.forEach(font => {
      const fontFace = new FontFace(font.name, `url(${font.url})`)
      fontFace.load().then(() => {
        document.fonts.add(fontFace)
      }).catch(err => {
        console.warn('Failed to load font:', font.name, err)
      })
    })
  }, [])

  // Default backgrounds
  const defaultBackgrounds = [
    '#f3f4f6', // Light gray (default)
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
    
    // For preview: use container size
    const container = canvas.parentElement
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    // Calculate 3:4 aspect ratio dimensions that fit in container
    let previewWidth, previewHeight
    const containerRatio = containerWidth / containerHeight
    const targetRatio = 3 / 4 // 3:4 ratio (width:height)
    
    if (containerRatio > targetRatio) {
      // Container is wider than target ratio, use height as limiting factor
      previewHeight = containerHeight
      previewWidth = containerHeight * targetRatio
    } else {
      // Container is taller than target ratio, use width as limiting factor
      previewWidth = containerWidth
      previewHeight = containerWidth / targetRatio
    }
    
    // Use higher resolution for sharper text (2x for retina displays)
    const resolutionScale = 2
    const canvasWidth = previewWidth * resolutionScale
    const canvasHeight = previewHeight * resolutionScale
    
    // Set canvas to high resolution
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    
    // Scale canvas to fit container
    canvas.style.width = previewWidth + 'px'
    canvas.style.height = previewHeight + 'px'
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
    // For export: keep 1080x1440
    const exportWidth = 1080
    const exportHeight = 1440
    
    // Scale factor for rendering (from export resolution to high-res preview)
    const scale = Math.min(canvasWidth / exportWidth, canvasHeight / exportHeight)
    const scaledWidth = exportWidth * scale
    const scaledHeight = exportHeight * scale
    const offsetX = (canvasWidth - scaledWidth) / 2
    const offsetY = (canvasHeight - scaledHeight) / 2
    
    // Save context state
    ctx.save()
    
    // Apply scaling for preview
    ctx.translate(offsetX, offsetY)
    ctx.scale(scale, scale)
    
    // Draw background
    if (selectedBackground.startsWith('#')) {
      ctx.fillStyle = selectedBackground
      ctx.fillRect(0, 0, exportWidth, exportHeight)
    } else {
      // Handle image background
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, exportWidth, exportHeight)
        drawText(ctx, exportWidth, exportHeight)
        ctx.restore()
      }
      img.src = selectedBackground
      return
    }
    
    drawText(ctx, exportWidth, exportHeight)
    ctx.restore()
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
      if (letterSpacingPx > 0) {
        // Render with letter spacing
        let x = padding
        for (let i = 0; i < line.length; i++) {
          ctx.fillText(line[i], x, y)
          x += ctx.measureText(line[i]).width + letterSpacingPx
        }
      } else {
        // Render normally for better performance
        ctx.fillText(line, padding, y)
      }
      y += lineHeightPx
    })
  }

  const wrapText = (ctx, text, maxWidth, letterSpacing) => {
    const lines = []
    let currentLine = ''
    
    // Chinese punctuation that should not appear at line start
    const chinesePunctuation = /[,\u3002\uff0c\uff01\uff1f\uff1b\uff1a""''\u300c\u300d\u300e\u300f\u3010\u3011\u300a\u300b\u3008\u3009\u301c\u301d\u301e\u301f]/g
    
    // Split text into words, but also handle very long words
    const words = text.split(' ')
    
    for (let word of words) {
      // Test if adding this word to current line exceeds max width
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const testWidth = ctx.measureText(testLine).width + (testLine.length - 1) * letterSpacing
      
      if (testWidth <= maxWidth) {
        currentLine = testLine
      } else {
        // If current line is not empty, push it
        if (currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          // Handle very long single word that exceeds max width
          if (ctx.measureText(word).width > maxWidth) {
            // Break the long word character by character
            let wordPart = ''
            for (let i = 0; i < word.length; i++) {
              const testWord = wordPart + word[i]
              const wordWidth = ctx.measureText(testWord).width + (testWord.length - 1) * letterSpacing
              
              if (wordWidth <= maxWidth) {
                wordPart = testWord
              } else {
                if (wordPart) {
                  lines.push(wordPart)
                  wordPart = word[i]
                } else {
                  lines.push(word[i])
                }
              }
            }
            if (wordPart) {
              currentLine = wordPart
            }
          } else {
            currentLine = word
          }
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    // Post-process lines to handle Chinese punctuation
    return fixChinesePunctuation(lines, chinesePunctuation)
  }

  const fixChinesePunctuation = (lines, punctuationRegex) => {
    const fixedLines = [...lines]
    
    for (let i = 1; i < fixedLines.length; i++) {
      const currentLine = fixedLines[i]
      const previousLine = fixedLines[i - 1]
      
      // Check if current line starts with Chinese punctuation
      if (punctuationRegex.test(currentLine.charAt(0))) {
        // Move the punctuation to the end of the previous line
        const punctuation = currentLine.charAt(0)
        const remainingText = currentLine.slice(1)
        
        fixedLines[i - 1] = previousLine + punctuation
        fixedLines[i] = remainingText
        
        // If the remaining text is empty, remove this line
        if (remainingText.trim() === '') {
          fixedLines.splice(i, 1)
          i-- // Adjust index since we removed a line
        }
      }
    }
    
    return fixedLines
  }

  const exportImage = () => {
    // Create a temporary canvas for export at full resolution
    const exportCanvas = document.createElement('canvas')
    const exportCtx = exportCanvas.getContext('2d')
    
    const exportWidth = 1080
    const exportHeight = 1440
    
    exportCanvas.width = exportWidth
    exportCanvas.height = exportHeight
    
    // Clear export canvas
    exportCtx.clearRect(0, 0, exportWidth, exportHeight)
    
    // Draw background
    if (selectedBackground.startsWith('#')) {
      exportCtx.fillStyle = selectedBackground
      exportCtx.fillRect(0, 0, exportWidth, exportHeight)
    } else {
      // Handle image background
      const img = new Image()
      img.onload = () => {
        exportCtx.drawImage(img, 0, 0, exportWidth, exportHeight)
        drawTextForExport(exportCtx, exportWidth, exportHeight)
        downloadCanvas(exportCanvas)
      }
      img.src = selectedBackground
      return
    }
    
    drawTextForExport(exportCtx, exportWidth, exportHeight)
    downloadCanvas(exportCanvas)
  }
  
  const drawTextForExport = (ctx, width, height) => {
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
      if (letterSpacingPx > 0) {
        let x = padding
        for (let i = 0; i < line.length; i++) {
          ctx.fillText(line[i], x, y)
          x += ctx.measureText(line[i]).width + letterSpacingPx
        }
      } else {
        ctx.fillText(line, padding, y)
      }
      y += lineHeightPx
    })
  }
  
  const downloadCanvas = (canvas) => {
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
    <div className="flex h-screen" style={{ backgroundColor: '#F6F4F0' }}>
        {/* Left: Preview (61.8%) */}
        <div className="w-[61.8%] p-3">
          <div className="h-full bg-white rounded-lg shadow-sm p-4 relative">
            <div className="h-full overflow-hidden relative flex items-center justify-center rounded-lg">
              <canvas
                ref={canvasRef}
                className="absolute rounded-lg"
              />
            </div>
            <button
              onClick={exportImage}
              className="absolute bottom-4 right-4 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
            >
              Save
            </button>
          </div>
        </div>

        {/* Right: Controls (38.2%) */}
        <div className="w-[38.2%] p-3 overflow-y-auto">
          <div className="space-y-4 max-w-2xl mx-auto">
            
            {/* Text Input */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <textarea
                value={text}
                onChange={handleTextChange}
                onFocus={handleTextFocus}
                onBlur={handleTextBlur}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${text === defaultText && !isTextFocused ? 'text-gray-400 leading-relaxed' : 'text-gray-900'}`}
                style={{ minHeight: '120px', maxHeight: '300px' }}
                placeholder="Enter your text here..."
              />
            </div>

            {/* Font Selection */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Fonts</span>
                <button
                  onClick={() => setShowFontUpload(!showFontUpload)}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  +
                </button>
              </div>

              {showFontUpload && (
                <div className="mb-3 p-2 border border-gray-200 rounded-lg">
                  <input
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    multiple
                    onChange={handleFontUpload}
                    className="text-sm"
                  />
                </div>
              )}

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

            {/* Typography Controls (Row) */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">Size</label>
                    <span className="text-sm text-gray-400">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <select
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                  <select
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Spacing Controls (Row) */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">Line Height</label>
                    <span className="text-sm text-gray-400">{lineHeight}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">Letter Spacing</label>
                    <span className="text-sm text-gray-400">{letterSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">Padding</label>
                    <span className="text-sm text-gray-400">{padding}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Background Selection */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Background</span>
                <button
                  onClick={() => setShowBackgroundUpload(!showBackgroundUpload)}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  +
                </button>
              </div>

              {showBackgroundUpload && (
                <div className="mb-3 p-2 border border-gray-200 rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBackgroundUpload}
                    className="text-sm"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <div className="grid grid-cols-5 gap-2">
                    {defaultBackgrounds.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedBackground(color)}
                        className={`w-full h-8 rounded border-2 transition-all ${
                          selectedBackground === color ? 'border-blue-500' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {uploadedBackgrounds.length > 0 && (
                  <div className="space-y-2">
                    {uploadedBackgrounds.map(bg => (
                      <div key={bg.name} className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBackground(bg.url)}
                          className={`flex-1 h-8 rounded border-2 transition-all ${
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
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
    </div>
  )
}

export default App
