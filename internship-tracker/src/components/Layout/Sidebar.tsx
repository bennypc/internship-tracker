import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from '@headlessui/react';
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../authContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    {
      name: 'Profile',
      href: user ? `/u/${user.displayName}` : '',
      icon: UserIcon
    },
    { name: 'Applications', href: '/applications', icon: FolderIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Documents', href: '/documents', icon: DocumentDuplicateIcon },
    { name: 'Reports', href: '/reports', icon: ChartPieIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon }
  ];

  return (
    <>
      <Transition show={sidebarOpen}>
        <Dialog className='relative z-50 lg:hidden' onClose={setSidebarOpen}>
          <TransitionChild
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-900/80' />
          </TransitionChild>

          <div className='fixed inset-0 flex'>
            <TransitionChild
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <DialogPanel className='relative mr-16 flex w-full max-w-xs flex-1'>
                <TransitionChild
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                    <button
                      type='button'
                      className='-m-2.5 p-2.5'
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className='sr-only'>Close sidebar</span>
                      <XMarkIcon
                        className='h-6 w-6 text-white'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </TransitionChild>

                <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10'>
                  <div className='flex h-16 shrink-0 items-center'>
                    <img
                      className='h-8 w-auto'
                      src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                      alt='Your Company'
                    />
                  </div>
                  <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='-mx-2 flex-1 space-y-1'>
                      {navigation.map((item) => {
                        const isCurrent = router.pathname === item.href;
                        return (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                isCurrent
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                              )}
                            >
                              <item.icon
                                className='h-6 w-6 shrink-0'
                                aria-hidden='true'
                              />
                              {item.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Static sidebar for desktop */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4'>
        <div className='flex h-16 shrink-0 items-center justify-center'>
          <img
            className='h-12 w-auto mt-4'
            src='https://edrm.net/wp-content/uploads/2023/12/RL10_01.jpg'
          />
        </div>
        <nav className='mt-8'>
          <ul role='list' className='flex flex-col items-center space-y-1'>
            {navigation.map((item) => {
              const isCurrent = router.pathname === item.href;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      isCurrent
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6'
                    )}
                  >
                    <item.icon
                      className='h-6 w-6 shrink-0'
                      aria-hidden='true'
                    />
                    <span className='sr-only'>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className='sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden'>
        <button
          type='button'
          className='-m-2.5 p-2.5 text-gray-400 lg:hidden'
          onClick={() => setSidebarOpen(true)}
        >
          <span className='sr-only'>Open sidebar</span>
          <Bars3Icon className='h-6 w-6' aria-hidden='true' />
        </button>
        <div className='flex-1 text-sm font-semibold leading-6 text-white'>
          Dashboard
        </div>
        <a href={user ? `/u/${user.displayName}` : '#'}>
          <span className='sr-only'>Your profile</span>
          <img
            className='h-8 w-8 rounded-full bg-gray-800'
            src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            alt=''
          />
        </a>
      </div>
    </>
  );
}
