import {
  CheckIcon, 
  ChevronDownIcon,
} from '@heroicons/react/20/solid'
import {  
  useMemo, 
  Fragment,
} from 'react';
import { Menu, Transition } from '@headlessui/react'

import { 
  createIndexes,
} from 'tinybase';
import { 
  useSliceIds,
  useCreateIndexes,
  useCell
} from 'tinybase/ui-react';

import {
  classNames
} from 'lib/helpers'

// TODO: one day, seperate this into a generic Dropdown component
// and wrap it in it's provided data
export function TagDropdown(props) {
  
  const { tableStore, idActiveTag } = props;
  
  
  
  let indexes = useCreateIndexes(tableStore, () => {
    return createIndexes(tableStore).setIndexDefinition(
      'tagText',
      'tag',
      'text'
      );
    });
    
    let tags = useSliceIds('tagText', indexes);
    const activeTagText = useCell('tag', idActiveTag, 'text', tableStore)
    
    const isActive = useMemo(() => {
      return (tag) => {
        return tag === activeTagText
      }
    }, [activeTagText])
    
    
    function handleClickItem(tagText) {
      if (!isActive(tagText)) {
        // convert back out to a number because the 'tag' table is keyed by numbers
        props.onChange(tags.indexOf(tagText))
      }
    }
    
    function handleClickMenu(event) {
      // stop propagation so that the task body doesn't try to close itself.
      event.stopPropagation();
      props.onClick(event);
    }
    
    
    return (
      <Menu 
      as="div" 
      className="relative inline-block text-left"
      onClick={handleClickMenu}
      >
      <div
      onClick={handleClickMenu}
      >
      <Menu.Button className="
      inline-flex w-full justify-center 
      gap-x-1.5 rounded-md bg-white 
      px-2.5 py-1 
      text-gray-700 
      ring-1 ring-inset ring-gray-300 
      hover:ring-amber-600
      focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:outline-none
      " 
      >
      {activeTagText}
      <ChevronDownIcon className="-mr-1.5 mt-1 h-5 w-5 text-gray-400" aria-hidden="true" />
      </Menu.Button>
      </div>
      
      <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      >
      <Menu.Items 
      className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">
      {tags.map(tag => 
        <Menu.Item key={tag}>
        <button
        href={'#'}
        className={classNames(
          isActive(tag) ? 'bg-amber-50 text-gray-900' : 'text-gray-700',
          'px-4 py-2 text-sm',
          'hover:bg-amber-100',
          'w-full text-left flex justify-between'
          )}
          onClick={() => handleClickItem(tag)}
          >
          <span>
          {tag || "None"}
          </span>
          {isActive(tag) && (
            <span
            className={classNames(
              'inset-y top-0 right-0 flex items-center',
              isActive(tag) ? 'text-amber-900' : 'text-amber-600'
              )}
              >
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              )}
              </button>
              </Menu.Item>
              )}
              </div>
              </Menu.Items>
              </Transition>
              </Menu>
              )
            }
            
            
            
            