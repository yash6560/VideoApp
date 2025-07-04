import React from 'react'
import { useThemeStore } from '../store/useTheamStore'
import { PaletteIcon } from 'lucide-react';
import { THEMES } from '../constants';

const TheamSector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className=' dropdown dropdown-end'>
      <button tabIndex={0} className='btn btn-ghost btn-circle'>
        <PaletteIcon className='size-5' />
      </button>

      <div tabIndex={0} className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto'>
        <div className='space-y-1'>
          {THEMES.map((themeItem) => (
            <button key={themeItem.name} className={` w-full px-4 rounded-xl flex items-center gap-3 transition-colors ${theme === themeItem.name ? 'bg-primary/10 text-primary' : 'hover:bg-base-content/5' }`} onClick={() => setTheme(themeItem.name)}>
              <PaletteIcon className='size-4'/>
              <span className='font-medium'>{themeItem.label}</span>
              <div className='ml-auto flex gap-1'>
                {themeItem.colors.map((color, index) => (
                  <span key={index} className='size-2 rounded-full' style={{ backgroundColor: color }}/>
                ))}
              </div>
            </button>
          ))}
           
        </div>
      </div>
    </div>
  )
}

export default TheamSector