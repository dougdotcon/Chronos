'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Smile } from 'lucide-react'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  disabled?: boolean
}

const emojiCategories = {
  faces: {
    name: 'Rostos',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳']
  },
  gestures: {
    name: 'Gestos',
    emojis: ['👍', '👎', '👌', '🤞', '✌️', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏']
  },
  objects: {
    name: 'Objetos',
    emojis: ['🎯', '🎲', '🎰', '🎮', '🕹️', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎳', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫']
  },
  symbols: {
    name: 'Símbolos',
    emojis: ['💰', '💎', '💸', '💵', '💴', '💶', '💷', '💳', '💲', '🔥', '⭐', '🌟', '✨', '💫', '⚡', '💥', '💢', '💯', '💢', '💤', '💨', '🎊', '🎉', '🎈', '🎀', '🎁', '🔔', '🔕', '🔊', '🔉', '🔈']
  }
}

export function EmojiPicker({ onEmojiSelect, disabled = false }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('faces')

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
    setIsOpen(false)
  }

  return (
    <div className="emoji-picker-container">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="emoji-picker-trigger"
      >
        <Smile className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="emoji-picker-backdrop"
              onClick={() => setIsOpen(false)}
            />

            {/* Picker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className="emoji-picker-panel"
            >
              {/* Categories */}
              <div className="emoji-picker-categories">
                {Object.entries(emojiCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`emoji-category-btn ${activeCategory === key ? 'active' : ''}`}
                  >
                    {category.emojis[0]}
                  </button>
                ))}
              </div>

              {/* Emojis Grid */}
              <div className="emoji-picker-content">
                <h4 className="emoji-category-title">
                  {emojiCategories[activeCategory as keyof typeof emojiCategories].name}
                </h4>
                
                <div className="emoji-grid">
                  {emojiCategories[activeCategory as keyof typeof emojiCategories].emojis.map((emoji, index) => (
                    <motion.button
                      key={`${emoji}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1, delay: index * 0.01 }}
                      onClick={() => handleEmojiClick(emoji)}
                      className="emoji-btn"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Access */}
              <div className="emoji-picker-quick">
                <span className="emoji-quick-label">Frequentes:</span>
                <div className="emoji-quick-list">
                  {['😀', '👍', '❤️', '😂', '🎉', '🔥', '💰', '🎯'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="emoji-quick-btn"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
