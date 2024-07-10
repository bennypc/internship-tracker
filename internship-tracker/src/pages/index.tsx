import { Fragment, useState } from 'react';
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
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Profile', href: '#', icon: UserIcon, current: false },
  { name: 'Applications', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon, current: false },
  {
    name: 'Documents',
    href: '/documents',
    icon: DocumentDuplicateIcon,
    current: false
  },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false }
];

const people = [
  {
    name: 'Apple',
    title: 'Electronics',
    email: 'Cupertino',
    role: 'Today',
    status: 'Applied',
    notes: 'Follow up in 2 weeks'
  },
  {
    name: 'Amazon',
    title: 'E-Commerce',
    email: 'Seattle',
    role: '2 days ago',
    status: 'Interview',
    notes: 'Interview on Monday'
  },
  {
    name: 'Google',
    title: 'Advertising',
    email: 'Palo Alto',
    role: '5 days ago',
    status: 'Offer',
    notes: 'Offer received'
  }
];
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  return (
    <>
      <div>
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
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
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
                        ))}
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
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
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
              ))}
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
          <a href='#'>
            <span className='sr-only'>Your profile</span>
            <img
              className='h-8 w-8 rounded-full bg-gray-800'
              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt=''
            />
          </a>
        </div>

        <main className='lg:pl-20'>
          <div className='xl:pl-96'>
            <div className='px-4 py-10 sm:px-6 lg:px-8 lg:py-6'>
              <div className='px-4 sm:px-6 lg:px-8 mt-4'>
                <div className='sm:flex sm:items-center'>
                  <div className='sm:flex-auto'>
                    <h1 className='text-base font-semibold leading-6 text-gray-900'>
                      Internships
                    </h1>
                    <p className='mt-2 text-sm text-gray-700'>
                      A list of all the internships that have been applied to
                    </p>
                  </div>
                  {/* <div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
                    <button
                      type='button'
                      className='block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    >
                      Add user
                    </button>
                  </div> */}
                </div>
                <div className='mt-8 flow-root'>
                  <div className='-mx-4 -my-2 sm:-mx-6 lg:-mx-8'>
                    <div className='inline-block min-w-full py-2 align-middle'>
                      <table className='min-w-full border-separate border-spacing-0'>
                        <thead>
                          <tr>
                            <th
                              scope='col'
                              className='sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8'
                            >
                              Company Name
                            </th>
                            <th
                              scope='col'
                              className='sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell'
                            >
                              Industry
                            </th>
                            <th
                              scope='col'
                              className='sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell'
                            >
                              City
                            </th>
                            <th
                              scope='col'
                              className='sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter'
                            >
                              Apply Date
                            </th>
                            <th
                              scope='col'
                              className='sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell'
                            >
                              Status
                            </th>
                            <th
                              scope='col'
                              className='sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell'
                            >
                              Notes
                            </th>
                            <th
                              scope='col'
                              className='sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8'
                            >
                              <span className='sr-only'>Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {people.map((person, personIdx) => (
                            <tr key={person.email}>
                              <td
                                className={classNames(
                                  personIdx !== people.length - 1
                                    ? 'border-b border-gray-200'
                                    : '',
                                  'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                              >
                                {person.name}
                              </td>
                              <td
                                className={classNames(
                                  personIdx !== people.length - 1
                                    ? 'border-b border-gray-200'
                                    : '',
                                  'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell'
                                )}
                              >
                                {person.title}
                              </td>
                              <td
                                className={classNames(
                                  personIdx !== people.length - 1
                                    ? 'border-b border-gray-200'
                                    : '',
                                  'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell'
                                )}
                              >
                                {person.email}
                              </td>
                              <td
                                className={classNames(
                                  personIdx !== people.length - 1
                                    ? 'border-b border-gray-200'
                                    : '',
                                  'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                )}
                              >
                                {person.role}
                              </td>
                              <td
                                className={classNames(
                                  personIdx !== people.length - 1
                                    ? 'border-b border-gray-200'
                                    : '',
                                  'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell'
                                )}
                              >
                                {person.status}
                              </td>
                              <td
                                className={classNames(
                                  personIdx !== people.length - 1
                                    ? 'border-b border-gray-200'
                                    : '',
                                  'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell'
                                )}
                              >
                                {person.notes}
                              </td>
                              <td
                                className={classNames(
                                  personIdx !== people.length - 1
                                    ? 'border-b border-gray-200'
                                    : '',
                                  'relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                )}
                              >
                                <a
                                  href='#'
                                  className='text-indigo-600 hover:text-indigo-900'
                                >
                                  Edit
                                  <span className='sr-only'>
                                    , {person.name}
                                  </span>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className='fixed inset-y-0 left-20 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block'>
          <div className='space-y-6'>
            <div className='border-b border-gray-900/10 pb-4'>
              <button
                className='flex w-full justify-between items-center text-base font-semibold leading-7 text-gray-900'
                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
              >
                Application Statistics
                {isStatsExpanded ? (
                  <ChevronUpIcon className='h-5 w-5' aria-hidden='true' />
                ) : (
                  <ChevronDownIcon className='h-5 w-5' aria-hidden='true' />
                )}
              </button>
              <Transition
                show={isStatsExpanded}
                enter='transition-all duration-300 ease-out'
                enterFrom='transform opacity-0 max-h-0'
                enterTo='transform opacity-100 max-h-screen'
                leave='transition-all duration-300 ease-in'
                leaveFrom='transform opacity-100 max-h-screen'
                leaveTo='transform opacity-0 max-h-0'
              >
                <div className='mt-4 space-y-2 overflow-hidden'>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Submitted</span>
                    <span>10</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Interview</span>
                    <span>3</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Offer</span>
                    <span>1</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Rejected</span>
                    <span>6</span>
                  </div>
                </div>
              </Transition>
            </div>

            <form>
              <div className='space-y-2'>
                <div className='border-b border-gray-900/10 pb-12'>
                  <h2 className='text-base font-semibold leading-7 text-gray-900'>
                    Add Internship
                  </h2>
                  <p className='mt-1 text-sm leading-6 text-gray-600'>
                    Provide the details for the internship application.
                  </p>

                  <div className='mt-10 grid grid-cols-1 gap-x-24 gap-y-8 sm:grid-cols-6'>
                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='company-name'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Company Name
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          name='company-name'
                          id='company-name'
                          placeholder='Amazon'
                          className='px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='industry'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Industry
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          name='industry'
                          id='industry'
                          placeholder='E-Commerce'
                          className='px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='city'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        City
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          name='city'
                          id='city'
                          placeholder='Vancouver'
                          className='px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='apply-date'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Apply Date
                      </label>
                      <div className='mt-2'>
                        <input
                          type='date'
                          name='apply-date'
                          id='apply-date'
                          className='px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='status'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Status
                      </label>
                      <div className='mt-2'>
                        <select
                          id='status'
                          name='status'
                          className='px-4 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        >
                          <option>Applied</option>
                          <option>Interview</option>
                          <option>Offer</option>
                          <option>Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-6 flex items-center justify-end gap-x-6'>
                <button
                  type='button'
                  className='text-sm font-semibold leading-6 text-gray-900'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
